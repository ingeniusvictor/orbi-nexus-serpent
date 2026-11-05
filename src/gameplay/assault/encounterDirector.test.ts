import test from 'node:test';
import assert from 'node:assert/strict';
import {selectAssaultEncounterType} from './encounterDirector.ts';
test('fixed boss milestones preserved',()=>{for(const r of [5,10,15,20,25,30])assert.equal(selectAssaultEncounterType(r),'boss');});
test('original rest and swarm types preserve priority',()=>{
 for(const r of [7,14,21,28])assert.equal(selectAssaultEncounterType(r),'rest');
 for(const r of [4,8,12,16,24])assert.equal(selectAssaultEncounterType(r),'swarm');
});
test('elite and preview chambers are reachable without displacing existing gates',()=>{
 assert.equal(selectAssaultEncounterType(6),'elite');
 assert.equal(selectAssaultEncounterType(18),'elite');
 assert.equal(selectAssaultEncounterType(9),'boss_preview');
 assert.equal(selectAssaultEncounterType(19),'boss_preview');
 assert.equal(selectAssaultEncounterType(29),'boss_preview');
});
test('invalid rooms fail closed as normal',()=>{assert.equal(selectAssaultEncounterType(-1),'normal');assert.equal(selectAssaultEncounterType(NaN),'normal');});
