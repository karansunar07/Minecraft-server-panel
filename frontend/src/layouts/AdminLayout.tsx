import { BarChart3, Database, HardDrive, List, MapPin, Server, Settings, Users } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const adminItems = [
  ["Overview", "/admin", BarChart3],
  ["Servers", "/admin/servers", Server],
  ["Users", "/admin/users", Users],
  ["Nodes", "/admin/nodes", HardDrive],
  ["Locations", "/admin/locations", MapPin],
  ["Allocations", "/admin/allocations", List],
  ["Databases", "/admin/databases", Database],
  ["Settings", "/admin/settings", Settings]
] as const;

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-panel-bg text-white lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-r border-white/5 bg-[#121212] p-6">
        <h1 className="text-xl font-black">EmberPanel Admin</h1>
        <nav className="mt-8 space-y-1">
          {adminItems.map(([label, to, Icon]) => (
            <NavLink key={to} to={to} end={to === "/admin"} className={({ isActive }) => `flex items-center gap-3 rounded-[8px] px-3 py-3 font-bold ${isActive ? "bg-panel-primary/20 ring-1 ring-panel-primary" : "hover:bg-white/5"}`}>
              <Icon size={20} />{label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="px-4 py-6 md:px-8 lg:px-10"><Outlet /></main>
    </div>
  );
}
