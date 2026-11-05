/** AS-R2: damage for a newly completed Cerco de Resonancia.
 * Only called once per closure event. No per-frame damage or resource minting.
 */
import { pointInPolygon, polygonBounds, type ResonanceLoop } from './resonanceGeometry';
export interface ResonanceEnemy { id: string; x: number; y: number; health: number; maxHealth?: number; isBoss?: boolean; type?: string; archetype?: string; }
export interface ResonanceHit { id: string; damage: number; }
export function calculateResonanceHits(loop: ResonanceLoop, enemies: readonly ResonanceEnemy[], equippedCores: number): ResonanceHit[] {
  const bounds = polygonBounds(loop.polygon);
  if (!bounds || !Number.isFinite(equippedCores)) return [];
  const hits: ResonanceHit[] = [];
  const base = 9 + Math.min(8,Math.max(0,Math.floor(equippedCores))) * 2;
  for (const enemy of enemies) {
    if (!enemy.id || !Number.isFinite(enemy.x) || !Number.isFinite(enemy.y) ||
        !Number.isFinite(enemy.health) || enemy.health <= 0 ||
        enemy.type === 'REST_BEACON' || enemy.archetype === 'rest_beacon' ||
        enemy.x < bounds.minX || enemy.x > bounds.maxX ||
        enemy.y < bounds.minY || enemy.y > bounds.maxY) continue;
    if (!pointInPolygon(enemy, loop.polygon)) continue;
    // Keep a loop meaningful for groups while protecting bosses from instant deletes.
    const damage = enemy.isBoss
      ? Math.min(base, Math.max(1, Math.floor((enemy.maxHealth ?? enemy.health) * .035)))
      : base;
    hits.push({id:enemy.id,damage});
  }
  return hits;
}
