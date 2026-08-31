import { useEffect, useState } from "react";
import { wsUrl } from "../api/client";
import type { ConsoleLine, Server, ServerStats } from "../types/panel";

type SocketState = {
  connected: boolean;
  stats?: ServerStats;
  line?: ConsoleLine;
  server?: Server;
};

export function useServerSocket(serverId: string) {
  const [state, setState] = useState<SocketState>({ connected: false });

  useEffect(() => {
    const socket = new WebSocket(wsUrl(serverId));
    socket.addEventListener("open", () => setState((current) => ({ ...current, connected: true })));
    socket.addEventListener("close", () => setState((current) => ({ ...current, connected: false })));
    socket.addEventListener("message", (event) => {
      const payload = JSON.parse(event.data);
      setState((current) => ({ ...current, [payload.type]: payload.data }));
    });
    return () => socket.close();
  }, [serverId]);

  return state;
}
