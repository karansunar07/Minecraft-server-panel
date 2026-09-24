# API Contracts

All frontend actions go through the backend. The backend then calls a `HostingProvider` implementation.

- `GET /api/servers`
- `GET /api/servers/:id`
- `POST /api/servers/:id/power` with `{ "signal": "start" | "restart" | "stop" | "kill" }`
- `GET /api/servers/:id/resources?range=1m|5m|15m|1h`
- `GET /api/servers/:id/console`
- `POST /api/servers/:id/console/commands` with `{ "command": "say hello" }`
- `GET /api/servers/:id/files?path=/home/container`
- `GET /api/servers/:id/backups`
- `POST /api/servers/:id/backups`
- `GET /api/software`
- `GET /api/marketplace`
- `GET /api/versions?software=paper`
- `GET /api/admin/overview`

The version endpoint resolves current releases from provider APIs instead of relying on a permanent hardcoded Minecraft list. Paper-family projects use PaperMC APIs, Purpur uses the Purpur API, and other server types fall back to Mojang's version manifest. A short-lived fallback list is used only when the upstream provider is unavailable.

The development provider returns mock server resources by design. Set `PROVIDER=pterodactyl` with `PTERODACTYL_URL` and `PTERODACTYL_API_KEY` to use the Pterodactyl-compatible provider stub.
