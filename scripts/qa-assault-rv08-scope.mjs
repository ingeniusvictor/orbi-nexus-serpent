import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const src=readFileSync(new URL('../src/components/NexusSerpentDemo.tsx',import.meta.url),'utf8');
const types=readFileSync(new URL('../src/types.ts',import.meta.url),'utf8');
const mutation=readFileSync(new URL('../src/gameplay/assault/advancedMutations.ts',import.meta.url),'utf8');
const fusion=readFileSync(new URL('../src/gameplay/assault/fusionRecipes.ts',import.meta.url),'utf8');
const must=[
 ['E3 cards use real level and mutation eligibility',src.includes('eligibleAdvancedMutations(run.modules)')],
 ['E3 cards commit mutation on physical core',src.includes('if (mod) mod.mutation = spec.id')],
 ['E5 cards gated by selected fusions',src.includes('eligibleFusionRecipes(run.modules, run.selectedFusions ?? [])')],
 ['E5 selected fusions persist on run',src.includes('r.selectedFusions = [...(r.selectedFusions ?? []), recipe.id]')],
 ['E5 HUD visible independently',src.includes('FUSIONES E5')&&src.includes('SINERGIAS ACTIVAS')],
 ['Attack uses snapshotted mutation and source',src.includes('mutation: mod.mutation')&&src.includes('sourceModuleId: mod.id')],
 ['E3 mutation resolution only on direct projectile contact',src.includes('calculateAdvancedMutationImpact({')],
 ['Finishing blows can still trigger E3 effects',
  src.indexOf('mutationEffect = calculateAdvancedMutationImpact({') >= 0 &&
  src.indexOf('mutationEffect = calculateAdvancedMutationImpact({') <
  src.indexOf('applyAssaultDamageToEnemy(enemy, proj.damage, {')],
 ['Splash cannot recursively proc mutation',src.includes("source: 'advanced_mutation'")],
 ['Healing limited by max HP',src.includes('core.assaultRun.hp < core.assaultRun.maxHp')],
 ['One physical projectile can strike each target once',src.includes('proj.hasPierced?.includes(enemy.id)')],
 ['Unmutated Fotón no longer repeatedly damages',src.includes('if (!proj.piercing || proj.hasPierced.length >= 2)')],
 ['Fusion bonus on direct impact only',src.includes("context?.source === 'projectile'")],
 ['Five new energy mutations typed', ['magnetic_chain','aton_fission','kinetrix_impulse','h2nova_repair','quantum_echo'].every(id=>types.includes(id)&&mutation.includes(id))],
 ['Fusion limit and three distinct recipes',fusion.includes('ASSAULT_MAX_FUSIONS = 2')&&['prisma_vital','magnetar_nexus','nova_paradox'].every(id=>fusion.includes(id))],
 ['Three card selection cap preserved',src.includes('while (finalSelection.length < 3')],
 ['GAIA and free revival retained',src.includes('unlockGaiaByBoss(')&&src.includes('tickAssaultReviveShield(')],
];
for(const [name,pass] of must){assert.ok(pass,'RV-08 scope failure: '+name);console.log('[RV-08] OK '+name);}
console.log('[RV-08] '+must.length+' integration / isolation guards passed');
