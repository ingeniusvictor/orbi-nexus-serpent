/** AS-R2: independent targeting from each mounted core; pure and deterministic. */
export interface AssaultTargetPoint { x: number; y: number; health: number; spawnPortalTimer?: number; isElite?: boolean; isBoss?: boolean }
export interface AssaultTargetOrigin { x: number; y: number }
export function selectNearestAssaultTarget<T extends AssaultTargetPoint>(
  origin: AssaultTargetOrigin,
  enemies: readonly T[],
  range: number,
): T | null {
  if (!Number.isFinite(origin.x) || !Number.isFinite(origin.y) ||
      !Number.isFinite(range) || range <= 0) return null;
  let candidate: T | null = null;
  let bestSquare = range * range;
  for (const enemy of enemies) {
    if (!Number.isFinite(enemy.x) || !Number.isFinite(enemy.y) ||
        !Number.isFinite(enemy.health) || enemy.health <= 0 ||
        (enemy.spawnPortalTimer ?? 0) > 0) continue;
    const dx = origin.x - enemy.x;
    const dy = origin.y - enemy.y;
    const square = dx * dx + dy * dy;
    if (square < bestSquare) {
      bestSquare = square;
      candidate = enemy;
    }
  }
  return candidate;
}
