import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import {
  advanceAssaultResonancePreview,
  createAssaultResonancePreviewState,
  ASSAULT_RESONANCE_COOLDOWN_SEC,
  ASSAULT_RESONANCE_DISPLAY_SEC,
  type AssaultResonancePreviewInput,
  type AssaultResonancePreviewState,
} from './resonancePreview';

const p = (x: number, y: number) => ({ x, y });
const coil = [
  p(70, 85), p(90, 105), p(130, 105), p(160, 125),
  p(160, 155), p(150, 195), p(130, 225), p(100, 225),
  p(70, 225), p(40, 225), p(10, 200), p(10, 160),
  p(10, 130), p(10, 100), p(10, 40), p(40, 40),
  p(70, 40), p(100, 40),
];
const inside = { ...p(80, 140), health: 50, type: 'BABY_SERPENT' };
const outside = { ...p(400, 140), health: 50, type: 'BABY_SERPENT' };
const dead = { ...p(80, 140), health: 0, type: 'BABY_SERPENT' };
const beacon = { ...p(80, 140), health: 100, type: 'REST_BEACON' };
function input(overrides: Partial<AssaultResonancePreviewInput> = {}): AssaultResonancePreviewInput {
  return {
    head: p(50, 10),
    body: coil,
    targets: [inside, outside, dead, beacon],
    roomIndex: 1,
    dtSec: 1 / 60,
    combatActive: true,
    ...overrides,
  };
}
function closure() {
  const initial = advanceAssaultResonancePreview(createAssaultResonancePreviewState(), input());
  assert.equal(initial.closedNow, false);
  return advanceAssaultResonancePreview(initial.state, input({ head: p(50, 80) }));
}

test('first frame primes historical head without detecting a loop', () => {
  const res = advanceAssaultResonancePreview(createAssaultResonancePreviewState(), input());
  assert.equal(res.closedNow, false);
  assert.equal(res.state.active, null);
  assert.deepEqual(res.state.previousHead, p(50, 10));
});
test('a real crossing creates a zero-damage world-space preview', () => {
  const before = input();
  const snapshot = JSON.stringify(before);
  const res = closure();
  assert.equal(res.closedNow, true);
  assert.equal(res.targetsInside, 1);
  assert.equal(res.state.active?.targetsInside, 1);
  assert.equal(res.state.active?.loop.intersection.x, 50);
  assert.equal(res.state.cooldownSec, ASSAULT_RESONANCE_COOLDOWN_SEC);
  assert.equal(res.state.active?.remainingSec, ASSAULT_RESONANCE_DISPLAY_SEC);
  assert.equal(res.state.totalClosures, 1);
  assert.equal(JSON.stringify(before), snapshot);
});
test('preview does not modify enemy HP or position', () => {
  const enemies = [inside, outside, dead, beacon].map(e => ({ ...e }));
  const before = JSON.stringify(enemies);
  const initial = advanceAssaultResonancePreview(createAssaultResonancePreviewState(), input({ targets: enemies }));
  advanceAssaultResonancePreview(initial.state, input({ head: p(50, 80), targets: enemies }));
  assert.equal(JSON.stringify(enemies), before);
});
test('a dead enemy or sanctuary is never counted as trapped', () => {
  const state = advanceAssaultResonancePreview(createAssaultResonancePreviewState(), input());
  const res = advanceAssaultResonancePreview(state.state,
    input({ head: p(50, 80), targets: [dead, beacon, outside] }));
  assert.equal(res.targetsInside, 0);
  assert.equal(res.closedNow, true);
});
test('a second crossing during cooldown cannot create a second event', () => {
  const first = closure();
  const res = advanceAssaultResonancePreview(first.state, input({ head: p(50, 10) }));
  assert.equal(res.closedNow, false);
  assert.equal(res.state.totalClosures, 1);
  assert.ok(res.state.cooldownSec < ASSAULT_RESONANCE_COOLDOWN_SEC);
});
test('preview expires based on simulated seconds, not wall-clock time', () => {
  let state: AssaultResonancePreviewState = closure().state;
  for (let i = 0; i < 30; i++) {
    state = advanceAssaultResonancePreview(state, input({ head: p(50, 80), dtSec: 0.07 })).state;
  }
  assert.equal(state.active, null);
  assert.equal(state.totalClosures, 1);
});
test('room transition resets crossing history and visual preview', () => {
  const result = advanceAssaultResonancePreview(closure().state, input({ roomIndex: 2 }));
  assert.equal(result.closedNow, false);
  assert.equal(result.state.active, null);
  assert.equal(result.state.cooldownSec, 0);
  assert.equal(result.state.roomIndex, 2);
  assert.deepEqual(result.state.previousHead, p(50, 10));
  assert.equal(result.state.totalClosures, 1);
});
test('upgrade screens, pause and countdown do not create closures', () => {
  const before = advanceAssaultResonancePreview(createAssaultResonancePreviewState(), input());
  const stopped = advanceAssaultResonancePreview(before.state, input({ head: p(50, 80), combatActive: false }));
  assert.equal(stopped.closedNow, false);
  assert.equal(stopped.state.active, null);
  assert.equal(stopped.state.previousHead, null);
});
test('invalid and empty body inputs fail closed', () => {
  const base = advanceAssaultResonancePreview(createAssaultResonancePreviewState(), input());
  assert.equal(advanceAssaultResonancePreview(base.state, input({ body: [] })).closedNow, false);
  assert.equal(advanceAssaultResonancePreview(base.state, input({ head: p(Infinity, 42) })).closedNow, false);
});
test('stationary head never retriggers a cerco', () => {
  const first = closure();
  let current = first.state;
  for (let i = 0; i < 60; i++) {
    current = advanceAssaultResonancePreview(current, input({ head: p(50, 80), dtSec: 0.07 })).state;
  }
  assert.equal(current.totalClosures, 1);
});
test('zero and NaN dt are safely bounded', () => {
  const first = closure();
  const bad = advanceAssaultResonancePreview(first.state, input({ dtSec: NaN }));
  assert.equal(bad.state.cooldownSec, ASSAULT_RESONANCE_COOLDOWN_SEC);
  const huge = advanceAssaultResonancePreview(bad.state, input({ dtSec: 500 }));
  assert.ok(huge.state.cooldownSec >= 0);
});
