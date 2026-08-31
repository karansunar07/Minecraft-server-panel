import { ActionButton } from "./ActionButton";

export function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirm",
  open,
  onClose,
  onConfirm
}: {
  title: string;
  message: string;
  confirmLabel?: string;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <section className="w-full max-w-md rounded-[8px] border border-white/10 bg-panel-card p-6 shadow-panel">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <ActionButton variant="ghost" onClick={onClose}>Cancel</ActionButton>
          <ActionButton variant="danger" onClick={onConfirm}>{confirmLabel}</ActionButton>
        </div>
      </section>
    </div>
  );
}
