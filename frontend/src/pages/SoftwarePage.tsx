import { AlertTriangle, Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { serverApi } from "../api/servers";
import { ActionButton } from "../components/ActionButton";

export function SoftwarePage() {
  const [selectedSoftware, setSelectedSoftware] = useState("paper");
  const { data: software = [] } = useQuery({ queryKey: ["software"], queryFn: serverApi.software });
  const { data: versions = [], isFetching } = useQuery({
    queryKey: ["versions", selectedSoftware],
    queryFn: () => serverApi.versions(selectedSoftware)
  });

  return (
    <div className="mx-auto max-w-[1280px] space-y-6">
      <header>
        <h1 className="text-3xl font-extrabold">Software</h1>
        <p className="text-slate-400">Install current Minecraft releases through the backend provider.</p>
      </header>
      <section className="rounded-[8px] border border-amber-300/20 bg-amber-300/10 p-4 text-amber-100">
        <p className="flex items-center gap-2 font-bold"><AlertTriangle size={18} /> Changing server software may modify or replace server files.</p>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {software.map((item) => (
          <article key={item.id} className="rounded-[8px] bg-panel-card p-5 shadow-panel">
            <p className="text-xs font-bold uppercase text-panel-primary">{item.category}</p>
            <h2 className="mt-2 text-xl font-extrabold">{item.name}</h2>
            <p className="mt-2 min-h-12 text-sm text-slate-300">{item.description}</p>
            <div className="mt-4 grid gap-3">
              <select
                className="rounded-[8px] border border-white/10 bg-black px-3 py-2"
                onFocus={() => setSelectedSoftware(item.id)}
                onChange={() => setSelectedSoftware(item.id)}
              >
                {versions.map((version) => <option key={version}>{version}</option>)}
              </select>
              <select className="rounded-[8px] border border-white/10 bg-black px-3 py-2"><option>Latest build</option><option>Stable build</option></select>
              <ActionButton variant="primary" disabled={isFetching && selectedSoftware === item.id}>
                <Download size={17} />{isFetching && selectedSoftware === item.id ? "Loading versions" : "Install"}
              </ActionButton>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
