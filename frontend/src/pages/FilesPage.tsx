import { Archive, Copy, Download, FilePlus, FolderPlus, Search, Trash2, Upload } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { serverApi } from "../api/servers";
import { ActionButton } from "../components/ActionButton";

export function FilesPage() {
  const { data = [] } = useQuery({ queryKey: ["files", "demo"], queryFn: () => serverApi.files("demo") });

  return (
    <div className="mx-auto max-w-[1280px] space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold">Files</h1>
          <p className="text-slate-400">/home/container</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ActionButton><Upload size={17} />Upload</ActionButton>
          <ActionButton><FolderPlus size={17} />Folder</ActionButton>
          <ActionButton><FilePlus size={17} />File</ActionButton>
        </div>
      </header>
      <label className="flex max-w-lg items-center gap-3 rounded-[8px] bg-panel-card px-4 py-3 text-slate-300">
        <Search size={18} />
        <input className="w-full bg-transparent outline-none" placeholder="Search files..." />
      </label>
      <section className="overflow-hidden rounded-[8px] bg-panel-card shadow-panel">
        <div className="hidden grid-cols-[1fr_140px_190px_120px] border-b border-white/10 px-5 py-3 text-xs font-bold uppercase text-slate-400 md:grid">
          <span>Name</span><span>Size</span><span>Modified</span><span>Perms</span>
        </div>
        {data.map((entry) => (
          <div key={entry.path} className="grid gap-2 border-b border-white/5 px-5 py-4 md:grid-cols-[1fr_140px_190px_120px]">
            <span className="font-bold">{entry.type === "folder" ? "📁" : "📄"} {entry.name}</span>
            <span className="text-slate-300">{entry.type === "folder" ? "-" : `${(entry.size / 1024).toFixed(1)} KiB`}</span>
            <span className="text-slate-300">{new Date(entry.modifiedAt).toLocaleString()}</span>
            <span className="text-slate-300">{entry.permissions}</span>
          </div>
        ))}
      </section>
      <section className="rounded-[8px] bg-panel-card p-5 shadow-panel">
        <h2 className="font-bold">File Editor</h2>
        <textarea className="mt-4 h-64 w-full resize-y rounded-[8px] border border-white/10 bg-black p-4 font-mono text-sm outline-none focus:border-panel-primary" defaultValue={"# Select a text file to edit JSON, YAML, properties, JavaScript, shell, TXT, or CFG files."} />
        <div className="mt-3 flex flex-wrap gap-2">
          <ActionButton variant="primary">Save</ActionButton>
          <ActionButton><Download size={17} />Download</ActionButton>
          <ActionButton><Copy size={17} />Copy</ActionButton>
          <ActionButton><Archive size={17} />Archive</ActionButton>
          <ActionButton variant="danger"><Trash2 size={17} />Delete</ActionButton>
        </div>
      </section>
    </div>
  );
}
