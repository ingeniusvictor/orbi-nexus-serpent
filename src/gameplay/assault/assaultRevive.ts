import { ORBI_ASSAULT_RECONNECTION_OFFER } from '../../economy/orbiEconomy';

/**
 * ORBI NEXUS ASSAULT — single, non-monetized emergency reconnect.
 * Does not change enemy HP, weapons, combat modules, score, room or evolution.
 */
export const ASSAULT_RECONNECT_POLICY = Object.freeze({
  freeRevivesPerRun: 1,
  healthFraction: 0.60,
  shieldSeconds: 3.0,
  maxFreeRevivesPerRun: 1,
});

export type AssaultReviveOffer =
  | { kind: 'free'; label: string; cost: 0 }
  | { kind: 'future_currency'; label: string; cost: number; enabled: false };

export function getAssaultReviveOffer(used: number): AssaultReviveOffer {
  const count = Number.isFinite(used) ? Math.max(0, Math.floor(used)) : 0;
  if (count < ASSAULT_RECONNECT_POLICY.freeRevivesPerRun) {
    return { kind: 'free', label: 'RECONEXIÓN DE EMERGENCIA GRATIS', cost: 0 };
  }
  return {
    kind: 'future_currency',
    label: 'RECONEXIÓN CON PRISMAS ORBI — PRÓXIMAMENTE',
    cost: ORBI_ASSAULT_RECONNECTION_OFFER.costPrismas,
    enabled: false,
  };
}

export function computeAssaultRevivalHp(maxHp: number): number {
  if (!Number.isFinite(maxHp) || maxHp <= 0) return 0;
  return Math.max(1, Math.min(maxHp, Math.ceil(maxHp * ASSAULT_RECONNECT_POLICY.healthFraction)));
}

export function tickAssaultReviveShield(remainingSec: number, frameSeconds: number): number {
  if (!Number.isFinite(remainingSec) || remainingSec <= 0) return 0;
  const dt = Number.isFinite(frameSeconds) ? Math.max(0, Math.min(0.1, frameSeconds)) : 0;
  return Math.max(0, remainingSec - dt);
}

export function canUseFreeAssaultRevive(
  mode: string, screen: string, remainingHp: number, used: number
): boolean {
  return mode === 'nexus_assault' && screen === 'GAMEOVER' &&
    remainingHp <= 0 && getAssaultReviveOffer(used).kind === 'free';
}
