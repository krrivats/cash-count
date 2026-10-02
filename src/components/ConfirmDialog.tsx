import Modal from './Modal';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  danger = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <p className="mb-4 text-sm text-slate-400">{message}</p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl border border-ink-700 bg-ink-800 py-2.5 text-sm font-semibold text-slate-300 transition active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={`flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition active:scale-95 focus:outline-none focus-visible:ring-2 ${
            danger
              ? 'bg-red-500 focus-visible:ring-red-400'
              : 'bg-accent-500 focus-visible:ring-accent-400'
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
