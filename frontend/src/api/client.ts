const API_URL = import.meta.env.VITE_API_URL ?? "";

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({ message: "Request failed" }));
    throw new ApiError(payload.message ?? "Request failed", response.status);
  }

  return response.json() as Promise<T>;
}

export function wsUrl(serverId: string) {
  const base = import.meta.env.VITE_WS_URL ?? window.location.origin.replace(/^http/, "ws");
  return `${base}/ws/servers/${serverId}`;
}
