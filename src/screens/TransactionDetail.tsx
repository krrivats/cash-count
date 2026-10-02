import { ChevronLeft } from 'lucide-react';
import { formatIndianRupees } from '@/lib/format';
import { formatDateFromKey, formatTime, todayKey } from '@/lib/dateUtils';
import { NOTES, COINS } from '@/lib/denominations';
import type { CashEntry } from '@/lib/types';

interface TransactionDetailProps {
  entry: CashEntry;
  onBack: () => void;
}

export default function TransactionDetail({ entry, onBack }: TransactionDetailProps) {
  const dateKey = todayKey(new Date(entry.timestamp));

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
          <h2 className="text-sm font-bold text-slate-100">{entry.person}</h2>
          <p className="text-[11px] text-slate-500">{formatDateFromKey(dateKey)} · {formatTime(entry.timestamp)}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {entry.note && (
          <div className="mb-3 rounded-lg border border-ink-700 bg-ink-850 px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Note</p>
            <p className="text-sm text-slate-300">{entry.note}</p>
          </div>
        )}

        {/* Notes breakdown */}
        <h3 className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">Notes</h3>
        <div className="mb-3 rounded-xl border border-ink-700 bg-ink-850/60 px-3 py-1.5">
          {NOTES.map((d) => {
            const qty = entry.denominations[d.key] || 0;
            const amt = d.value * qty;
            const isZero = qty === 0;
            return (
              <div
                key={d.key}
                className={`flex items-center justify-between py-[3px] text-sm ${
                  isZero ? 'opacity-40' : ''
                }`}
              >
                <span className="text-slate-400">
                  <span className="font-semibold text-slate-300">₹{d.value}</span>
                  {' × '}
                  {qty}
                </span>
                <span className={`font-semibold ${isZero ? 'text-slate-600' : 'text-accent-300'}`}>
                  {formatIndianRupees(amt)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Coins breakdown */}
        <h3 className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">Coins</h3>
        <div className="mb-3 rounded-xl border border-ink-700 bg-ink-850/60 px-3 py-1.5">
          {COINS.map((d) => {
            const qty = entry.denominations[d.key] || 0;
            const amt = d.value * qty;
            const isZero = qty === 0;
            return (
              <div
                key={d.key}
                className={`flex items-center justify-between py-[3px] text-sm ${
                  isZero ? 'opacity-40' : ''
                }`}
              >
                <span className="text-slate-400">
                  <span className="font-semibold text-slate-300">₹{d.value}</span>
                  {' × '}
                  {qty}
                </span>
                <span className={`font-semibold ${isZero ? 'text-slate-600' : 'text-accent-300'}`}>
                  {formatIndianRupees(amt)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Loose change */}
        <div className="mb-3 flex items-center justify-between rounded-xl border border-ink-700 bg-ink-850/60 px-3 py-2 text-sm">
          <span className="text-slate-400">Loose Change</span>
          <span className={`font-semibold ${entry.looseChange > 0 ? 'text-accent-300' : 'text-slate-600'}`}>
            {formatIndianRupees(entry.looseChange)}
          </span>
        </div>
      </div>

      <div className="border-t border-ink-700 bg-ink-900/80 px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Total</span>
          <span className="text-xl font-extrabold text-accent-400">{formatIndianRupees(entry.amount)}</span>
        </div>
      </div>
    </div>
  );
}
