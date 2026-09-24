import type { HostingProvider } from "./HostingProvider.js";
import type { Backup, ConsoleLine, FileEntry, MarketplaceItem, Server, ServerStats } from "../types.js";
import { listMinecraftVersions } from "../services/minecraftVersions.js";

const now = () => new Date().toISOString();

export class MockProvider implements HostingProvider {
  private server: Server = {
    id: "demo",
    name: "Play Hosting Server",
    description: "Development provider server",
    address: "karansunar.play.hosting",
    location: "🇳🇵 Kathmandu, Nepal",
    status: "offline",
    uptimeSeconds: 0,
    software: "Paper",
    minecraftVersion: "1.21.8",
    build: "103"
  };

  private consoleLines: ConsoleLine[] = [
    { id: "1", at: now(), level: "INFO", message: "Development provider attached. Configure PROVIDER=pterodactyl for production." },
    { id: "2", at: now(), level: "INFO", message: "Awaiting power action." }
  ];

  async listServers() {
    return [this.server];
  }

  async getServer() {
    return this.server;
  }

  async power(_: string, signal: "start" | "restart" | "stop" | "kill") {
    if (signal === "start") {
      this.server = { ...this.server, status: "online", uptimeSeconds: 60 };
      this.push("INFO", "Server marked online by development provider.");
    }
    if (signal === "restart") {
      this.server = { ...this.server, status: "starting", uptimeSeconds: 0 };
      this.push("WARN", "Restart signal accepted. Waiting for server process.");
      setTimeout(() => {
        this.server = { ...this.server, status: "online", uptimeSeconds: 10 };
        this.push("INFO", "Server process is online.");
      }, 1500);
    }
    if (signal === "stop" || signal === "kill") {
      this.server = { ...this.server, status: "offline", uptimeSeconds: 0 };
      this.push(signal === "kill" ? "ERROR" : "WARN", `${signal.toUpperCase()} signal accepted.`);
    }
    return this.server;
  }

  async getStats(_: string, range: string) {
    const length = range === "1h" ? 60 : range === "15m" ? 45 : range === "1m" ? 18 : 30;
    return Array.from({ length }, (_, index) => this.sampleStats(index - length));
  }

  async getConsole() {
    return this.consoleLines;
  }

  async sendCommand(_: string, command: string) {
    this.push("INFO", `Command sent: /${command}`);
  }

  async listFiles() {
    return [
      this.file("plugins", "folder", 0),
      this.file("world", "folder", 0),
      this.file("logs", "folder", 0),
      this.file("config", "folder", 0),
      this.file("server.properties", "file", 2948),
      this.file("eula.txt", "file", 32),
      this.file("server.jar", "file", 48192000)
    ];
  }

  async listBackups() {
    return [
      { id: "world", name: "World Backup", sizeBytes: 2.4 * 1024 ** 3, createdAt: now() },
      { id: "server", name: "Server Backup", sizeBytes: 1.8 * 1024 ** 3, createdAt: new Date(Date.now() - 86400000).toISOString() }
    ];
  }

  async createBackup() {
    const backup: Backup = { id: crypto.randomUUID(), name: "Manual Backup", sizeBytes: 1.2 * 1024 ** 3, createdAt: now() };
    this.push("INFO", "Backup created by development provider.");
    return backup;
  }

  async listSoftware() {
    return [
      "Vanilla", "Paper", "Purpur", "Spigot", "Fabric", "Forge", "NeoForge", "Quilt", "Folia", "Velocity", "Waterfall", "BungeeCord", "Bedrock"
    ].map((name) => ({ id: name.toLowerCase(), name, category: "Server Software", description: `${name} Minecraft server runtime`, compatible: "1.21.x" }));
  }

  async listMarketplace() {
    const items: MarketplaceItem[] = [
      ["essentialsx", "EssentialsX", "Plugins", "Essential commands and features"],
      ["luckperms", "LuckPerms", "Plugins", "Granular permission management"],
      ["spark", "Spark", "Optimization", "Performance profiler"],
      ["fabricpack", "Fabric Adventure Pack", "Modpacks", "Fabric survival pack"]
    ].map(([id, name, category, description]) => ({ id, name, category, description, compatible: "1.21.x" }));
    return items;
  }

  async listVersions(software: string) {
    return listMinecraftVersions(software);
  }

  async installSoftware(_: string, software: string, version: string, build: string) {
    this.server = { ...this.server, software, minecraftVersion: version, build, status: "installing" };
    this.push("WARN", `Installing ${software} ${version} build ${build}.`);
    return this.server;
  }

  getLivePacket() {
    if (this.server.status === "online") this.server.uptimeSeconds += 3;
    if (Math.random() > 0.7) this.push("INFO", `Player sample tick ${Math.floor(Math.random() * 9999)} completed.`);
    return {
      server: this.server,
      stats: this.sampleStats(0),
      line: this.consoleLines.at(-1)
    };
  }

  private sampleStats(offset: number): ServerStats {
    const online = this.server.status === "online";
    const phase = Date.now() / 12000 + offset;
    return {
      at: new Date(Date.now() + offset * 3000).toISOString(),
      cpu: online ? Math.max(8, 38 + Math.sin(phase) * 21 + Math.random() * 8) : 0,
      ramMiB: online ? 2800 + Math.cos(phase) * 420 + Math.random() * 160 : 0,
      ramLimitMiB: 8192,
      diskMiB: 265 + Math.random() * 15,
      diskLimitMiB: 10240,
      networkInKb: online ? 80 + Math.random() * 45 : 0,
      networkOutKb: online ? 60 + Math.random() * 40 : 0
    };
  }

  private file(name: string, type: "file" | "folder", size: number): FileEntry {
    return { name, type, size, path: `/home/container/${name}`, modifiedAt: now(), permissions: type === "folder" ? "drwxr-xr-x" : "-rw-r--r--" };
  }

  private push(level: ConsoleLine["level"], message: string) {
    this.consoleLines.push({ id: crypto.randomUUID(), at: now(), level, message });
    this.consoleLines = this.consoleLines.slice(-350);
  }
}
