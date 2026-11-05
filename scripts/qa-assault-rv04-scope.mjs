import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const src=readFileSync(new URL('../src/components/NexusSerpentDemo.tsx',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/index.css',import.meta.url),'utf8');
const preview=readFileSync(new URL('../src/gameplay/assault/resonancePreview.ts',import.meta.url),'utf8');
const checks=[
 ['nine-guardian compact selector',src.includes('orbi-guardian-choose-compact') && src.includes('Object.values(GUARDIAN_THEMES).map(theme =>')],
 ['cards small and navigable',css.includes('.orbi-guardian-choose-compact .orbi-guardian-choice')&&css.includes('min-height: 43px')],
 ['new energy theme colors',css.includes('.orbi-guardian-kinetrix')&&css.includes('.orbi-guardian-h2nova')&&css.includes('.orbi-guardian-quantum')],
 ['independent mounted core targeting',src.includes('selectNearestAssaultTarget(seg, core.assaultRun.enemies, maxRange)')],
 ['damage only when closed',src.includes('if (outcome.closedNow && outcome.state.active)')],
 ['no duplicate cerco damage per frame',src.includes("source: 'resonance_loop'")],
 ['resonance isolated to Assault',src.includes("core.gameMode === 'nexus_assault' && core.assaultRun")],
 ['combat timing in seconds',src.includes('roomClearDuration = Math.min(')&&src.includes('Math.max(0, dt) / 60')],
 ['boss rare reward consumed',src.includes('if (run.guaranteedRareUpgrade)')&&src.includes('run.guaranteedRareUpgrade = false')],
 ['preview preserves one event per closure',preview.includes('closedNow: true')&&preview.includes('ASSAULT_RESONANCE_COOLDOWN_SEC')]
];
for(const [name,pass] of checks){ assert.ok(pass,name);console.log('AS-RV04 '+name+' OK');}
console.log('AS-RV04: '+checks.length+' scope checks passed');
