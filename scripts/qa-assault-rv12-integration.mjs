import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const src=readFileSync(new URL('../src/components/NexusSerpentDemo.tsx',import.meta.url),'utf8').replace(/\r\n?/g,'\n');
const checks=[
 ['dedicated camera resolver',src.includes('resolveAssaultCamera(core.player, zoom, viewW, viewH,')],
 ['explicit Assault camera bounds',src.includes('ASSAULT_WORLD_WIDTH, ASSAULT_WORLD_HEIGHT);')],
 ['old camera remains isolated for other modes',src.includes("} else if (core.gameMode === 'vital_flow' && core.vitalFlow)")],
 ['camera transition snap',src.includes("core.camera.x = core.player.x;\n    core.camera.y = core.player.y;")],
 ['transition diagnostic gap',src.includes("console.info('[ASSAULT CAMERA TRANSITION]'")&&src.includes('firstSegmentGap:')],
 ['continuity before rendering',src.includes("ensureAssaultVisualContinuity('before camera')")],
 ['serpent boss identity first 25',src.includes('shouldUseSerpentBossSilhouette(core.assaultRun?.roomIndex ?? 0)')],
 ['eight physical cores and nine-seal rules retained',src.includes('isGaiaSupremeUnlocked(core.assaultRun)')]
];
for(const [name,ok] of checks){assert.ok(ok,'RV12 integration: '+name);console.log('RV12 '+name+' OK');}
console.log(checks.length+' RV12 integration checks passed');
