import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import {
  ASSAULT_RECONNECT_POLICY,
  canUseFreeAssaultRevive,
  computeAssaultRevivalHp,
  getAssaultReviveOffer,
  tickAssaultReviveShield
} from './assaultRevive';
import {
  ORBI_ECONOMY_PURCHASES_ENABLED,
  ORBI_PRISMAS,
  ORBI_ASSAULT_RECONNECTION_OFFER,
  formatOrbiPrismas
} from '../../economy/orbiEconomy';

test('One free revival is available on first death', () => {
  assert.deepEqual(getAssaultReviveOffer(0),
    { kind: 'free', label: 'RECONEXIÓN DE EMERGENCIA GRATIS', cost: 0 });
  assert.equal(ASSAULT_RECONNECT_POLICY.freeRevivesPerRun, 1);
});

test('All subsequent revivals are disabled until verified purchase integration', () => {
  assert.deepEqual(getAssaultReviveOffer(1), {
    kind: 'future_currency', label: 'RECONEXIÓN CON PRISMAS ORBI — PRÓXIMAMENTE', cost: 30, enabled: false
  });
  assert.equal(getAssaultReviveOffer(17).kind, 'future_currency');
});

test('Revival is possible only from Nexus Assault game-over with zero HP', () => {
  assert.equal(canUseFreeAssaultRevive('nexus_assault', 'GAMEOVER', 0, 0), true);
  assert.equal(canUseFreeAssaultRevive('nexus_assault', 'GAMEOVER', -1, 0), true);
  assert.equal(canUseFreeAssaultRevive('nexus_assault', 'GAMEOVER', 20, 0), false);
  assert.equal(canUseFreeAssaultRevive('nexus_assault', 'PLAYING', 0, 0), false);
  assert.equal(canUseFreeAssaultRevive('demo', 'GAMEOVER', 0, 0), false);
  assert.equal(canUseFreeAssaultRevive('infinite', 'GAMEOVER', 0, 0), false);
  assert.equal(canUseFreeAssaultRevive('vital_flow', 'GAMEOVER', 0, 0), false);
  assert.equal(canUseFreeAssaultRevive('nexus_assault', 'GAMEOVER', 0, 1), false);
});

test('Revival restores exactly 60% rounded up, capped to max HP', () => {
  assert.equal(computeAssaultRevivalHp(100), 60);
  assert.equal(computeAssaultRevivalHp(55), 33);
  assert.equal(computeAssaultRevivalHp(1), 1);
  assert.equal(computeAssaultRevivalHp(0), 0);
  assert.equal(computeAssaultRevivalHp(NaN), 0);
});

test('Shield decreases during simulation and does not underflow', () => {
  assert.equal(ASSAULT_RECONNECT_POLICY.shieldSeconds, 3);
  assert.equal(tickAssaultReviveShield(3, 0), 3);
  assert.ok(tickAssaultReviveShield(3, 1 / 60) < 3);
  assert.equal(tickAssaultReviveShield(0.05, 0.07), 0);
  assert.equal(tickAssaultReviveShield(-1, 0.05), 0);
  assert.equal(tickAssaultReviveShield(1, NaN), 1);
  assert.equal(tickAssaultReviveShield(1, 999), 0.9);
});

test('Prototype Prismas is one shared ORBI currency vocabulary', () => {
  assert.equal(ORBI_PRISMAS.id, 'orbi.prismas');
  assert.equal(ORBI_PRISMAS.code, 'OPR');
  assert.equal(ORBI_PRISMAS.name, 'Prismas ORBI');
  assert.equal(ORBI_PRISMAS.cashConvertible, false);
  assert.equal(ORBI_PRISMAS.transferable, false);
});

test('Premium transactions cannot start in this build', () => {
  assert.equal(ORBI_ECONOMY_PURCHASES_ENABLED, false);
  assert.equal(ORBI_PRISMAS.currentlyPurchasable, false);
  assert.equal(ORBI_ASSAULT_RECONNECTION_OFFER.paymentEnabled, false);
  assert.equal(ORBI_ASSAULT_RECONNECTION_OFFER.costPrismas, 30);
});

test('Display formatting never accepts negative or non-integer coins', () => {
  assert.equal(formatOrbiPrismas(0), '0 OPR');
  assert.equal(formatOrbiPrismas(30), '30 OPR');
  assert.equal(formatOrbiPrismas(-1), '—');
  assert.equal(formatOrbiPrismas(0.1), '—');
  assert.equal(formatOrbiPrismas(Infinity), '—');
});
