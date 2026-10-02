import { useState } from 'react';
import { Calculator, CalendarDays, History, Settings } from 'lucide-react';
import Logo from '@/components/Logo';
import { useEntries } from '@/hooks/useEntries';
import { formatDateLong } from '@/lib/dateUtils';
import CalculatorScreen from '@/screens/CalculatorScreen';
import TodayScreen from '@/screens/TodayScreen';
import HistoryScreen from '@/screens/HistoryScreen';
import PersonDetail from '@/screens/PersonDetail';
import TransactionDetail from '@/screens/TransactionDetail';
import EditEntryScreen from '@/screens/EditEntryScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import type { CashEntry } from '@/lib/types';

type Tab = 'calculator' | 'today' | 'history';

export default function App() {
  const { entries, addEntry, updateEntry, deleteEntry, clearAll, replaceAll } = useEntries();
  const [tab, setTab] = useState<Tab>('calculator');

  const [personDetail, setPersonDetail] = useState<{ person: string; dateKey: string } | null>(null);
  const [transactionDetail, setTransactionDetail] = useState<CashEntry | null>(null);
  const [editingEntry, setEditingEntry] = useState<CashEntry | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const handlePersonClick = (person: string, dateKey: string) => {
    setPersonDetail({ person, dateKey });
  };

  const handleEntryClick = (entry: CashEntry) => {
    setTransactionDetail(entry);
  };

  const handleEditEntry = (entry: CashEntry) => {
    setEditingEntry(entry);
  };

  const handleEditSave = (id: string, updates: Partial<CashEntry>) => {
    updateEntry(id, updates);
    setEditingEntry(null);
  };

  const renderContent = () => {
    if (showSettings) {
      return (
        <SettingsScreen
          entries={entries}
          onClearAll={clearAll}
          onReplaceAll={replaceAll}
          onBack={() => setShowSettings(false)}
        />
      );
    }

    if (editingEntry) {
      return (
        <EditEntryScreen
          entry={editingEntry}
          allEntries={entries}
          onSave={handleEditSave}
          onDelete={deleteEntry}
          onBack={() => setEditingEntry(null)}
        />
      );
    }

    if (transactionDetail) {
      return (
        <TransactionDetail
          entry={transactionDetail}
          onBack={() => setTransactionDetail(null)}
        />
      );
    }

    if (personDetail) {
      return (
        <PersonDetail
          person={personDetail.person}
          dateKey={personDetail.dateKey}
          entries={entries}
          onBack={() => setPersonDetail(null)}
          onEntryClick={handleEntryClick}
          onEditEntry={handleEditEntry}
        />
      );
    }

    if (tab === 'calculator') {
      return <CalculatorScreen entries={entries} onAddEntry={addEntry} />;
    }

    if (tab === 'today') {
      return <TodayScreen entries={entries} onPersonClick={handlePersonClick} />;
    }

    return <HistoryScreen entries={entries} onPersonClick={handlePersonClick} onBack={() => setTab('history')} />;
  };

  const showBottomNav = !personDetail && !showSettings && !transactionDetail && !editingEntry;

  return (
    <div className="flex min-h-dvh items-center justify-center overflow-hidden bg-ink-950 sm:py-0">
      {/* Mobile container */}
      <div className="flex h-dvh w-full max-w-md min-w-0 flex-col overflow-hidden bg-ink-950 shadow-2xl sm:rounded-none sm:border-x sm:border-ink-800">
        {/* Compact Header with Logo */}
        <header className="flex items-center justify-between border-b border-ink-800 bg-ink-900/90 px-3 py-2 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Logo size={26} />
            <div>
              <h1 className="text-sm font-bold text-slate-100">Cash Count</h1>
              <p className="text-[10px] text-slate-500">{formatDateLong(new Date())}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowSettings(true)}
            aria-label="Settings"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-ink-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
          >
            <Settings size={18} />
          </button>
        </header>

        {/* Main Content */}
        <div className="min-h-0 flex-1 overflow-hidden">{renderContent()}</div>

        {/* Bottom Navigation */}
        {showBottomNav && (
          <nav className="flex shrink-0 border-t border-ink-800 bg-ink-900/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm">
            <NavButton
              active={tab === 'calculator'}
              onClick={() => setTab('calculator')}
              label="Calculator"
              icon={<Calculator size={20} />}
            />
            <NavButton
              active={tab === 'today'}
              onClick={() => setTab('today')}
              label="Today"
              icon={<CalendarDays size={20} />}
            />
            <NavButton
              active={tab === 'history'}
              onClick={() => setTab('history')}
              label="History"
              icon={<History size={20} />}
            />
          </nav>
        )}
      </div>
    </div>
  );
}

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}

function NavButton({ active, onClick, label, icon }: NavButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 flex-col items-center gap-0.5 py-2 transition focus:outline-none ${
        active ? 'text-accent-400' : 'text-slate-600'
      }`}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}
