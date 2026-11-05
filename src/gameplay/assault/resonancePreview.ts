/**
 * AS-R2 / Nexus Assault — loop geometry preview with closure events for the Cerco de Resonancia.
 *
 * This module does not directly mutate movement, enemies, HP, projectiles, modules, or other
 * modes. One caller owns the simulation tick and renders its returned state.
 */
import {
  detectResonanceLoop,
  pointInPolygon,
  polygonBounds,
  type AssaultPoint,
  type ResonanceLoop,
} from './resonanceGeometry';

export const ASSAULT_RESONANCE_PREVIEW_ENABLED = true;
export const ASSAULT_RESONANCE_COOLDOWN_SEC = 2.2;
export const ASSAULT_RESONANCE_DISPLAY_SEC = 1.7;

export interface AssaultResonanceTarget extends AssaultPoint {
  health: number;
  type?: string;
  archetype?: string;
}

export interface AssaultResonanceActivePreview {
  loop: ResonanceLoop;
  targetsInside: number;
  remainingSec: number;
}

export interface AssaultResonancePreviewState {
  previousHead: AssaultPoint | null;
  roomIndex: number | null;
  cooldownSec: number;
  active: AssaultResonanceActivePreview | null;
  totalClosures: number;
}

export interface AssaultResonancePreviewInput {
  head: AssaultPoint;
  body: readonly AssaultPoint[];
  targets: readonly AssaultResonanceTarget[];
  roomIndex: number;
  dtSec: number;
  combatActive: boolean;
}

export type AssaultResonancePreviewResult = {
  state: AssaultResonancePreviewState;
  closedNow: boolean;
  targetsInside: number;
};

export function createAssaultResonancePreviewState(): AssaultResonancePreviewState {
  return { previousHead: null, roomIndex: null, cooldownSec: 0, active: null, totalClosures: 0 };
}

export function advanceAssaultResonancePreview(
  state: AssaultResonancePreviewState,
  input: AssaultResonancePreviewInput
): AssaultResonancePreviewResult {
  const seconds = Number.isFinite(input.dtSec) ? Math.max(0, Math.min(0.07, input.dtSec)) : 0;
  const roomChanged = state.roomIndex !== input.roomIndex;
  const validFrame = input.combatActive && Number.isFinite(input.head.x) &&
    Number.isFinite(input.head.y) && input.body.length > 0;
  if (roomChanged || !validFrame) {
    return {
      state: {
        previousHead: validFrame ? { x: input.head.x, y: input.head.y } : null,
        roomIndex: input.roomIndex,
        cooldownSec: 0,
        active: null,
        totalClosures: state.totalClosures,
      },
      closedNow: false,
      targetsInside: 0,
    };
  }

  const cooldownSec = Math.max(0, state.cooldownSec - seconds);
  const active = state.active && state.active.remainingSec > seconds
    ? { ...state.active, remainingSec: state.active.remainingSec - seconds }
    : null;

  const head = { x: input.head.x, y: input.head.y };
  if (!state.previousHead || cooldownSec > 0) {
    return {
      state: {
        previousHead: head,
        roomIndex: input.roomIndex,
        cooldownSec,
        active,
        totalClosures: state.totalClosures,
      },
      closedNow: false,
      targetsInside: 0,
    };
  }

  const loop = detectResonanceLoop(state.previousHead, head, input.body);
  if (!loop) {
    return {
      state: {
        previousHead: head,
        roomIndex: input.roomIndex,
        cooldownSec: 0,
        active,
        totalClosures: state.totalClosures,
      },
      closedNow: false,
      targetsInside: 0,
    };
  }

  const bounds = polygonBounds(loop.polygon);
  let count = 0;
  if (bounds) {
    for (const enemy of input.targets) {
      if (!Number.isFinite(enemy.x) || !Number.isFinite(enemy.y) ||
          !Number.isFinite(enemy.health) || enemy.health <= 0 ||
          enemy.type === 'REST_BEACON' || enemy.archetype === 'rest_beacon') continue;
      if (enemy.x < bounds.minX || enemy.x > bounds.maxX ||
          enemy.y < bounds.minY || enemy.y > bounds.maxY) continue;
      if (pointInPolygon(enemy, loop.polygon)) count++;
    }
  }

  return {
    state: {
      previousHead: head,
      roomIndex: input.roomIndex,
      cooldownSec: ASSAULT_RESONANCE_COOLDOWN_SEC,
      active: { loop, targetsInside: count, remainingSec: ASSAULT_RESONANCE_DISPLAY_SEC },
      totalClosures: state.totalClosures + 1,
    },
    closedNow: true,
    targetsInside: count,
  };
}

export function drawAssaultResonancePreview(
  ctx: CanvasRenderingContext2D,
  state: AssaultResonancePreviewState,
  energyColor: string,
  lowEffectsMode: boolean
): void {
  const active = state.active;
  if (!active || active.loop.polygon.length < 3) return;
  const fade = Math.max(0, Math.min(1, active.remainingSec / 0.45));
  if (fade <= 0) return;
  const vertices = active.loop.polygon;
  const bounds = polygonBounds(vertices);
  if (!bounds) return;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(vertices[0].x, vertices[0].y);
  for (let i = 1; i < vertices.length; i++) {
    ctx.lineTo(vertices[i].x, vertices[i].y);
  }
  ctx.closePath();
  ctx.globalAlpha = 0.10 * fade;
  ctx.fillStyle = energyColor;
  ctx.fill();

  ctx.strokeStyle = energyColor;
  ctx.lineWidth = 7;
  ctx.globalAlpha = 0.84 * fade;
  if (!lowEffectsMode) {
    ctx.shadowColor = energyColor;
    ctx.shadowBlur = 19;
  }
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.globalAlpha = 0.74 * fade;
  ctx.lineWidth = 2.2;
  ctx.setLineDash([12, 9]);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.globalAlpha = fade;
  ctx.beginPath();
  ctx.arc(active.loop.intersection.x, active.loop.intersection.y, 12, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.strokeStyle = energyColor;
  ctx.lineWidth = 3;
  ctx.stroke();

  const labelX = (bounds.minX + bounds.maxX) / 2;
  const labelY = Math.max(24, bounds.minY - 26);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = '#020617';
  ctx.shadowBlur = lowEffectsMode ? 0 : 8;
  ctx.font = 'bold 19px monospace';
  ctx.fillStyle = '#d8fcff';
  ctx.fillText('CERCO DE RESONANCIA', labelX, labelY);
  ctx.font = '12px monospace';
  ctx.fillStyle = energyColor;
  ctx.fillText('CERCO ACTIVO · ' + active.targetsInside + ' OBJETIVOS',
    labelX, labelY + 18);
  ctx.restore();
}
