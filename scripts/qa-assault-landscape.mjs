import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../src/components/NexusSerpentDemo.tsx', import.meta.url), 'utf8');
const section = (from, to) => {
  const start = src.indexOf(from);
  const end = src.indexOf(to, start + from.length);
  assert.ok(start >= 0 && end > start, 'Missing source markers: ' + from);
  return src.slice(start, end);
};
const rules = [
  ['Same landscape dimensions as Red Vital and Survival', src.includes('const ASSAULT_WORLD_WIDTH = EXPLORATION_WORLD_WIDTH;') && src.includes('const ASSAULT_WORLD_HEIGHT = EXPLORATION_WORLD_HEIGHT;')],
  ['No obsolete circular Assault arena radius', !src.includes('NEXUS_ASSAULT_ARENA_RADIUS') && !src.includes('NEXUS_ASSAULT_ROOM_RADIUS_SCALE')],
  ['Reset begins at panorama centre', src.includes("gameMode === 'nexus_assault') ? EXPLORATION_WORLD_WIDTH / 2 : 1425;")],
  ['Player movement evaluates full world width', src.includes("core.gameMode === 'nexus_assault' ? core.arenaWidth : size;")],
  ['Hard room boundary clamps both X and Y with world dimensions', section('const constrainPointToRoom', 'const getSelectedAssaultHeroEnergy').includes('ASSAULT_WORLD_WIDTH - margin') && section('const constrainPointToRoom', 'const getSelectedAssaultHeroEnergy').includes('ASSAULT_WORLD_HEIGHT - margin')],
  ['Assault camera follows player instead of fixed-room fit', !section('const getViewportCamera', 'const pointerToWorld').includes("if (core.gameMode === 'nexus_assault')") && section('const getViewportCamera', 'const pointerToWorld').includes('centerX = core.player.x')],
  ['Room renderer traces full rectangular edge', section('const drawNexusAssaultRoom', 'const handleStartPlaying').includes('ctx.rect(-offset, -offset, ASSAULT_WORLD_WIDTH + 2 * offset, ASSAULT_WORLD_HEIGHT + 2 * offset)')],
  ['Encounter spawning stays near current player', section('const getAssaultSpawnPos', 'const getOrbiCorePalette').includes('core.player.x + Math.cos(angle) * distance')],
  ['All room transitions keep panoramic shape', src.includes("nexusAssaultState.room.shape = 'WIDE_RECTANGLE';") && src.includes("core.assaultRun.room.shape = 'WIDE_RECTANGLE';")],
  ['Projectiles and enemies use distinct X and Y boundaries', section('const updateNexusAssault', 'const drawAssaultLivingBackdrop').includes('boxMaxX + 100') && section('const updateNexusAssault', 'const drawAssaultLivingBackdrop').includes('boxMaxY + 100')],
  ['Assault radar plots full world map', section('function AssaultRadarMinimap', 'interface OrbiHeroInfoPanelProps').includes('x / ASSAULT_WORLD_WIDTH * mapW') && section('function AssaultRadarMinimap', 'interface OrbiHeroInfoPanelProps').includes('mapX(enemy.x)')],
  ['Boss movement follows its new encounter anchor', src.includes('boss.homeX ?? ASSAULT_WORLD_CENTER_X') && src.includes('boss.homeY ?? ASSAULT_WORLD_CENTER_Y')],
];
let failures = 0;
for (const [name, ok] of rules) {
  if (!ok) {
    console.error('[AS16] FAIL ' + name);
    failures++;
  } else {
    console.log('[AS16] OK   ' + name);
  }
}
if (failures > 0) {
  console.error('[AS16] ' + failures + ' landscape regression checks failed.');
  process.exit(1);
}
console.log('[AS16] PASS: ' + rules.length + ' source invariant checks. Manual gameplay and 25% zoom remain necessary.');
