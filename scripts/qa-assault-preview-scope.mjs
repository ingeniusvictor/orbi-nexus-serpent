import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../src/components/NexusSerpentDemo.tsx', import.meta.url), 'utf8');
const preview = readFileSync(new URL('../src/gameplay/assault/resonancePreview.ts', import.meta.url), 'utf8');
const geometry = readFileSync(new URL('../src/gameplay/assault/resonanceGeometry.ts', import.meta.url), 'utf8');

const checks = [
  ['Preview has one dedicated module import', src.split("from '../gameplay/assault/resonancePreview'").length === 2],
  ['Preview uses a ref and never makes React update per frame',
   src.includes('const assaultResonancePreviewRef = useRef(createAssaultResonancePreviewState());')],
  ['Preview simulation gated strictly to Assault',
   src.includes("core.gameMode === 'nexus_assault' && core.assaultRun") &&
   src.includes('ASSAULT_RESONANCE_PREVIEW_ENABLED &&')],
  ['Preview only detects while combat active and no cinematic',
   src.includes("combatActive: assaultRun.run?.status === 'combat'") &&
   src.includes('!cinematicActiveRef.current')],
  ['Preview mode reset occurs on each run', src.includes('assaultResonancePreviewRef.current = createAssaultResonancePreviewState();')],
  ['Preview only draws in the Assault renderer',
   src.includes('drawNexusAssaultRoom(ctx, dt);') &&
   src.includes('drawAssaultResonancePreview(') &&
   src.indexOf('drawAssaultResonancePreview(') > src.indexOf('drawNexusAssaultRoom(ctx, dt);')],
  ['HUD is explicitly labeled visual / no damage',
   src.includes('CERCO DE RESONANCIA') && src.includes('SIN DAÑO · PROTOTIPO')],
  ['Preview module has no direct gameplay state',
   !/stateRef|setAssaultRunHp|core\.assaultRun|localStorage|requestAnimationFrame/.test(preview)],
  ['Preview module cannot directly mutate HP, health, or energy',
   !/\.(?:hp|health|energy|score)\s*(?:=|\+=|-=)/.test(preview)],
  ['Preview geometry module has no game engine or browser dependencies',
   !/stateRef|requestAnimationFrame|window\.|document\.|localStorage|Math\.random/.test(geometry)],
];

let bad = 0;
for (const [description, passed] of checks) {
  console.log((passed ? '[AS-R1B] OK  ' : '[AS-R1B] FAIL ') + description);
  if (!passed) bad++;
}
assert.equal(bad, 0, bad + ' Assault preview scope invariant(s) broken');
console.log('[AS-R1B] PASS: ' + checks.length + ' static isolation guards. Browser gameplay still requires manual QA.');
