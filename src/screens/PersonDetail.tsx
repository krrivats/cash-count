import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Pencil } from 'lucide-react';
import { formatIndianRupees } from '@/lib/format';
import { todayKey, formatDateFromKey, formatTime } from '@/lib/dateUtils';
import type { CashEntry, EntryList } from '@/lib/types';

interface PersonDetailProps {
  person: string;
  dateKey: string;
  entries: EntryList;
  onBack: () => void;
  onEntryClick: (entry: CashEntry) => void;
  onEditEntry: (entry: CashEntry) => void;
}

export default function PersonDetail({
  person,
  dateKey,
  entries,
  onBack,
  onEntryClick,
  onEditEntry,
}: PersonDetailProps) {
  const personEntries = useMemo(() => {
    return entries
      .filter(
        (e) =>
          e.person.toLowerCase() === person.toLowerCase() &&
          todayKey(new Date(e.timestamp)) === dateKey
      )
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [entries, person, dateKey]);

  const total = personEntries.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-ink-700 bg-ink-900 px-3 py-2.5">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-ink-700"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h2 className="text-sm font-bold text-slate-100">{person}</h2>
          <p className="text-[11px] text-slate-500">{formatDateFromKey(dateKey)}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {personEntries.map((e) => (
          <div
            key={e.id}
            className="mb-2 rounded-xl border border-ink-700 bg-ink-850 px-4 py-3 animate-slide-up"
          >
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => onEntryClick(e)}
                className="flex-1 text-left"
              >
                <p className="text-[11px] text-slate-500">{formatTime(e.timestamp)}</p>
                <p className="text-base font-bold text-slate-100">{formatIndianRupees(e.amount)}</p>
                {e.note && <p className="mt-0.5 text-xs text-slate-500">{e.note}</p>}
              </button>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => onEditEntry(e)}
                  aria-label="Edit entry"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-ink-700"
                >
                  <Pencil size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => onEntryClick(e)}
                  aria-label="View entry details"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-ink-700"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-ink-700 bg-ink-900/80 px-4 py-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500">Total</span>
          <span className="text-lg font-extrabold text-accent-400">{formatIndianRupees(total)}</span>
        </div>
      </div>
    </div>
  );
}
