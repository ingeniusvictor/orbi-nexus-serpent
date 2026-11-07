import test from 'node:test';
import assert from 'node:assert/strict';
import {selectAssaultFormation} from './tacticalFormations.ts';

test('different normal rooms produce distinct ORBI tactical formations',()=>{
 const rooms=[1,2,3,6].map(n=>selectAssaultFormation(n,'normal',20));
 assert.deepEqual(rooms.map(r=>r.tactic),['equilibrio','persecucion','asedio','persecucion']);
 assert.deepEqual(rooms.slice(0,3).map(r=>[r.wispCount,r.droneCount,r.spitterCount]),[
  [8,8,4],[13,5,2],[4,5,11]
 ]);
});
test('elite, swarm and preview maintain their original encounter identity',()=>{
 assert.equal(selectAssaultFormation(8,'swarm',20).wispCount,13);
 assert.equal(selectAssaultFormation(18,'elite',20).tactic,'elite');
 assert.deepEqual(selectAssaultFormation(9,'boss_preview',60),{
  tactic:'antesala',wispCount:1,droneCount:1,spitterCount:1
 });
});
test('bounded and conserved allocations under extreme and invalid inputs',()=>{
 for(const type of ['normal','elite','swarm'] as const) {
  for(const value of [0,1,2,3,9,55,999,Number.NaN]) {
   const x=selectAssaultFormation(27,type,value);
   const sum=x.wispCount+x.droneCount+x.spitterCount;
   assert.ok(sum>=1&&sum<=60);
   assert.ok([x.wispCount,x.droneCount,x.spitterCount].every(v=>Number.isInteger(v)&&v>=0));
  }
 }
});
test('same room and difficulty produce reproducible results',()=>{
 const a=selectAssaultFormation(23,'normal',17);
 assert.deepEqual(a,selectAssaultFormation(23,'normal',17));
});
