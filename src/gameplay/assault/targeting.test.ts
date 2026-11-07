import test from 'node:test';
import assert from 'node:assert/strict';
import { selectNearestAssaultTarget } from './targeting.ts';

test('different core locations choose their own nearest target', () => {
  const targets = [{x:50,y:0,health:20,id:'left'}, {x:800,y:0,health:20,id:'right'}];
  assert.equal(selectNearestAssaultTarget({x:0,y:0},targets,200)?.id,'left');
  assert.equal(selectNearestAssaultTarget({x:850,y:0},targets,200)?.id,'right');
});
test('reject dead, spawning, non-finite and out-of-range targets', () => {
  const targets = [{x:2,y:0,health:0},{x:3,y:0,health:20,spawnPortalTimer:1},{x:800,y:0,health:20},{x:NaN,y:0,health:20}];
  assert.equal(selectNearestAssaultTarget({x:0,y:0},targets,100),null);
});
test('strict range boundary and empty target list', () => {
  assert.equal(selectNearestAssaultTarget({x:0,y:0},[{x:10,y:0,health:1}],10),null);
  assert.equal(selectNearestAssaultTarget({x:0,y:0},[],100),null);
  assert.equal(selectNearestAssaultTarget({x:0,y:0},[{x:2,y:0,health:1}],Infinity),null);
});
