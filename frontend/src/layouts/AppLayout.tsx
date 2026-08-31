import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-panel-bg text-white lg:grid lg:grid-cols-[288px_1fr]">
      <Sidebar />
      <main className="min-w-0 px-4 py-5 md:px-8 lg:px-10">
        <Outlet />
      </main>
    </div>
  );
}
