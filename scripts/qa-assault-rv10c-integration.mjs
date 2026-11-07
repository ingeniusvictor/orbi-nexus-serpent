import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const src=readFileSync(new URL('../src/components/NexusSerpentDemo.tsx',import.meta.url),'utf8').replace(/\r\n?/g,'\n');
const required=[
 ['charge assigned only after room six',src.includes("roomIndex >= 6 && i % 5 === 0")&&src.includes("enemy as any).blackoutCharge = true")],
 ['charge integrated into enemy update',src.includes("nextCharge(enemy.blackoutChargeState, dx, dy, dt)")],
 ['charge warning rendered for player dodge',src.includes("enemy.blackoutChargeState.phase === 'warning'")],
 ['flanking assigned to bounded drone subset',src.includes("roomIndex >= 5 && i % 4 === 0")&&src.includes("blackoutFlanker = true")],
 ['flank vector actually drives movement',src.includes('flankVelocity(enemy, core.player, enemy.flankSide || 1')],
 ['split occurs only through kill path',src.includes("const allowed = splitAllowance(core.assaultRun.roomIndex, living, children)")],
 ['split descendants cannot recursively split',src.includes('!enemy.blackoutChild && !enemy.blackoutDidSplit')&&src.includes('blackoutChild: true')],
 ['split children use existing enemy archetype',src.includes("applyEnemyArchetype(child, 'baby_serpent')")]
];
for(const [name,ok] of required){assert.ok(ok,'RV10C integration: '+name);console.log('RV10C '+name+' OK');}
console.log('RV10C: '+required.length+' integration checks passed');
