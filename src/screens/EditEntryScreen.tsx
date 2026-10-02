import { useState, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronDown, Save } from 'lucide-react';
import DenominationRow from '@/components/DenominationRow';
import ConfirmDialog from '@/components/ConfirmDialog';
import { NOTES, COINS, calcAmount, totalNotesQty, totalCoinsQty } from '@/lib/denominations';
import { formatIndianRupees } from '@/lib/format';
import { getKnownNames } from '@/lib/storage';
import type { Denominations, CashEntry, EntryList } from '@/lib/types';

interface EditEntryScreenProps {
  entry: CashEntry;
  allEntries: EntryList;
  onSave: (id: string, updates: Partial<CashEntry>) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

export default function EditEntryScreen({
  entry,
  allEntries,
  onSave,
  onDelete,
  onBack,
}: EditEntryScreenProps) {
  const [person, setPerson] = useState(entry.person);
  const [note, setNote] = useState(entry.note);
  const [denoms, setDenoms] = useState<Denominations>(entry.denominations);
  const [looseChange, setLooseChange] = useState(String(entry.looseChange || ''));
  const [showDelete, setShowDelete] = useState(false);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const looseRef = useRef<HTMLInputElement>(null);
  const allDenoms = [...NOTES, ...COINS];

  const knownNames = useMemo(() => getKnownNames(allEntries), [allEntries]);
  const suggestions = useMemo(() => {
    const q = person.trim().toLowerCase();
    if (!q) return [];
    return knownNames.filter((n) => n.toLowerCase().includes(q) && n.toLowerCase() !== q).slice(0, 3);
  }, [person, knownNames]);

  const setQty = (key: keyof Denominations, q: number) => {
    setDenoms((prev) => ({ ...prev, [key]: q }));
  };

  const looseAmount = (() => {
    const digits = looseChange.replace(/[^0-9]/g, '');
    return digits === '' ? 0 : parseInt(digits, 10) || 0;
  })();

  const amount = calcAmount(denoms, looseAmount);
  const notesQty = totalNotesQty(denoms);
  const coinsQty = totalCoinsQty(denoms);

  const handleEnterKey = (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (index + 1 < allDenoms.length) {
        inputRefs.current[index + 1]?.focus();
      } else {
        looseRef.current?.focus();
      }
    }
  };

  const handleSave = () => {
    onSave(entry.id, {
      person: person.trim() || 'General',
      note: note.trim(),
      amount,
      denominations: denoms,
      looseChange: looseAmount,
    });
    onBack();
  };

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
        <h2 className="text-sm font-bold text-slate-100">Edit Entry</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2">
        {/* Person */}
        <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-500">Person / Source</label>
        <div className="relative mb-2">
          <input
            type="text"
            value={person}
            onChange={(e) => setPerson(e.target.value)}
            aria-label="Person or source name"
            className="h-10 w-full rounded-lg border border-ink-700 bg-ink-800 px-3 text-base text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
          />
          {suggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full rounded-lg border border-ink-700 bg-ink-850 shadow-xl">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setPerson(s)}
                  className="flex w-full items-center gap-1.5 px-3 py-2 text-left text-sm text-slate-300 hover:bg-ink-700"
                >
                  <ChevronDown size={14} className="text-slate-500" />
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Note */}
        <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-500">Note (optional)</label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Morning collection"
          aria-label="Optional note"
          className="mb-2 h-10 w-full rounded-lg border border-ink-700 bg-ink-800 px-3 text-base text-slate-100 placeholder:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
        />

        {/* Notes */}
        <h3 className="mb-0.5 mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Notes</h3>
        <div className="mb-2 rounded-xl border border-ink-700 bg-ink-850/60 px-3 py-1">
          {NOTES.map((d, i) => (
            <DenominationRow
              key={d.key}
              ref={(el) => { inputRefs.current[i] = el; }}
              value={d.value}
              quantity={denoms[d.key]}
              onQuantityChange={(q) => setQty(d.key, q)}
              onKeyDown={handleEnterKey(i)}
            />
          ))}
        </div>

        {/* Coins */}
        <h3 className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">Coins</h3>
        <div className="mb-2 rounded-xl border border-ink-700 bg-ink-850/60 px-3 py-1">
          {COINS.map((d, i) => (
            <DenominationRow
              key={d.key}
              ref={(el) => { inputRefs.current[NOTES.length + i] = el; }}
              value={d.value}
              quantity={denoms[d.key]}
              onQuantityChange={(q) => setQty(d.key, q)}
              onKeyDown={handleEnterKey(NOTES.length + i)}
            />
          ))}
        </div>

        {/* Loose Change */}
        <div className="mb-2 flex items-center gap-2 rounded-xl border border-ink-700 bg-ink-850/60 px-3 py-1.5">
          <span className="flex-1 text-sm font-bold text-slate-200">Loose Change</span>
          <span className="text-sm font-bold text-accent-400">₹</span>
          <input
            ref={looseRef}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            pattern="[0-9]*"
            value={looseChange}
            onChange={(e) => setLooseChange(e.target.value.replace(/[^0-9]/g, ''))}
            onFocus={(e) => e.target.select()}
            aria-label="Loose change amount"
            className="h-8 w-20 rounded-lg border border-ink-700 bg-ink-800 text-right text-base font-semibold text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
          />
        </div>

        <div className="flex items-center gap-3 px-1 text-[11px] text-slate-500">
          <span>Notes <strong className="text-slate-300">{notesQty}</strong></span>
          <span>Coins <strong className="text-slate-300">{coinsQty}</strong></span>
        </div>
      </div>

      {/* Total + Actions */}
      <div className="border-t border-ink-700 bg-ink-900/80 px-3 pt-2 pb-2.5">
        <div className="mb-2 rounded-xl bg-gradient-to-r from-accent-600 to-accent-500 px-4 py-2 text-center">
          <p className="text-[10px] font-medium uppercase tracking-wider text-accent-100">Total Cash</p>
          <p className="text-2xl font-extrabold text-white">{formatIndianRupees(amount)}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowDelete(true)}
            className="flex h-10 items-center justify-center rounded-xl border border-red-800/50 bg-red-900/20 px-4 text-sm font-semibold text-red-400 transition active:scale-95"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-accent-500 text-sm font-semibold text-white transition active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
          >
            <Save size={15} />
            Save Changes
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={showDelete}
        title="Delete this cash entry?"
        message="This entry will be permanently removed."
        confirmLabel="Delete"
        onConfirm={() => {
          onDelete(entry.id);
          onBack();
        }}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  );
}
