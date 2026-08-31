import type { LucideIcon } from "lucide-react";

export function StatCard({ icon: Icon, label, value, hint }: { icon: LucideIcon; label: string; value: string; hint?: string }) {
  return (
    <article className="flex items-center gap-4 rounded-[8px] bg-panel-card p-5 shadow-panel">
      <div className="grid h-14 w-14 place-items-center rounded-[8px] bg-black/25 text-slate-100">
        <Icon size={27} />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-slate-300">{label}</p>
        <p className="truncate text-xl font-extrabold text-white">{value}</p>
        {hint ? <p className="text-xs text-panel-muted">{hint}</p> : null}
      </div>
    </article>
  );
}
