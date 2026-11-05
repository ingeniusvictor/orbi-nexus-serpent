import test from 'node:test';
import assert from 'node:assert/strict';
import { unlockGaiaByBoss,activateGaiaInNextRoom,tickGaiaAwakening,applyGaiaDamageBonus, type GaiaAwakeningState } from './gaiaAwakening.ts';
test('GAIA requires nine seals and a defeated boss, never skins alone',()=>{
 const run: GaiaAwakeningState = {};assert.equal(unlockGaiaByBoss(run,8,25),false);
 assert.equal(unlockGaiaByBoss(run,9,25),true);
 assert.equal(unlockGaiaByBoss(run,9,30),false);
});
test('awakening starts only in the next playable room once',()=>{
 const run: GaiaAwakeningState = {};unlockGaiaByBoss(run,9,25);
 assert.equal(activateGaiaInNextRoom(run,25,true),false);
 assert.equal(activateGaiaInNextRoom(run,26,false),false);
 assert.equal(activateGaiaInNextRoom(run,26,true),true);
 assert.equal(run.gaiaAwakenedSec,14);
 assert.equal(activateGaiaInNextRoom(run,27,true),false);
});
test('bounded duration and capped boss bonus',()=>{
 assert.equal(tickGaiaAwakening(0.2,1),0);
 assert.equal(applyGaiaDamageBonus(100,4,false),120);
 assert.equal(applyGaiaDamageBonus(100,4,true),108);
 assert.equal(applyGaiaDamageBonus(100,0,false),100);
});
