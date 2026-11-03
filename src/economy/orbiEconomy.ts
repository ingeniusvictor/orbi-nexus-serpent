/**
 * ORBI Ecosystem — single, game-independent currency vocabulary.
 *
 * Prototype only. This module does not mint coins, initiate purchases, store
 * balances, or grant paid benefits. A future authorized server ledger must
 * own all monetary entitlements and verified store receipts.
 */
export const ORBI_ECONOMY_SCHEMA_VERSION = 1 as const;
export const ORBI_ECONOMY_PURCHASES_ENABLED = false as const;

export const ORBI_PRISMAS = Object.freeze({
  id: 'orbi.prismas',
  code: 'OPR',
  name: 'Prismas ORBI',
  singular: 'Prisma ORBI',
  symbol: '◇',
  issuer: 'ORBI Ecosystem',
  type: 'virtual_currency' as const,
  transferable: false,
  cashConvertible: false,
  currentlyPurchasable: ORBI_ECONOMY_PURCHASES_ENABLED,
  version: ORBI_ECONOMY_SCHEMA_VERSION,
});

export type OrbiCurrencyCode = typeof ORBI_PRISMAS.code;
export type OrbiEconomyGameId =
  | 'orbi.nexus-serpent'
  | 'orbi.energy-swarm'
  | 'orbi.grid-ascent'
  | 'orbi.energy-slash'
  | 'orbi.dash';

/** Future backend-only events. No browser code is authorized to mint coins. */
export interface OrbiWalletEntry {
  id: string; // Unique, idempotent server-issued transaction ID.
  walletId: string; // Authenticated user wallet, shared by ORBI games.
  currencyCode: OrbiCurrencyCode;
  gameId: OrbiEconomyGameId;
  type: 'reward' | 'purchase_grant' | 'spend' | 'refund' | 'adjustment';
  amount: number; // Signed integer; negative for spends.
  createdAt: string;
  sourceId: string; // E.g. room reward ID or verified store receipt ID.
}

export interface OrbiWalletSnapshot {
  walletId: string;
  currencyCode: OrbiCurrencyCode;
  balance: number;
  version: number;
  updatedAt: string;
}

/** Future-priced service; deliberately disabled until real wallet integration. */
export const ORBI_ASSAULT_RECONNECTION_OFFER = Object.freeze({
  id: 'orbi.nexus-serpent.revive',
  gameId: 'orbi.nexus-serpent' as const,
  costPrismas: 30,
  paymentEnabled: ORBI_ECONOMY_PURCHASES_ENABLED,
});

export function formatOrbiPrismas(amount: number): string {
  if (!Number.isSafeInteger(amount) || amount < 0) return '—';
  return amount.toLocaleString('es-CL') + ' ' + ORBI_PRISMAS.code;
}
