import type { HostingProvider } from "./HostingProvider.js";

export class PterodactylProvider implements HostingProvider {
  constructor(private readonly baseUrl: string, private readonly apiKey: string) {}

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        Accept: "application/json",
        "Content-Type": "application/json",
        ...init.headers
      }
    });
    if (!response.ok) throw new Error(`Pterodactyl request failed with ${response.status}`);
    return response.json() as Promise<T>;
  }

  async listServers(_userId = "") {
    const payload = await this.request<{ data: Array<{ attributes: any }> }>("/api/client");
    return payload.data.map(({ attributes }) => ({
      id: attributes.identifier,
      name: attributes.name,
      description: attributes.description ?? "",
      address: attributes.relationships?.allocations?.data?.[0]?.attributes?.alias ?? attributes.identifier,
      location: attributes.node ?? "Configured node",
      status: "offline" as const,
      uptimeSeconds: 0,
      software: "Unknown",
      minecraftVersion: "Unknown",
      build: "Unknown"
    }));
  }

  async getServer(serverId: string) {
    return (await this.listServers()).find((server) => server.id === serverId) ?? (await this.listServers())[0];
  }

  async power(serverId: string, signal: "start" | "restart" | "stop" | "kill") {
    await this.request(`/api/client/servers/${serverId}/power`, { method: "POST", body: JSON.stringify({ signal }) });
    return this.getServer(serverId);
  }

  async getStats() { return []; }
  async getConsole() { return []; }
  async sendCommand(serverId: string, command: string) {
    await this.request(`/api/client/servers/${serverId}/command`, { method: "POST", body: JSON.stringify({ command }) });
  }
  async listFiles() { return []; }
  async listBackups() { return []; }
  async createBackup(): Promise<never> { throw new Error("Backup creation endpoint must be configured for Pterodactyl."); }
  async listSoftware() { return []; }
  async listMarketplace() { return []; }
  async listVersions() { return []; }
  async installSoftware(): Promise<never> { throw new Error("Software installer must be configured for the target egg/provider."); }
}
