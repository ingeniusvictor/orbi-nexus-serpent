import test from 'node:test';
import assert from 'node:assert/strict';
import {ADVANCED_MUTATION_SPECS,eligibleAdvancedMutations,calculateAdvancedMutationImpact} from './advancedMutations.ts';
const target={id:'one',x:0,y:0,health:100};
const nearby=[target,{id:'two',x:40,y:0,health:50},{id:'three',x:80,y:0,health:50},{id:'far',x:300,y:0,health:50}];
test('all five advanced E3 mutations have a unique element and unlock at level 3',()=>{
 assert.equal(ADVANCED_MUTATION_SPECS.length,5);
 assert.equal(new Set(ADVANCED_MUTATION_SPECS.map(x=>x.id)).size,5);
 assert.equal(eligibleAdvancedMutations(ADVANCED_MUTATION_SPECS.map(x=>({element:x.element,level:3}))).length,5);
 assert.equal(eligibleAdvancedMutations([{element:'magne',level:2},{element:'aton',level:3,mutation:'aton_fission'}]).length,0);
});
test('Magne chains once to nearest second target, never far-away targets',()=>{
 const x=calculateAdvancedMutationImpact({mutation:'magnetic_chain',damage:20,target,enemies:nearby,roll:.1,impactNumber:1});
 assert.deepEqual(x.secondaryHits,[{id:'two',damage:8}]);
 assert.equal(calculateAdvancedMutationImpact({mutation:'magnetic_chain',damage:20,target,enemies:nearby,roll:.9,impactNumber:1}).secondaryHits.length,0);
});
test('Aton splash hits at most two eligible targets with lower damage',()=>{
 const x=calculateAdvancedMutationImpact({mutation:'aton_fission',damage:20,target,enemies:nearby,roll:.9,impactNumber:1});
 assert.deepEqual(x.secondaryHits,[{id:'two',damage:6},{id:'three',damage:6}]);
});
test('Kinetrix never pushes bosses',()=>{
 assert.equal(calculateAdvancedMutationImpact({mutation:'kinetrix_impulse',damage:20,target,enemies:nearby,roll:0,impactNumber:1}).pushDistance,38);
 assert.equal(calculateAdvancedMutationImpact({mutation:'kinetrix_impulse',damage:20,target:{...target,isBoss:true},enemies:nearby,roll:0,impactNumber:1}).pushDistance,0);
});
test('H2Nova heals at most one point every eight successful impacts',()=>{
 assert.equal(calculateAdvancedMutationImpact({mutation:'h2nova_repair',damage:20,target,enemies:nearby,roll:0,impactNumber:7}).heal,0);
 assert.equal(calculateAdvancedMutationImpact({mutation:'h2nova_repair',damage:20,target,enemies:nearby,roll:0,impactNumber:8}).heal,1);
});
test('Quantum echo is bounded and excludes zero damage or invalid targets',()=>{
 assert.equal(calculateAdvancedMutationImpact({mutation:'quantum_echo',damage:20,target,enemies:nearby,roll:.10,impactNumber:1}).echoDamage,8);
 assert.equal(calculateAdvancedMutationImpact({mutation:'quantum_echo',damage:20,target,enemies:nearby,roll:.80,impactNumber:1}).echoDamage,0);
 assert.equal(calculateAdvancedMutationImpact({mutation:'quantum_echo',damage:20,target:{...target,health:0},enemies:nearby,roll:.10,impactNumber:1}).echoDamage,0);
});
test('invalid targets cannot generate extra hits',()=>{
 const invalid={...target,type:'REST_BEACON'};
 const x=calculateAdvancedMutationImpact({mutation:'aton_fission',damage:20,target:invalid,enemies:nearby,roll:0,impactNumber:1});
 assert.equal(x.secondaryHits.length,0);
});
