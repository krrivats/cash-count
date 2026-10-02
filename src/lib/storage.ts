import type { CashEntry, Denominations, EntryList, BackupData } from './types';

const STORAGE_KEY = 'cash-count-entries';
const BACKUP_APP = 'cash-count';
const BACKUP_VERSION = 1;

export function loadEntries(): EntryList {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidEntry);
  } catch {
    return [];
  }
}

export function saveEntries(entries: EntryList): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function isValidEntry(e: unknown): e is CashEntry {
  if (typeof e !== 'object' || e === null) return false;
  const obj = e as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.person === 'string' &&
    typeof obj.note === 'string' &&
    typeof obj.amount === 'number' &&
    typeof obj.timestamp === 'number' &&
    typeof obj.denominations === 'object' &&
    typeof obj.looseChange === 'number'
  );
}

export function createEntry(
  person: string,
  note: string,
  amount: number,
  denominations: Denominations,
  looseChange: number
): CashEntry {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    person: person.trim() || 'General',
    note: note.trim(),
    amount,
    denominations,
    looseChange,
    timestamp: Date.now(),
  };
}

export function getKnownNames(entries: EntryList): string[] {
  const seen = new Map<string, string>();
  for (const e of entries) {
    const lower = e.person.toLowerCase();
    if (!seen.has(lower)) seen.set(lower, e.person);
  }
  return Array.from(seen.values());
}

export function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

export function exportBackup(entries: EntryList): void {
  const data: BackupData = {
    app: BACKUP_APP,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    entries,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cash-count-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function validateBackup(text: string): BackupData | null {
  try {
    const parsed = JSON.parse(text);
    if (parsed.app !== BACKUP_APP) return null;
    if (!Array.isArray(parsed.entries)) return null;
    const valid = parsed.entries.filter(isValidEntry);
    if (valid.length !== parsed.entries.length) return null;
    return { ...parsed, entries: valid };
  } catch {
    return null;
  }
}

export function mergeEntries(existing: EntryList, imported: EntryList): EntryList {
  const existingIds = new Set(existing.map((e) => e.id));
  const merged = [...existing];
  for (const e of imported) {
    if (!existingIds.has(e.id)) {
      merged.push(e);
    }
  }
  merged.sort((a, b) => a.timestamp - b.timestamp);
  return merged;
}
