import { ShieldCheck } from "lucide-react";
import { ActionButton } from "../components/ActionButton";

export function AuthPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-panel-bg p-4">
      <section className="w-full max-w-md rounded-[8px] bg-panel-card p-8 shadow-panel">
        <ShieldCheck className="text-panel-primary" size={38} />
        <h1 className="mt-4 text-3xl font-extrabold">Sign in</h1>
        <div className="mt-6 space-y-4">
          <input className="w-full rounded-[8px] border border-white/10 bg-black px-4 py-3 outline-none focus:border-panel-primary" placeholder="Email" />
          <input className="w-full rounded-[8px] border border-white/10 bg-black px-4 py-3 outline-none focus:border-panel-primary" placeholder="Password" type="password" />
          <ActionButton className="w-full" variant="primary">Continue</ActionButton>
        </div>
      </section>
    </main>
  );
}
