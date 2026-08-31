import { Copy, Pause, Play, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { serverApi } from "../api/servers";
import type { ConsoleLine } from "../types/panel";
import { ActionButton } from "./ActionButton";

export function Console({
  serverId,
  connected,
  incomingLine,
  initialLines
}: {
  serverId: string;
  connected: boolean;
  incomingLine?: ConsoleLine;
  initialLines: ConsoleLine[];
}) {
  const [lines, setLines] = useState(initialLines);
  const [command, setCommand] = useState("");
  const [paused, setPaused] = useState(false);
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => setLines(initialLines), [initialLines]);
  useEffect(() => {
    if (incomingLine) setLines((current) => [...current, incomingLine].slice(-350));
  }, [incomingLine]);
  useEffect(() => {
    if (!paused) logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [lines, paused]);

  const filtered = useMemo(
    () => (query ? lines.filter((line) => `${line.level} ${line.message}`.toLowerCase().includes(query.toLowerCase())) : lines),
    [lines, query]
  );

  async function sendCommand(event: React.FormEvent) {
    event.preventDefault();
    if (!command.trim()) return;
    await serverApi.command(serverId, command.trim().replace(/^\//, ""));
    setHistory((current) => [command.trim(), ...current].slice(0, 20));
    setCommand("");
  }

  return (
    <section className="overflow-hidden rounded-[8px] bg-black shadow-panel ring-1 ring-white/5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-panel-card px-4 py-3">
        <div>
          <h2 className="font-bold">Server Console</h2>
          <p className="text-xs text-panel-muted">{connected ? "Connected" : "Reconnecting"} to live server stream</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex h-9 items-center gap-2 rounded-[8px] bg-black/35 px-3 text-sm text-slate-300">
            <Search size={16} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-28 bg-transparent outline-none" placeholder="Search" />
          </label>
          <ActionButton title="Pause scrolling" variant="ghost" className="h-9 min-h-9 px-3" onClick={() => setPaused((value) => !value)}>
            {paused ? <Play size={16} /> : <Pause size={16} />}
          </ActionButton>
          <ActionButton title="Copy console" variant="ghost" className="h-9 min-h-9 px-3" onClick={() => navigator.clipboard.writeText(lines.map((line) => line.message).join("\n"))}>
            <Copy size={16} />
          </ActionButton>
          <ActionButton title="Clear console" variant="ghost" className="h-9 min-h-9 px-3" onClick={() => setLines([])}>
            <Trash2 size={16} />
          </ActionButton>
        </div>
      </div>
      <div ref={logRef} className="terminal-scrollbar h-[420px] overflow-auto px-5 py-4 font-mono text-sm leading-7 text-slate-300">
        {filtered.map((line) => (
          <p key={line.id} className={line.level === "ERROR" ? "text-red-300" : line.level === "WARN" ? "text-amber-300" : "text-slate-300"}>
            <span className="text-slate-500">[{new Date(line.at).toLocaleTimeString()}]</span> [Server thread/{line.level}]: {line.message}
          </p>
        ))}
      </div>
      <form onSubmit={sendCommand} className="flex items-center gap-3 border-t border-white/10 bg-panel-card px-4 py-3">
        <span className="font-mono text-panel-primary">&gt;</span>
        <input
          list="command-history"
          value={command}
          onChange={(event) => setCommand(event.target.value)}
          className="min-w-0 flex-1 bg-transparent font-mono text-sm text-slate-100 outline-none"
          placeholder="Type a command without the /"
        />
        <datalist id="command-history">{history.map((item) => <option key={item} value={item} />)}</datalist>
        <ActionButton variant="primary" className="min-h-9 px-4">Send</ActionButton>
      </form>
    </section>
  );
}
