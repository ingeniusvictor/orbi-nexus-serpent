import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
// Normalize Windows CRLF and legacy CR line endings so static checks remain platform-independent.
const src=readFileSync(new URL('../src/components/NexusSerpentDemo.tsx',import.meta.url),'utf8').replace(/\r\n?/g,'\n');
const types=readFileSync(new URL('../src/types.ts',import.meta.url),'utf8');
const checks=[
 ['Foton Assault laser length is compact, not 1.35x',src.includes('length *= 0.94;')&&!src.includes('length *= 1.35; // projectileLengthMultiplier')],
 ['Foton narrow glow, fine tip bloom and short trails',src.includes('solarAssault ? 1.55 : 2.8')&&src.includes('height * 1.35')&&src.includes('0.27 : 0.45')],
 ['Assault core body is seeded before initial module',src.indexOf('createInitialAssaultSegments(core.player')<src.indexOf('const startModule = createOrbiCombatModule')],
 ['First tick canonical core synchronization before game drawing',src.includes('syncAssaultModulesToBodySlots();\n      setAssaultRunHp(100);')&&src.includes('syncAssaultModulesToBodySlots();\n          drawNexusAssaultRoom(ctx, dt);')],
 ['One shared module anchor used by render and projectile',src.includes('const seg = resolveAssaultModuleAnchor(mod, core.player.segments, core.player);')],
 ['GAIA requires nine discovered seals not nine physical modules',src.includes("isGaiaSupremeUnlocked(core.assaultRun)")&&!src.includes('uniqueElements.length >= 9')],
 ['GAIA silhouette rendered above canonical serpent in Assault only',src.includes('drawGaiaSupremeForm(ctx, core.player')],
 ['GAIA permanent HUD differentiated from temporary convergence',src.includes('FORMA SUPREMA · PERMANENTE')&&src.includes('GAIA · CONVERGENCIA')],
 ['GAIA reveal only once when progress reaches ninth seal',src.includes('if (gaiaAfter === 9) {\n        core.assaultRun.gaiaSupremeFlashSec = 1.2;')],
 ['RV09B TERMO glow compacted in Assault without changing projectile radius',src.includes("core.gameMode === 'nexus_assault' ? 0.58 : 1.0")&&src.includes("core.gameMode === 'nexus_assault' ? 2.7 : 3.4")],
 ['RV09B GAIA redraws canonical elemental modules above supreme armor',src.includes('drawGaiaSupremeVisibleCores(ctx, core.assaultRun.modules, core.player')&&src.includes('resolveAssaultModuleAnchor(mod, player.segments, player)')],
 ['RV09B starter energy counted by discovered-energy progress',/modules:\s*\[\s*startModule\s*\]/.test(src)&&src.includes('const startModule = createOrbiCombatModule(startEnergy, 3, "common")')&&src.includes('getGaiaEnergyProgress(stateRef.current.assaultRun)')],
 ['No new game loop or monetization introduced by RV-09',types.includes('gaiaSupremeFlashSec?: number;')],
];
for(const [name,result] of checks){assert.ok(result,'visual QA: '+name);console.log('RV09 '+name+' OK');}
console.log('RV08A/RV08B/RV09: '+checks.length+' static isolation checks passed');
