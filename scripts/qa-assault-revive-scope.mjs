import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/components/NexusSerpentDemo.tsx', import.meta.url), 'utf8');
const economy = readFileSync(new URL('../src/economy/orbiEconomy.ts', import.meta.url), 'utf8');
const rules = readFileSync(new URL('../src/gameplay/assault/assaultRevive.ts', import.meta.url), 'utf8');

const between = (start, end) => {
  const a = source.indexOf(start), b = source.indexOf(end, a + start.length);
  assert.ok(a >= 0 && b > a, 'Missing code anchors for ' + start);
  return source.slice(a, b);
};

const reviveHandler = between('const handleFreeAssaultRevive = () => {', '// Play and Start game triggers');
const injury = between('const hurtAssaultPlayer = (', 'type NexusAssaultBossType');
const ui = between('{/* ORBI-RV-01: opt-in free resurrection', '{/* Performance metrics inside box */}');
const roomStart = between("if (gameMode === 'nexus_assault') {", "setAssaultRunHp(100);");
const checks = [
  ['Revival is strictly restricted to nexus_assault death',
    reviveHandler.includes('canUseFreeAssaultRevive(core.gameMode, gameState, run.hp, run.reviveCount ?? 0)')],
  ['Each new run resets free revives and shield',
    roomStart.includes('reviveCount: 0') && roomStart.includes('reviveShieldSec: 0')],
  ['No gameplay revival possible while protection active',
    injury.includes("core.gameState !== 'PLAYING'") && injury.includes('reviveShieldSec ?? 0')],
  ['Revival restores run HP and does not reset the run',
    reviveHandler.includes('run.hp = computeAssaultRevivalHp(run.maxHp)') &&
    !reviveHandler.includes('initiateReset(') && !reviveHandler.includes('generateWorldElements(')],
  ['Reconnection retains weapons and boss instead of spawning room',
    !/run\.(?:modules|enemies|currentBoss|roomIndex|synergiesActive)\s*=/.test(reviveHandler)],
  ['Only hostile projectiles removed by reconnection',
    reviveHandler.includes('run.projectiles.filter(projectile => !projectile.isEnemy)')],
  ['Enemy death alone can grow filament every 5 kills',
    source.includes('core.assaultRun.enemiesKilled % 5 === 0') &&
    source.includes('growAssaultOrbiBodyProgress(1)')],
  ['No paid revive button can activate in this version',
    ui.includes('disabled aria-disabled="true"') && economy.includes('ORBI_ECONOMY_PURCHASES_ENABLED = false')],
  ['The spend price is future-only with one shared currency',
    economy.includes("code: 'OPR'") && rules.includes('ORBI_ASSAULT_RECONNECTION_OFFER.costPrismas')],
  ['The Assault defeat UI has free revival action',
    ui.includes('onClick={handleFreeAssaultRevive}') && ui.includes("gameMode === 'nexus_assault'")],
  ['Assault HP is separate from legacy Vital Energy collapse',
    source.split("p.energy <= 0 && core.gameMode !== 'nexus_assault'").length - 1 === 2],
  ['No browser wallet grants or self-issued payment receipts',
    !/localStorage|fetch\(|paymentRequest|\bwalletBalance\b|purchase\(/.test(economy)],
];
let failures = 0;
for (const [label, ok] of checks) {
  console.log((ok ? '[RV-SCOPE] OK   ' : '[RV-SCOPE] FAIL ') + label);
  if (!ok) failures++;
}
assert.equal(failures, 0, failures + ' free revive / wallet isolation checks failed');
console.log('[RV-SCOPE] 12 static checks complete. Manual GAMEOVER/CONTINUE testing still required.');
