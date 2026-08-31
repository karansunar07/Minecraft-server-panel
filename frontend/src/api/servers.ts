import { api } from "./client";
import type { Backup, ConsoleLine, FileEntry, MarketplaceItem, Server, ServerStats } from "../types/panel";

export const serverApi = {
  list: () => api<Server[]>("/api/servers"),
  get: (id: string) => api<Server>(`/api/servers/${id}`),
  resources: (id: string, range = "5m") => api<ServerStats[]>(`/api/servers/${id}/resources?range=${range}`),
  console: (id: string) => api<ConsoleLine[]>(`/api/servers/${id}/console`),
  power: (id: string, signal: "start" | "restart" | "stop" | "kill") =>
    api<{ server: Server }>(`/api/servers/${id}/power`, { method: "POST", body: JSON.stringify({ signal }) }),
  command: (id: string, command: string) =>
    api<{ accepted: true }>(`/api/servers/${id}/console/commands`, { method: "POST", body: JSON.stringify({ command }) }),
  files: (id: string, path = "/home/container") => api<FileEntry[]>(`/api/servers/${id}/files?path=${encodeURIComponent(path)}`),
  backups: (id: string) => api<Backup[]>(`/api/servers/${id}/backups`),
  createBackup: (id: string) => api<Backup>(`/api/servers/${id}/backups`, { method: "POST" }),
  software: () => api<MarketplaceItem[]>("/api/software"),
  marketplace: () => api<MarketplaceItem[]>("/api/marketplace"),
  versions: (software = "paper") => api<string[]>(`/api/versions?software=${software}`)
};
