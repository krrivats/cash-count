import type { Denominations } from './types';

export interface DenomConfig {
  value: number;
  key: keyof Denominations;
}

export const NOTES: DenomConfig[] = [
  { value: 500, key: 'n500' },
  { value: 200, key: 'n200' },
  { value: 100, key: 'n100' },
  { value: 50, key: 'n50' },
  { value: 20, key: 'n20' },
  { value: 10, key: 'n10' },
];

export const COINS: DenomConfig[] = [
  { value: 5, key: 'c5' },
  { value: 2, key: 'c2' },
  { value: 1, key: 'c1' },
];

export const ALL_DENOMS = [...NOTES, ...COINS];

export function emptyDenominations(): Denominations {
  return { n500: 0, n200: 0, n100: 0, n50: 0, n20: 0, n10: 0, c5: 0, c2: 0, c1: 0 };
}

export function calcAmount(denoms: Denominations, looseChange: number): number {
  let total = 0;
  for (const d of ALL_DENOMS) {
    total += d.value * (denoms[d.key] || 0);
  }
  return total + looseChange;
}

export function totalNotesQty(denoms: Denominations): number {
  return NOTES.reduce((sum, d) => sum + (denoms[d.key] || 0), 0);
}

export function totalCoinsQty(denoms: Denominations): number {
  return COINS.reduce((sum, d) => sum + (denoms[d.key] || 0), 0);
}
