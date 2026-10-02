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
      <div className="flex items-center gap-2 py-[3px]">
        <span className="w-10 shrink-0 text-sm font-bold text-slate-200">{label}</span>

        <div className="flex flex-1 items-center gap-1.5">
          <button
            type="button"
            onClick={() => onQuantityChange(Math.max(0, quantity - 1))}
            disabled={quantity === 0}
            aria-label={`Decrease ${label} ${type}s`}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink-700 text-slate-300 transition active:scale-90 disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
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
            className="h-8 w-11 shrink-0 rounded-lg border border-ink-700 bg-ink-800 text-center text-base font-semibold text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
          />

          <button
            type="button"
            onClick={() => onQuantityChange(quantity + 1)}
            aria-label={`Increase ${label} ${type}s`}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-500 text-white transition active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
          >
            <Plus size={14} strokeWidth={2.5} />
          </button>
        </div>

        <span
          className={`w-20 shrink-0 text-right text-sm font-semibold num-transition ${
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
