/** ORBI original GAIA challenge: nine energy seals + defeat of the next boss.
 * Activation is one-time, for the first subsequent combat room; never monetized.
 */
export interface GaiaAwakeningState {
  gaiaChallengeComplete?: boolean;
  gaiaChallengeRoom?: number;
  gaiaAwakeningPending?: boolean;
  gaiaAwakenedSec?: number;
}
export const GAIA_AWAKENING_DURATION_SEC = 14;
export function unlockGaiaByBoss<T extends GaiaAwakeningState>(run:T, seals:number, room:number):boolean {
  if (seals < 9 || run.gaiaChallengeComplete || !Number.isFinite(room)) return false;
  run.gaiaChallengeComplete = true;
  run.gaiaChallengeRoom = room;
  run.gaiaAwakeningPending = true;
  return true;
}
export function activateGaiaInNextRoom<T extends GaiaAwakeningState>(run:T, room:number, combatActive:boolean):boolean {
  if (!run.gaiaAwakeningPending || !combatActive || room <= (run.gaiaChallengeRoom ?? Infinity)) return false;
  run.gaiaAwakeningPending = false;
  run.gaiaAwakenedSec = GAIA_AWAKENING_DURATION_SEC;
  return true;
}
export function tickGaiaAwakening(seconds:number, dtSec:number):number {
  return Math.max(0, (Number.isFinite(seconds)?seconds:0) - (Number.isFinite(dtSec)?Math.max(0,dtSec):0));
}
export function applyGaiaDamageBonus(base:number, seconds:number, isBoss:boolean):number {
  if (!Number.isFinite(base)) return 0;
  if (seconds <= 0) return base;
  return base * (isBoss?1.08:1.20);
}
