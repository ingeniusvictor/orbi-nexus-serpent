import test from 'node:test';
import assert from 'node:assert/strict';
import { rollAssaultRarity } from './rarity.ts';
const weights={common:45,rare:35,epic:17,legendary:3};
test('four bands are distinct and sum to 100%',()=>{
 assert.equal(rollAssaultRarity(weights,0.01),'legendary');
 assert.equal(rollAssaultRarity(weights,0.10),'epic');
 assert.equal(rollAssaultRarity(weights,0.30),'rare');
 assert.equal(rollAssaultRarity(weights,0.80),'common');
});
test('no legendary when grade odds prohibit it',()=> {
 assert.equal(rollAssaultRarity({common:70,rare:24,epic:6,legendary:0},0),'epic');
 assert.equal(rollAssaultRarity({common:70,rare:24,epic:6,legendary:0},0.2),'rare');
});
test('malformed odds fall back safely',()=>{
 assert.equal(rollAssaultRarity({common:0,rare:0,epic:0,legendary:0},0.5),'common');
});
