import { useState, useEffect, useCallback } from 'react';
import type { CashEntry, EntryList } from '@/lib/types';
import { loadEntries, saveEntries } from '@/lib/storage';

export function useEntries() {
  const [entries, setEntries] = useState<EntryList>(() => loadEntries());

  useEffect(() => {
    saveEntries(entries);
  }, [entries]);

  const addEntry = useCallback((entry: CashEntry) => {
    setEntries((prev) => [...prev, entry]);
  }, []);

  const updateEntry = useCallback((id: string, updates: Partial<CashEntry>) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setEntries([]);
  }, []);

  const replaceAll = useCallback((newEntries: EntryList) => {
    setEntries(newEntries);
  }, []);

  return { entries, addEntry, updateEntry, deleteEntry, clearAll, replaceAll };
}
