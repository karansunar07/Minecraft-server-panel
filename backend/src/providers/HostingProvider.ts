import type { Backup, ConsoleLine, FileEntry, MarketplaceItem, Server, ServerStats } from "../types.js";

export interface HostingProvider {
  listServers(userId: string): Promise<Server[]>;
  getServer(serverId: string): Promise<Server>;
  power(serverId: string, signal: "start" | "restart" | "stop" | "kill"): Promise<Server>;
  getStats(serverId: string, range: string): Promise<ServerStats[]>;
  getConsole(serverId: string): Promise<ConsoleLine[]>;
  sendCommand(serverId: string, command: string): Promise<void>;
  listFiles(serverId: string, path: string): Promise<FileEntry[]>;
  listBackups(serverId: string): Promise<Backup[]>;
  createBackup(serverId: string): Promise<Backup>;
  listSoftware(): Promise<MarketplaceItem[]>;
  listMarketplace(): Promise<MarketplaceItem[]>;
  listVersions(software: string): Promise<string[]>;
  installSoftware(serverId: string, software: string, version: string, build: string): Promise<Server>;
}
