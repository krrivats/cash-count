import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatIndianRupees } from '@/lib/format';
import { todayKey, formatDateFromKey } from '@/lib/dateUtils';
import type { EntryList } from '@/lib/types';

interface HistoryScreenProps {
  entries: EntryList;
  onPersonClick: (person: string, dateKey: string) => void;
  onBack: () => void;
}

interface DayTotal {
  dateKey: string;
  total: number;
  count: number;
}

interface PersonInDay {
  person: string;
  total: number;
  count: number;
}

export default function HistoryScreen({ entries, onPersonClick }: HistoryScreenProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const days = useMemo(() => {
    const map = new Map<string, DayTotal>();
    for (const e of entries) {
      const key = todayKey(new Date(e.timestamp));
      const existing = map.get(key);
      if (existing) {
        existing.total += e.amount;
        existing.count += 1;
      } else {
        map.set(key, { dateKey: key, total: e.amount, count: 1 });
      }
    }
    return Array.from(map.values()).sort((a, b) => b.dateKey.localeCompare(a.dateKey));
  }, [entries]);

  const personsInDay = useMemo(() => {
    if (!selectedDate) return [];
    const dayEntries = entries.filter((e) => todayKey(new Date(e.timestamp)) === selectedDate);
    const map = new Map<string, PersonInDay>();
    for (const e of dayEntries) {
      const lower = e.person.toLowerCase();
      const existing = map.get(lower);
      if (existing) {
        existing.total += e.amount;
        existing.count += 1;
      } else {
        map.set(lower, { person: e.person, total: e.amount, count: 1 });
      }
    }
    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [entries, selectedDate]);

  const dayTotal = personsInDay.reduce((sum, p) => sum + p.total, 0);

  if (selectedDate) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-2 border-b border-ink-700 bg-ink-900 px-3 py-2.5">
          <button
            type="button"
            onClick={() => setSelectedDate(null)}
            aria-label="Back to history"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-ink-700"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-sm font-bold text-slate-100">{formatDateFromKey(selectedDate)}</h2>
            <p className="text-[11px] text-slate-500">{personsInDay.length} {personsInDay.length === 1 ? 'person' : 'people'}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {personsInDay.map((p) => (
            <button
              key={p.person}
              type="button"
              onClick={() => onPersonClick(p.person, selectedDate)}
              className="mb-2 flex w-full items-center justify-between rounded-xl border border-ink-700 bg-ink-850 px-4 py-3 text-left transition active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 animate-slide-up"
            >
              <div>
                <p className="text-sm font-semibold text-slate-100">{p.person}</p>
                <p className="text-[11px] text-slate-500">
                  {p.count} {p.count === 1 ? 'entry' : 'entries'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-accent-300">{formatIndianRupees(p.total)}</span>
                <ChevronRight size={16} className="text-slate-600" />
              </div>
            </button>
          ))}
        </div>

        <div className="border-t border-ink-700 bg-ink-900/80 px-4 py-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500">Total</span>
            <span className="text-lg font-extrabold text-accent-400">{formatIndianRupees(dayTotal)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-ink-700 bg-ink-900 px-4 py-2.5">
        <h2 className="text-sm font-bold text-slate-100">History</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {days.length === 0 ? (
          <div className="mt-12 text-center">
            <p className="text-sm text-slate-600">No saved entries yet.</p>
            <p className="mt-1 text-xs text-slate-700">Saved cash counts will appear here grouped by date.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {days.map((d) => (
              <button
                key={d.dateKey}
                type="button"
                onClick={() => setSelectedDate(d.dateKey)}
                className="flex items-center justify-between rounded-xl border border-ink-700 bg-ink-850 px-4 py-3 text-left transition active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 animate-slide-up"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-100">{formatDateFromKey(d.dateKey)}</p>
                  <p className="text-[11px] text-slate-500">
                    {d.count} {d.count === 1 ? 'entry' : 'entries'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-accent-300">{formatIndianRupees(d.total)}</span>
                  <ChevronRight size={16} className="text-slate-600" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
