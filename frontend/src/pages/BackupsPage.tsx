import { Download, RotateCcw, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { serverApi } from "../api/servers";
import { ActionButton } from "../components/ActionButton";

export function BackupsPage() {
  const queryClient = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["backups", "demo"], queryFn: () => serverApi.backups("demo") });
  const create = useMutation({ mutationFn: () => serverApi.createBackup("demo"), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["backups", "demo"] }) });
  return (
    <div className="mx-auto max-w-[1000px] space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold">Backups</h1>
          <p className="text-slate-400">Automatic backups are configured by policy and audited server-side.</p>
        </div>
        <ActionButton variant="primary" onClick={() => create.mutate()}>Create Backup</ActionButton>
      </header>
      <section className="space-y-3">
        {data.map((backup) => (
          <article key={backup.id} className="flex flex-wrap items-center justify-between gap-4 rounded-[8px] bg-panel-card p-5 shadow-panel">
            <div>
              <h2 className="font-bold">{backup.name}</h2>
              <p className="text-sm text-slate-400">{(backup.sizeBytes / 1024 / 1024 / 1024).toFixed(2)} GB · {new Date(backup.createdAt).toLocaleString()}</p>
            </div>
            <div className="flex gap-2">
              <ActionButton><RotateCcw size={17} />Restore</ActionButton>
              <ActionButton><Download size={17} />Download</ActionButton>
              <ActionButton variant="danger"><Trash2 size={17} />Delete</ActionButton>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
