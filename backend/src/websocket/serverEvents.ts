import type { Server } from "http";
import { WebSocketServer } from "ws";
import type { MockProvider } from "../providers/MockProvider.js";

export function attachWebSockets(server: Server, provider: unknown) {
  const wss = new WebSocketServer({ server, path: "/ws/servers/demo" });
  wss.on("connection", (socket) => {
    socket.send(JSON.stringify({ type: "server", data: (provider as MockProvider).getLivePacket?.().server }));
  });

  setInterval(() => {
    const packet = (provider as MockProvider).getLivePacket?.();
    if (!packet) return;
    for (const client of wss.clients) {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify({ type: "server", data: packet.server }));
        client.send(JSON.stringify({ type: "stats", data: packet.stats }));
        if (packet.line) client.send(JSON.stringify({ type: "line", data: packet.line }));
      }
    }
  }, 3000);
}
