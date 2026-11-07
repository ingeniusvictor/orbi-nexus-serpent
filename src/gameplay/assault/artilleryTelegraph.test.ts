import test from 'node:test';
import assert from 'node:assert/strict';
import {ARTILLERY_LOCK_FRAMES,getArtilleryTelegraph,normalizedAim} from './artilleryTelegraph.ts';
test('warning appears only shortly before existing artillery fire',()=>{
 assert.equal(getArtilleryTelegraph(70,0,5).warning,false);
 assert.equal(getArtilleryTelegraph(36,0,5).warning,true);
 assert.equal(getArtilleryTelegraph(0,0,5).warning,false);
});
test('locked shot retains its original vector when player dodges',()=>{
 const locked=normalizedAim(10,0);
 const signal=getArtilleryTelegraph(ARTILLERY_LOCK_FRAMES,0,10,locked);
 assert.equal(signal.locked,true);
 assert.deepEqual(signal.direction,{x:1,y:0});
});
test('finite fallback and normalized direction under invalid inputs',()=>{
 assert.deepEqual(normalizedAim(0,0),{x:1,y:0});
 assert.deepEqual(normalizedAim(Infinity,3),{x:1,y:0});
 assert.equal(getArtilleryTelegraph(NaN,0,0).warning,false);
 const v=getArtilleryTelegraph(10,3,4).direction;
 assert.equal(Math.hypot(v.x,v.y),1);
});
