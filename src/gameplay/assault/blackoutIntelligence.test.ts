import test from 'node:test';
import assert from 'node:assert/strict';
import {nextCharge,flankVelocity,splitAllowance,CHARGE_WARNING,CHARGE_DURATION,unit} from './blackoutIntelligence.ts';
test('charge has readable warning, fixed direction, recovery and no instant repeats',()=>{
 let s=nextCharge(undefined,1,0,1);
 assert.equal(s.phase,'warning');
 assert.equal(s.frames,CHARGE_WARNING);
 s=nextCharge(s,0,10,CHARGE_WARNING);
 assert.equal(s.phase,'charge');
 assert.equal(s.frames,CHARGE_DURATION);
 assert.deepEqual(s.direction,{x:1,y:0});
 s=nextCharge(s,0,10,CHARGE_DURATION);
 assert.equal(s.phase,'recover');
 assert.equal(nextCharge(s,0,1,62).phase,'warning');
});
test('flanking is lateral, bounded and protects invalid inputs',()=>{
 const left=flankVelocity({x:0,y:0},{x:250,y:0},-1,1.7);
 const right=flankVelocity({x:0,y:0},{x:250,y:0},1,1.7);
 assert.ok(left.y<0&&right.y>0);
 assert.ok(Math.hypot(left.x,left.y)<=1.701);
 assert.equal(flankVelocity({x:0,y:0},{x:0,y:0},1,Infinity).x,0);
 assert.deepEqual(unit(NaN,2),{x:1,y:0});
});
test('splitter children are capped under crowded combat and invalid counts',()=>{
 assert.equal(splitAllowance(1,3,0),2);
 assert.equal(splitAllowance(1,11,0),0);
 assert.equal(splitAllowance(30,5,6),0);
 assert.equal(splitAllowance(1,5,5),1);
 assert.equal(splitAllowance(1,NaN,0),0);
});
