import { useState, useMemo, useRef, useCallback } from 'react';
import { Save, Eraser, ChevronDown, Check } from 'lucide-react';
import DenominationRow from '@/components/DenominationRow';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import { NOTES, COINS, emptyDenominations, calcAmount, totalNotesQty, totalCoinsQty } from '@/lib/denominations';
import { formatIndianRupees } from '@/lib/format';
import { createEntry, getKnownNames } from '@/lib/storage';
import type { Denominations, CashEntry, EntryList } from '@/lib/types';

interface CalculatorScreenProps {
  entries: EntryList;
  onAddEntry: (entry: CashEntry) => void;
}

export default function CalculatorScreen({ entries, onAddEntry }: CalculatorScreenProps) {
  const [denoms, setDenoms] = useState<Denominations>(() => emptyDenominations());
  const [looseChange, setLooseChange] = useState('');
  const [showSave, setShowSave] = useState(false);
  const [showClearCalc, setShowClearCalc] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [totalFlash, setTotalFlash] = useState(false);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const looseRef = useRef<HTMLInputElement>(null);

  const allDenoms = [...NOTES, ...COINS];

  const setQty = (key: keyof Denominations, q: number) => {
    setDenoms((prev) => ({ ...prev, [key]: q }));
    setTotalFlash(true);
    setTimeout(() => setTotalFlash(false), 400);
  };

  const looseAmount = (() => {
    const digits = looseChange.replace(/[^0-9]/g, '');
    return digits === '' ? 0 : parseInt(digits, 10) || 0;
  })();

  const amount = calcAmount(denoms, looseAmount);
  const notesQty = totalNotesQty(denoms);
  const coinsQty = totalCoinsQty(denoms);

  const clearCalculator = () => {
    setDenoms(emptyDenominations());
    setLooseChange('');
    setShowClearCalc(false);
  };

  const knownNames = useMemo(() => getKnownNames(entries), [entries]);

  // Enter key: move focus to next input
  const handleEnterKey = useCallback((index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (index + 1 < allDenoms.length) {
        inputRefs.current[index + 1]?.focus();
      } else {
        looseRef.current?.focus();
      }
    }
  }, [allDenoms.length]);

  const handleLooseEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Scrollable calc area */}
      <div className="min-h-0 flex-1 overflow-hidden px-3 pt-1 pb-1 flex flex-col">
        {/* Notes */}
        <section className="mb-1 flex min-h-0 flex-[1.6] flex-col">
          <h2 className="mb-0.5 px-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">Notes</h2>
          <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-ink-700 bg-ink-850/60 px-2.5 py-1">
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
        </section>

        {/* Coins */}
        <section className="mb-1.5 flex min-h-0 flex-[0.8] flex-col">
          <h2 className="mb-0.5 px-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">Coins</h2>
          <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-ink-700 bg-ink-850/60 px-3 py-1">
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
        </section>

        {/* Loose Change */}
        <section className="mb-1">
          <div className="flex items-center gap-2 rounded-xl border border-ink-700 bg-ink-850/60 px-3 py-1">
            <span className="min-w-0 flex-1 text-[17px] font-bold text-slate-200">Loose Change</span>
            <span className="text-sm font-bold text-accent-400">₹</span>
            <input
              ref={looseRef}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              pattern="[0-9]*"
              value={looseChange}
              onChange={(e) => setLooseChange(e.target.value.replace(/[^0-9]/g, ''))}
              onKeyDown={handleLooseEnter}
              onFocus={(e) => e.target.select()}
              aria-label="Loose change amount"
              className="h-11 w-20 rounded-lg border border-ink-700 bg-ink-800 text-right text-base font-semibold text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
            />
          </div>
        </section>

        {/* Compact summary line */}
        <div className="flex items-center gap-3 px-1 py-0.5 text-[12px] text-slate-500">
          <span>Notes <strong className="text-slate-300">{notesQty}</strong></span>
          <span>Coins <strong className="text-slate-300">{coinsQty}</strong></span>
          <span>Loose <strong className="text-slate-300">{formatIndianRupees(looseAmount)}</strong></span>
        </div>
      </div>

      {/* Total + Actions */}
      <div className="shrink-0 border-t border-ink-700 bg-ink-900/95 px-3 pt-1.5 pb-2">
        <div className={`mb-1.5 rounded-xl bg-gradient-to-r from-accent-600 to-accent-500 px-4 py-1.5 text-center transition-shadow ${totalFlash ? 'glow-accent' : ''}`}>
          <p className="text-[10px] font-medium uppercase tracking-wider text-accent-100">Total Cash</p>
          <p className="text-[25px] font-extrabold leading-tight text-white num-transition">{formatIndianRupees(amount)}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowSave(true)}
            className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-accent-500 text-sm font-semibold text-white transition active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
          >
            <Save size={15} />
            Save Entry
          </button>
          <button
            type="button"
            onClick={() => setShowClearCalc(true)}
            className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-ink-700 bg-ink-800 px-3 text-sm font-semibold text-slate-400 transition active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
          >
            <Eraser size={15} />
            Clear
          </button>
        </div>
      </div>

      {/* Save Entry Modal */}
      <SaveEntryModal
        open={showSave}
        onClose={() => setShowSave(false)}
        amount={amount}
        knownNames={knownNames}
        onSave={(person, note) => {
          onAddEntry(createEntry(person, note, amount, denoms, looseAmount));
          clearCalculator();
          setShowSave(false);
          setShowToast(true);
          setTimeout(() => setShowToast(false), 2000);
        }}
      />

      {/* Clear Calculator Confirmation */}
      <ConfirmDialog
        open={showClearCalc}
        title="Clear calculator?"
        message="This will reset all quantities and loose change to zero. Saved entries are not affected."
        confirmLabel="Clear"
        onConfirm={clearCalculator}
        onCancel={() => setShowClearCalc(false)}
      />

      {/* Save success toast */}
      {showToast && (
        <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 animate-toast-in">
          <div className="flex items-center gap-2 rounded-full bg-accent-500 px-4 py-2 text-sm font-semibold text-white shadow-lg">
            <Check size={16} />
            Entry saved
          </div>
        </div>
      )}
    </div>
  );
}

