import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const src=readFileSync(new URL('../src/components/NexusSerpentDemo.tsx',import.meta.url),'utf8').replace(/\r\n?/g,'\n');
const tests=[
 ['transition guard',src.includes("ensureAssaultVisualContinuity('room transition '")],
 ['room entry guard',src.includes("ensureAssaultVisualContinuity('room entry '")],
 ['update guard',src.includes("ensureAssaultVisualContinuity('combat tick')")],
 ['pre-camera guard',src.includes("ensureAssaultVisualContinuity('before camera')")],
 ['module re-anchoring',src.includes("syncAssaultModulesToBodySlots();\n      console.warn('[ASSAULT CONTINUITY]'")],
 ['boss serpent gate',src.includes('shouldUseSerpentBossSilhouette(core.assaultRun?.roomIndex ?? 0)')],
 ['serpent boss renderer',src.includes('drawSerpentBossForm(ctx, boss, core.vitalEnergyWind);')],
 ['base serpent enemies unchanged',src.includes('drawSerpentEnemy(ctx, enemy);')]
];
for(const [name,ok] of tests){assert.ok(ok,'RV11 integration: '+name);console.log('RV11 '+name+' OK');}
console.log(tests.length+' RV11 integration checks passed');
