import { Search, SlidersHorizontal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { serverApi } from "../api/servers";
import { ActionButton } from "../components/ActionButton";

export function MarketplacePage() {
  const { data = [] } = useQuery({ queryKey: ["marketplace"], queryFn: serverApi.marketplace });
  return (
    <div className="mx-auto max-w-[1280px] space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold">Marketplace</h1>
          <p className="text-slate-400">Plugins, mods, modpacks, software, and templates.</p>
        </div>
        <ActionButton><SlidersHorizontal size={17} />Filters</ActionButton>
      </header>
      <label className="flex max-w-xl items-center gap-3 rounded-[8px] bg-panel-card px-4 py-3">
        <Search size={18} className="text-slate-400" />
        <input className="w-full bg-transparent outline-none" placeholder="Search marketplace..." />
      </label>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.map((item) => (
          <article key={item.id} className="rounded-[8px] bg-panel-card p-5 shadow-panel">
            <p className="text-xs font-bold uppercase text-panel-primary">{item.category}</p>
            <h2 className="mt-2 text-lg font-extrabold">{item.name}</h2>
            <p className="mt-2 min-h-16 text-sm text-slate-300">{item.description}</p>
            <p className="mb-4 text-xs text-slate-400">Compatible: {item.compatible}</p>
            <ActionButton variant={item.installed ? "secondary" : "primary"}>{item.installed ? "Update" : "Install"}</ActionButton>
          </article>
        ))}
      </section>
    </div>
  );
}
