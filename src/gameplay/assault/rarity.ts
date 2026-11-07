import type { UpgradeRarity } from '../../types';

export interface AssaultRarityWeights { common:number; rare:number; epic:number; legendary:number }
/** One independent roll across four exact rarity bands; no paid modifiers. */
export function rollAssaultRarity(weights: AssaultRarityWeights, roll: number): UpgradeRarity {
  const legendary = Math.max(0, weights.legendary);
  const epic = Math.max(0, weights.epic);
  const rare = Math.max(0, weights.rare);
  const common = Math.max(0, weights.common);
  const total = legendary + epic + rare + common;
  if (!Number.isFinite(total) || total <= 0) return 'common';
  const value = Math.min(0.999999999999, Math.max(0, Number.isFinite(roll) ? roll : 1)) * total;
  if (value < legendary) return 'legendary';
  if (value < legendary + epic) return 'epic';
  if (value < legendary + epic + rare) return 'rare';
  return 'common';
}
