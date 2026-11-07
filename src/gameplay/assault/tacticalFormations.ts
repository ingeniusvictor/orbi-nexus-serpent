import type { AssaultRoomType } from '../../types';

/** RV-10A: deterministic enemy compositions, not a new combat loop.
 * Roles are existing ORBI enemy families; no new assets or hitboxes.
 * The room index controls tactics, while the difficulty director controls total count.
 */
export type AssaultTactic = 'equilibrio' | 'persecucion' | 'asedio' | 'presion' | 'enjambre' | 'elite' | 'antesala';
export type AssaultFormation = {
  tactic: AssaultTactic;
  wispCount: number;
  droneCount: number;
  spitterCount: number;
};

export function selectAssaultFormation(
  roomIndex: number,
  roomType: AssaultRoomType,
  requestedCount: number
): AssaultFormation {
  const room = Number.isFinite(roomIndex) ? Math.max(1, Math.trunc(roomIndex)) : 1;
  const total = Number.isFinite(requestedCount)
    ? Math.max(1, Math.min(60, Math.round(requestedCount)))
    : 1;
  if (roomType === 'boss_preview') {
    return { tactic: 'antesala', wispCount: 1, droneCount: 1, spitterCount: 1 };
  }

  let tactic: AssaultTactic;
  let shares: readonly [number, number];
  if (roomType === 'swarm') {
    tactic = 'enjambre'; shares = [0.65, 0.25];
  } else if (roomType === 'elite') {
    tactic = 'elite'; shares = [0.30, 0.30];
  } else {
    // Each new normal combat chamber calls for a different reaction.
    const cycle = (room - 1) % 4;
    tactic = (['equilibrio', 'persecucion', 'asedio', 'presion'] as const)[cycle];
    shares = (
      [[0.40, 0.40], [0.65, 0.25], [0.20, 0.25], [0.30, 0.50]] as const
    )[cycle];
  }

  const wispCount = Math.round(total * shares[0]);
  const droneCount = Math.min(total - wispCount, Math.round(total * shares[1]));
  const spitterCount = total - wispCount - droneCount;
  return { tactic, wispCount, droneCount, spitterCount };
}
