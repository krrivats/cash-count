import { forwardRef } from 'react';
import { Minus, Plus } from 'lucide-react';
import { formatIndianRupees } from '@/lib/format';

interface DenominationRowProps {
  value: number;
  quantity: number;
  onQuantityChange: (q: number) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const DenominationRow = forwardRef<HTMLInputElement, DenominationRowProps>(
  ({ value, quantity, onQuantityChange, onKeyDown }, ref) => {
    const amount = value * quantity;
    const label = `₹${value}`;
    const type = value >= 10 ? 'note' : 'coin';

    const handleInput = (raw: string) => {
      const digits = raw.replace(/[^0-9]/g, '');
      if (digits === '') {
        onQuantityChange(0);
        return;
      }
      const parsed = parseInt(digits, 10);
      onQuantityChange(isNaN(parsed) ? 0 : parsed);
    };

    return (
      <div className="flex h-7 min-h-7 w-full min-w-0 items-center gap-1 py-0 overflow-hidden">
        <span className="w-10 shrink-0 text-[14px] font-bold leading-none text-slate-200">{label}</span>

        <div className="flex min-w-0 flex-1 items-center gap-1">
          <button
            type="button"
            onClick={() => onQuantityChange(Math.max(0, quantity - 1))}
            disabled={quantity === 0}
            aria-label={`Decrease ${label} ${type}s`}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-ink-700 text-slate-300 transition active:scale-90 disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
          >
            <Minus size={14} strokeWidth={2.5} />
          </button>

          <input
            ref={ref}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            pattern="[0-9]*"
            value={quantity === 0 ? '' : quantity.toString()}
            onChange={(e) => handleInput(e.target.value)}
            onKeyDown={onKeyDown}
            onFocus={(e) => e.target.select()}
            aria-label={`${label} ${type} quantity`}
            className="h-7 w-10 shrink-0 rounded-lg border border-ink-700 bg-ink-800 text-center text-base font-semibold text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
          />

          <button
            type="button"
            onClick={() => onQuantityChange(quantity + 1)}
            aria-label={`Increase ${label} ${type}s`}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent-500 text-white transition active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
          >
            <Plus size={14} strokeWidth={2.5} />
          </button>
        </div>

        <span
          className={`w-[4.5rem] shrink-0 text-right text-[12px] font-semibold num-transition ${
            amount > 0 ? 'text-accent-300' : 'text-slate-500'
          }`}
        >
          {formatIndianRupees(amount)}
        </span>
      </div>
    );
  }
);

DenominationRow.displayName = 'DenominationRow';

export default DenominationRow;
