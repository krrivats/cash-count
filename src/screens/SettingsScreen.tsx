import { useRef, useState } from 'react';
import { ChevronLeft, Download, Upload, Trash2, AlertTriangle } from 'lucide-react';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import { exportBackup, validateBackup, mergeEntries } from '@/lib/storage';
import type { EntryList } from '@/lib/types';

interface SettingsScreenProps {
  entries: EntryList;
  onClearAll: () => void;
  onReplaceAll: (entries: EntryList) => void;
  onBack: () => void;
}

export default function SettingsScreen({
  entries,
  onClearAll,
  onReplaceAll,
  onBack,
}: SettingsScreenProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [showClearAll, setShowClearAll] = useState(false);
  const [importData, setImportData] = useState<{ entries: EntryList; count: number } | null>(null);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [importError, setImportError] = useState<string | null>(null);
  const [showImportConfirm, setShowImportConfirm] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result);
      const data = validateBackup(text);
      if (!data) {
        setImportError('Invalid Cash Count backup file.');
        return;
      }
      setImportError(null);
      setImportData({ entries: data.entries, count: data.entries.length });
      setShowImportConfirm(true);
    };
    reader.onerror = () => setImportError('Could not read file.');
    reader.readAsText(file);
    e.target.value = '';
  };

  const confirmImport = () => {
    if (!importData) return;
    if (importMode === 'merge') {
      onReplaceAll(mergeEntries(entries, importData.entries));
    } else {
      onReplaceAll(importData.entries);
    }
    setImportData(null);
    setShowImportConfirm(false);
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
        <h2 className="text-sm font-bold text-slate-100">Settings</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <h3 className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate-500">Backup</h3>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => exportBackup(entries)}
            className="flex items-center gap-2 rounded-xl border border-ink-700 bg-ink-850 px-4 py-3 text-sm font-semibold text-slate-200 transition active:scale-[0.98]"
          >
            <Download size={18} className="text-accent-400" />
            Export Backup
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 rounded-xl border border-ink-700 bg-ink-850 px-4 py-3 text-sm font-semibold text-slate-200 transition active:scale-[0.98]"
          >
            <Upload size={18} className="text-accent-400" />
            Import Backup
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <h3 className="mb-2 mt-5 text-[10px] font-bold uppercase tracking-wide text-slate-500">Data</h3>
        <button
          type="button"
          onClick={() => setShowClearAll(true)}
          className="flex items-center gap-2 rounded-xl border border-red-800/40 bg-red-900/20 px-4 py-3 text-sm font-semibold text-red-400 transition active:scale-[0.98]"
        >
          <Trash2 size={18} />
          Clear All Data
        </button>

        <p className="mt-4 text-xs text-slate-600">
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'} stored locally in this browser.
        </p>
        <p className="mt-1 text-xs text-slate-700">
          All data stays on your device. Nothing is sent to any server.
        </p>
      </div>

      {/* Import Confirmation */}
      <Modal
        open={showImportConfirm && importData !== null}
        onClose={() => setShowImportConfirm(false)}
        title={`Import ${importData?.count ?? 0} entries?`}
      >
        <div className="mb-3 flex gap-2">
          <label className={`flex flex-1 items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${importMode === 'merge' ? 'border-accent-500 bg-accent-500/10 text-accent-300' : 'border-ink-700 text-slate-400'}`}>
            <input
              type="radio"
              checked={importMode === 'merge'}
              onChange={() => setImportMode('merge')}
            />
            Merge
          </label>
          <label className={`flex flex-1 items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${importMode === 'replace' ? 'border-accent-500 bg-accent-500/10 text-accent-300' : 'border-ink-700 text-slate-400'}`}>
            <input
              type="radio"
              checked={importMode === 'replace'}
              onChange={() => setImportMode('replace')}
            />
            Replace
          </label>
        </div>
        <p className="mb-3 text-xs text-slate-500">
          {importMode === 'merge'
            ? 'New entries will be added without duplicating existing ones.'
            : 'All existing data will be replaced with the imported entries.'}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowImportConfirm(false)}
            className="flex-1 rounded-xl border border-ink-700 bg-ink-800 py-2.5 text-sm font-semibold text-slate-300 transition active:scale-95"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmImport}
            className="flex-1 rounded-xl bg-accent-500 py-2.5 text-sm font-semibold text-white transition active:scale-95"
          >
            Import
          </button>
        </div>
      </Modal>

      {/* Import Error */}
      <Modal open={importError !== null} onClose={() => setImportError(null)} title="Import Failed">
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle size={20} className="text-amber-500" />
          <p className="text-sm text-slate-300">{importError}</p>
        </div>
        <button
          type="button"
          onClick={() => setImportError(null)}
          className="w-full rounded-xl bg-ink-700 py-2.5 text-sm font-semibold text-white"
        >
          OK
        </button>
      </Modal>

      {/* Clear All Data Confirmation */}
      <ConfirmDialog
        open={showClearAll}
        title="Delete all data?"
        message="This will permanently delete all saved cash records from this browser."
        confirmLabel="Delete All Data"
        onConfirm={() => {
          onClearAll();
          setShowClearAll(false);
        }}
        onCancel={() => setShowClearAll(false)}
      />
    </div>
  );
}
