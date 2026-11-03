import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const component = readFileSync(new URL('../src/components/NexusSerpentDemo.tsx', import.meta.url), 'utf8');
const types = readFileSync(new URL('../src/types.ts', import.meta.url), 'utf8');
let checks = 0;
const check = (condition, message) => { assert.ok(condition, message); checks++; };
const energies = ['foton', 'hydro', 'aero', 'termo', 'magne', 'aton', 'kinetrix', 'h2nova', 'quantum'];
for (const energy of energies) {
  check(component.includes(`  ${energy}: {`), `Missing visual registry for ${energy}`);
  check(component.includes(`case "${energy}":`), `Missing specialized combat profile for ${energy}`);
}
for (const energy of energies.slice(4)) {
  check(component.includes(`id: '${energy}', label:`), `Missing upgrade roster entry for ${energy}`);
}
check(component.includes("id: 'body_resonance_filament'"), 'Body upgrade must be offered');
check(component.includes('currentRoom % 3 === 0'), 'Periodic selectable growth must be enabled');
check(component.includes("id: 'seal_' + energy"), 'GAIA seal card for unmounted energy is required');
check(component.includes('getAssaultDiscoveredEnergies(run)'), 'GAIA must track discovered energy seals');
check(types.includes('gaiaSeals?: OrbiEnergyId[]'), 'Run must declare GAIA seals');
check(component.includes('reviveShieldSec'), 'Revival shield baseline must be retained');
check(component.includes('core.assaultRun.enemiesKilled % 5 === 0'), 'Earned Filamento growth baseline must be retained');
console.log(`ASSAULT-RV-02: ${checks} static isolation/roster checks passed.`);
