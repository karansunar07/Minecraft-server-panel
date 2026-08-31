import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ServerStats } from "../types/panel";

export function ResourceChart({
  title,
  data,
  valueKey,
  unit,
  limit
}: {
  title: string;
  data: ServerStats[];
  valueKey: keyof ServerStats;
  unit: string;
  limit?: string;
}) {
  const values = data.map((point) => Number(point[valueKey]));
  const current = values.at(-1) ?? 0;
  const max = values.length ? Math.max(...values) : 0;
  const avg = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;

  return (
    <section className="rounded-[8px] bg-panel-card p-5 shadow-panel">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-200">{title}</h3>
          <p className="text-xs text-panel-muted">Current {current.toFixed(1)}{unit} · Max {max.toFixed(1)}{unit} · Avg {avg.toFixed(1)}{unit}</p>
        </div>
        {limit ? <span className="rounded bg-black/25 px-2 py-1 text-xs text-slate-300">{limit}</span> : null}
      </div>
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <XAxis dataKey="at" hide />
            <YAxis hide />
            <Tooltip contentStyle={{ background: "#111", border: "1px solid #333", color: "#fff" }} />
            <Area type="monotone" dataKey={valueKey as string} stroke="#d4a017" fill="#d4a017" fillOpacity={0.16} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
