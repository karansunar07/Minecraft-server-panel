import { Cpu, HardDrive, MapPin, MemoryStick, Pencil, Power, RotateCw, Wifi } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { serverApi } from "../api/servers";
import { ActionButton } from "../components/ActionButton";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { Console } from "../components/Console";
import { ResourceChart } from "../components/ResourceChart";
import { StatCard } from "../components/StatCard";
import { StatusBadge } from "../components/StatusBadge";
import { useServerSocket } from "../hooks/useServerSocket";

export function ServerDashboard() {
  const serverId = "demo";
  const queryClient = useQueryClient();
  const [range, setRange] = useState("5m");
  const [confirmStop, setConfirmStop] = useState(false);
  const server = useQuery({ queryKey: ["server", serverId], queryFn: () => serverApi.get(serverId) });
  const stats = useQuery({ queryKey: ["stats", serverId, range], queryFn: () => serverApi.resources(serverId, range) });
  const consoleLines = useQuery({ queryKey: ["console", serverId], queryFn: () => serverApi.console(serverId) });
  const socket = useServerSocket(serverId);

  const power = useMutation({
    mutationFn: (signal: "start" | "restart" | "stop") => serverApi.power(serverId, signal),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["server", serverId] })
  });

  const liveServer = socket.server ?? server.data;
  const liveStats = socket.stats ? [...(stats.data ?? []).slice(-59), socket.stats] : stats.data ?? [];

  return (
    <div className="mx-auto max-w-[1420px] space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-extrabold md:text-3xl">{liveServer?.name ?? "Server"}</h1>
            <Pencil size={16} className="text-slate-400" />
            {liveServer ? <StatusBadge status={liveServer.status} /> : null}
            <span className="inline-flex items-center gap-2 text-sm text-slate-200"><MapPin size={17} />{liveServer?.location}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <ActionButton variant="primary" onClick={() => power.mutate("start")}><Power size={17} />Start</ActionButton>
          <ActionButton onClick={() => power.mutate("restart")}><RotateCw size={17} />Restart</ActionButton>
          <ActionButton variant="danger" onClick={() => setConfirmStop(true)}>Stop</ActionButton>
        </div>
      </header>

      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <Console serverId={serverId} connected={socket.connected} incomingLine={socket.line} initialLines={consoleLines.data ?? []} />
        <div className="grid gap-4">
          <StatCard icon={Wifi} label="Address (click to copy)" value={liveServer?.address ?? ""} hint="Copied with one click" />
          <StatCard icon={Power} label="Uptime" value={liveServer?.status === "online" ? `${Math.floor((liveServer.uptimeSeconds ?? 0) / 60)} min` : "Offline"} />
          <StatCard icon={Cpu} label="CPU Usage" value={`${(liveStats.at(-1)?.cpu ?? 0).toFixed(0)}%`} />
          <StatCard icon={MemoryStick} label="RAM Usage" value={`${((liveStats.at(-1)?.ramMiB ?? 0) / 1024).toFixed(1)} GiB / ${((liveStats.at(-1)?.ramLimitMiB ?? 8192) / 1024).toFixed(0)} GiB`} />
          <StatCard icon={HardDrive} label="Storage Usage" value={`${(liveStats.at(-1)?.diskMiB ?? 0).toFixed(0)} MiB / ${((liveStats.at(-1)?.diskLimitMiB ?? 10240) / 1024).toFixed(0)} GiB`} />
        </div>
      </div>

      <section className="flex flex-wrap gap-2">
        {["1m", "5m", "15m", "1h"].map((item) => (
          <button key={item} onClick={() => setRange(item)} className={`rounded-[8px] px-3 py-2 text-sm font-bold ${range === item ? "bg-panel-primary text-white" : "bg-panel-card text-slate-300"}`}>{item}</button>
        ))}
      </section>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <ResourceChart title="CPU Usage" data={liveStats} valueKey="cpu" unit="%" limit="Limit 200%" />
        <ResourceChart title="RAM Usage" data={liveStats} valueKey="ramMiB" unit="MiB" limit="8192 MiB" />
        <ResourceChart title="Disk Usage" data={liveStats} valueKey="diskMiB" unit="MiB" limit="10240 MiB" />
        <ResourceChart title="Network In" data={liveStats} valueKey="networkInKb" unit=" KB/s" />
        <ResourceChart title="Network Out" data={liveStats} valueKey="networkOutKb" unit=" KB/s" />
      </div>

      <ConfirmDialog
        open={confirmStop}
        title="Stop server?"
        message="Stopping interrupts all active players. The backend will send the power signal and report failure if the provider rejects it."
        confirmLabel="Stop Server"
        onClose={() => setConfirmStop(false)}
        onConfirm={() => {
          power.mutate("stop");
          setConfirmStop(false);
        }}
      />
    </div>
  );
}
