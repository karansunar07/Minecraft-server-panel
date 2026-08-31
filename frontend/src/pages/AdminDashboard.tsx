import { Cpu, Database, HardDrive, Server, Users } from "lucide-react";
import { ResourceChart } from "../components/ResourceChart";
import { StatCard } from "../components/StatCard";

const data = Array.from({ length: 24 }, (_, index) => ({
  at: `${index}`,
  cpu: 30 + Math.sin(index / 2) * 15,
  ramMiB: 4096 + Math.cos(index / 3) * 900,
  ramLimitMiB: 16384,
  diskMiB: 3200 + index * 80,
  diskLimitMiB: 100000,
  networkInKb: 90 + index * 4,
  networkOutKb: 70 + index * 3
}));

export function AdminDashboard() {
  return (
    <div className="mx-auto max-w-[1280px] space-y-6">
      <header>
        <h1 className="text-3xl font-extrabold">Admin Overview</h1>
        <p className="text-slate-400">Fleet health, nodes, users, and recent activity.</p>
      </header>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard icon={Users} label="Total Users" value="128" />
        <StatCard icon={Server} label="Active Servers" value="42" />
        <StatCard icon={Database} label="Online Servers" value="31" />
        <StatCard icon={HardDrive} label="Nodes" value="6" />
        <StatCard icon={Cpu} label="CPU Usage" value="57%" />
      </section>
      <section className="grid gap-5 xl:grid-cols-2">
        <ResourceChart title="CPU Usage" data={data} valueKey="cpu" unit="%" />
        <ResourceChart title="Memory Usage" data={data} valueKey="ramMiB" unit="MiB" />
      </section>
      <section className="rounded-[8px] bg-panel-card p-5 shadow-panel">
        <h2 className="font-bold">Recent Activity</h2>
        {["User created server", "Server started", "Backup created", "Software changed", "User logged in"].map((item) => (
          <p key={item} className="border-b border-white/5 py-3 text-slate-300">{item}</p>
        ))}
      </section>
    </div>
  );
}
