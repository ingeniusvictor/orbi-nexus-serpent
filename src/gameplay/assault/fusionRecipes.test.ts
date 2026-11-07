import test from 'node:test';
import assert from 'node:assert/strict';
import {FUSION_RECIPES,eligibleFusionRecipes,fusionImpactMultiplier,ASSAULT_MAX_FUSIONS} from './fusionRecipes.ts';
test('three distinct ORBI fusion recipes',()=>{
 assert.equal(FUSION_RECIPES.length,3);
 assert.equal(new Set(FUSION_RECIPES.map(x=>x.id)).size,3);
 assert.equal(ASSAULT_MAX_FUSIONS,2);
});
test('requires level 3 and mutation on both physical cores',()=>{
 const one=[{element:'foton',level:3,mutation:'solar_lance'},{element:'hydro',level:2,mutation:'tidal_siphon'}];
 assert.equal(eligibleFusionRecipes(one,[]).length,0);
 assert.deepEqual(eligibleFusionRecipes([{...one[0]},{...one[1],level:3}],[]).map(x=>x.id),['prisma_vital']);
 assert.equal(eligibleFusionRecipes([{...one[0]},{...one[1],level:3,mutation:undefined}],[]).length,0);
});
test('cannot offer already-selected fusions or more than two per run',()=>{
 const all=FUSION_RECIPES.flatMap(f=>f.elements.map(e=>({element:e,level:3,mutation:'ready'})));
 assert.equal(eligibleFusionRecipes(all,[]).length,3);
 assert.equal(eligibleFusionRecipes(all,['prisma_vital']).length,2);
 assert.equal(eligibleFusionRecipes(all,['prisma_vital','magnetar_nexus']).length,0);
});
test('fusion bonuses match their energy and enemy status with an 18% cap',()=>{
 assert.equal(fusionImpactMultiplier(['prisma_vital'],'foton',{statusEffects:[{type:'slow'}]}),1.18);
 assert.equal(fusionImpactMultiplier(['prisma_vital'],'hydro',{}),1.06);
 assert.equal(fusionImpactMultiplier(['magnetar_nexus'],'aton',{isBoss:true}),1.07);
 assert.equal(fusionImpactMultiplier(['nova_paradox'],'quantum',{isBoss:false}),1.11);
 assert.equal(fusionImpactMultiplier(['prisma_vital'],'kinetrix',{}),1);
});
