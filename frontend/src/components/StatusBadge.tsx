import { clsx } from "clsx";
import type { ServerStatus } from "../types/panel";

export function StatusBadge({ status }: { status: ServerStatus }) {
  const active = status === "online";
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide",
        active ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-300" : "border-slate-500/25 bg-slate-500/10 text-slate-300"
      )}
    >
      <span className={clsx("h-2 w-2 rounded-full", active ? "bg-emerald-400 animate-pulse" : "bg-slate-500")} />
      {status}
    </span>
  );
}
