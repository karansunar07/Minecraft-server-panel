export type ServerStatus = "online" | "offline" | "starting" | "stopping" | "installing" | "reinstalling";

export interface Server {
  id: string;
  name: string;
  description: string;
  address: string;
  location: string;
  status: ServerStatus;
  uptimeSeconds: number;
  software: string;
  minecraftVersion: string;
  build: string;
}

export interface ServerStats {
  at: string;
  cpu: number;
  ramMiB: number;
  ramLimitMiB: number;
  diskMiB: number;
  diskLimitMiB: number;
  networkInKb: number;
  networkOutKb: number;
}

export interface ConsoleLine {
  id: string;
  at: string;
  level: "INFO" | "WARN" | "ERROR";
  message: string;
}

export interface FileEntry {
  name: string;
  path: string;
  type: "file" | "folder";
  size: number;
  modifiedAt: string;
  permissions: string;
}

export interface Backup {
  id: string;
  name: string;
  sizeBytes: number;
  createdAt: string;
}

export interface MarketplaceItem {
  id: string;
  name: string;
  category: string;
  description: string;
  compatible: string;
  installed?: boolean;
}
