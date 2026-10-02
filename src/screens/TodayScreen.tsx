import { useMemo } from 'react';
import { CalendarDays } from 'lucide-react';
import { formatIndianRupees } from '@/lib/format';
import { todayKey, formatDateLong } from '@/lib/dateUtils';
import type { EntryList } from '@/lib/types';

interface TodayScreenProps {
  entries: EntryList;
  onPersonClick: (person: string, dateKey: string) => void;
}

interface PersonTotal {
  person: string;
  total: number;
  count: number;
}

export default function TodayScreen({ entries, onPersonClick }: TodayScreenProps) {
  const tKey = todayKey();
  const today = new Date();

  const persons = useMemo(() => {
    const todayEntries = entries.filter((e) => todayKey(new Date(e.timestamp)) === tKey);
    const map = new Map<string, PersonTotal>();
    for (const e of todayEntries) {
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
  }, [entries, tKey]);

  const dayTotal = persons.reduce((sum, p) => sum + p.total, 0);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-ink-700 bg-ink-900 px-4 py-2.5">
        <h2 className="text-sm font-bold text-slate-100">Today's Cash Collection</h2>
        <p className="flex items-center gap-1 text-[11px] text-slate-500">
          <CalendarDays size={12} />
          {formatDateLong(today)}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {persons.length === 0 ? (
          <div className="mt-12 text-center">
            <p className="text-sm text-slate-600">No entries saved today yet.</p>
            <p className="mt-1 text-xs text-slate-700">Use the Calculator to count and save cash.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {persons.map((p) => (
              <button
                key={p.person}
                type="button"
                onClick={() => onPersonClick(p.person, tKey)}
                className="flex items-center justify-between rounded-xl border border-ink-700 bg-ink-850 px-4 py-3 text-left transition active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 animate-slide-up"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-100">{p.person}</p>
                  <p className="text-[11px] text-slate-500">
                    {p.count} {p.count === 1 ? 'entry' : 'entries'}
                  </p>
                </div>
                <span className="text-sm font-bold text-accent-300">{formatIndianRupees(p.total)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-ink-700 bg-ink-900/80 px-4 py-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500">Total Collection</span>
          <span className="text-lg font-extrabold text-accent-400">{formatIndianRupees(dayTotal)}</span>
        </div>
      </div>
    </div>
  );
}