interface SaveEntryModalProps {
  open: boolean;
  onClose: () => void;
  amount: number;
  knownNames: string[];
  onSave: (person: string, note: string) => void;
}

function SaveEntryModal({ open, onClose, amount, knownNames, onSave }: SaveEntryModalProps) {
  const [person, setPerson] = useState('');
  const [note, setNote] = useState('');

  const suggestions = useMemo(() => {
    const q = person.trim().toLowerCase();
    if (!q) return [];
    return knownNames
      .filter((n) => n.toLowerCase().includes(q) && n.toLowerCase() !== q)
      .slice(0, 3);
  }, [person, knownNames]);

  const handleSave = () => {
    onSave(person, note);
    setPerson('');
    setNote('');
  };

  const handleClose = () => {
    setPerson('');
    setNote('');
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Save Entry">
      <div className="mb-3 rounded-lg border border-accent-700/40 bg-accent-500/10 px-3 py-2 text-center">
        <span className="text-lg font-bold text-accent-300">{formatIndianRupees(amount)}</span>
      </div>

      <label className="mb-1 block text-xs font-medium text-slate-400">Person / Source (optional)</label>
      <div className="relative mb-2">
        <input
          type="text"
          value={person}
          onChange={(e) => setPerson(e.target.value)}
          placeholder="e.g. Ankit, Cash Counter"
          aria-label="Person or source name"
          className="h-10 w-full rounded-lg border border-ink-700 bg-ink-800 px-3 text-base text-slate-100 placeholder:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
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

      <label className="mb-1 block text-xs font-medium text-slate-400">Note (optional)</label>
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="e.g. Morning collection"
        aria-label="Optional note"
        className="mb-3 h-10 w-full rounded-lg border border-ink-700 bg-ink-800 px-3 text-base text-slate-100 placeholder:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
      />

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleClose}
          className="flex-1 rounded-xl border border-ink-700 bg-ink-800 py-2.5 text-sm font-semibold text-slate-300 transition active:scale-95"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="flex-1 rounded-xl bg-accent-500 py-2.5 text-sm font-semibold text-white transition active:scale-95"
        >
          Save
        </button>
      </div>
    </Modal>
  );
}
