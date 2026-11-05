import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateResonanceHits } from './resonanceCombat.ts';
const loop = {polygon:[{x:0,y:0},{x:200,y:0},{x:200,y:200},{x:0,y:200}],intersection:{x:0,y:0}};
test('hits only active hostiles inside a valid area',()=>{
 const e=[{id:'a',x:50,y:50,health:80},{id:'b',x:250,y:50,health:80},{id:'rest',x:80,y:80,health:20,type:'REST_BEACON'},{id:'dead',x:90,y:90,health:0}];
 const hits=calculateResonanceHits(loop as any,e,4);
 assert.deepEqual(hits,[{id:'a',damage:17}]);
});
test('boss damage has maximum 3.5 percent current max health',()=>{
 const hits=calculateResonanceHits(loop as any,[{id:'boss',x:40,y:40,health:100,maxHealth:100,isBoss:true}],8);
 assert.deepEqual(hits,[{id:'boss',damage:3}]);
});
test('empty or degenerate polygons cause no damage',()=>{
 assert.deepEqual(calculateResonanceHits({...loop,polygon:[]} as any,[{id:'a',x:1,y:1,health:10}],5),[]);
});
