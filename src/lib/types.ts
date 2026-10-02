export interface Denominations {
  n500: number;
  n200: number;
  n100: number;
  n50: number;
  n20: number;
  n10: number;
  c5: number;
  c2: number;
  c1: number;
}

export interface CashEntry {
  id: string;
  person: string;
  note: string;
  amount: number;
  denominations: Denominations;
  looseChange: number;
  timestamp: number;
}

export type EntryList = CashEntry[];

export interface BackupData {
  app: 'cash-count';
  version: number;
  exportedAt: string;
  entries: EntryList;
}
