import { useParams } from "react-router-dom";
import { ActionButton } from "../components/ActionButton";

const labels: Record<string, string[]> = {
  startup: ["Startup Command", "SERVER_JARFILE", "SERVER_MEMORY", "SERVER_PORT", "MINECRAFT_VERSION"],
  network: ["0.0.0.0:25565", "Primary allocation", "Add allocation", "Remove allocation"],
  settings: ["Server Name", "Timezone", "Auto-start", "Crash detection", "Danger Zone"],
  subusers: ["admin · Administrator", "moderator · Moderator", "developer · Developer"],
  plugins: ["EssentialsX", "LuckPerms", "CoreProtect", "Spark"],
  modpacks: ["Fabric", "Forge", "NeoForge", "Quilt"],
  helpdesk: ["Open Ticket", "Billing", "Technical Support", "Incident History"]
};

export function GenericPage({ admin = false }: { admin?: boolean }) {
  const { page = "overview" } = useParams();
  const title = page.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  const rows = labels[page] ?? ["Overview", "Configuration", "Activity", "Permissions"];

  return (
    <div className="mx-auto max-w-[1100px] space-y-5">
      <header>
        <p className="text-sm font-bold uppercase text-panel-primary">{admin ? "Admin" : "Server"}</p>
        <h1 className="text-3xl font-extrabold">{title}</h1>
      </header>
      <section className="grid gap-4 md:grid-cols-2">
        {rows.map((row) => (
          <article key={row} className="rounded-[8px] bg-panel-card p-5 shadow-panel">
            <h2 className="font-bold">{row}</h2>
            <p className="mt-2 text-sm text-slate-400">This surface is wired for provider-backed actions and granular permissions.</p>
            <ActionButton className="mt-4" variant={row.includes("Danger") ? "danger" : "secondary"}>{row.includes("Danger") ? "Require Confirmation" : "Manage"}</ActionButton>
          </article>
        ))}
      </section>
    </div>
  );
}
