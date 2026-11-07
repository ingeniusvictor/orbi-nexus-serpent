import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const src = readFileSync(new URL('../src/components/NexusSerpentDemo.tsx', import.meta.url), 'utf8');
let checks = 0;
for (const phrase of [
  "const enforceAssaultLateGameBudget = () => {",
  "core.gameMode !== 'nexus_assault'",
  "p.isEnemy ? ++hostile <= 135 : ++friendly <= 105",
  "core.particles.length > 380",
  "core.floatingTexts.length > 65",
  "core.orbs.length > 80",
  "const sealIndex = copy.findIndex(card => card.id.startsWith('seal_'))",
  "if (sealIndex >= 0 && finalSelection.length < 3) finalSelection.push",
  "GAIA LOCK 9/9 · SINCRONIZACIÓN COMPLETA",
  "const gaiaBefore = getGaiaEnergyProgress",
  "const gaiaAfter = getGaiaEnergyProgress",
  "growAssaultOrbiBodyProgress(4.5)",
  "currentRoom % 3 === 0",
  "enforceAssaultLateGameBudget();"
]) { assert.ok(src.includes(phrase), 'RV-03 missing: ' + phrase); checks++; }
assert.ok((src.match(/enforceAssaultLateGameBudget\(\);/g) ?? []).length >= 2, 'must enforce before and after projectile update'); checks++;
console.log('ASSAULT-RV-03: ' + checks + ' scope / GAIA / render-budget checks passed');
