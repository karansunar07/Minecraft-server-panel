import { Archive, Box, Cloud, Code2, Database, Folder, Gamepad2, HelpCircle, LogOut, Network, Plug, Search, Settings, SlidersHorizontal, Terminal, UserCircle, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

const groups = [
  { title: "YOUR SERVER", items: [["Console", "console", Terminal], ["Files", "files", Folder], ["Marketplace", "marketplace", Gamepad2], ["Helpdesk", "helpdesk", HelpCircle], ["Subusers", "subusers", Users], ["Backups", "backups", Archive]] },
  { title: "TOOLS", items: [["Software", "software", Code2], ["Plugins", "plugins", Plug], ["Modpacks", "modpacks", Box]] },
  { title: "CONFIG", items: [["Network", "network", Network], ["Startup", "startup", SlidersHorizontal], ["Settings", "settings", Settings]] }
] as const;

export function Sidebar() {
  return (
    <aside className="sticky top-0 z-20 flex max-h-screen flex-col border-r border-white/5 bg-[#121212] px-7 py-5 max-lg:relative max-lg:max-h-none">
      <div className="flex items-center gap-3 text-2xl font-black">
        <Cloud className="text-panel-primary" size={31} />
        EmberPanel
      </div>
      <div className="mt-8">
        <p className="text-xs font-bold uppercase text-slate-400">You’re managing</p>
        <p className="mt-2 text-sm font-bold">Play Hosting Server</p>
      </div>
      <nav className="mt-9 space-y-8">
        {groups.map((group) => (
          <section key={group.title}>
            <h2 className="mb-3 text-sm font-extrabold">{group.title}</h2>
            <div className="space-y-1">
              {group.items.map(([label, page, Icon]) => (
                <NavLink
                  key={page}
                  to={`/servers/demo/${page}`}
                  className={({ isActive }) =>
                    `flex items-center gap-4 rounded-[8px] px-3 py-3 text-base font-bold transition ${isActive ? "bg-panel-primary/20 text-white ring-1 ring-panel-primary" : "text-slate-100 hover:bg-white/5"}`
                  }
                >
                  <Icon size={23} />
                  {label}
                </NavLink>
              ))}
            </div>
          </section>
        ))}
      </nav>
      <div className="mt-auto pt-8">
        <div className="rounded-[8px] bg-black/25 p-4">
          <p className="font-bold">Need premium capacity?</p>
          <p className="mt-1 text-sm text-slate-300">Connect a dedicated node from admin settings.</p>
        </div>
        <div className="mt-5 flex justify-between text-slate-200">
          <Search />
          <UserCircle />
          <LogOut />
        </div>
      </div>
    </aside>
  );
}
