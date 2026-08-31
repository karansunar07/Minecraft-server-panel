import { Router } from "express";
import { z } from "zod";
import type { HostingProvider } from "../providers/HostingProvider.js";
import { requirePermission, requireUser } from "../auth/session.js";

export function createRoutes(provider: HostingProvider) {
  const router = Router();
  router.use(requireUser);

  router.get("/servers", async (_request, response, next) => {
    try { response.json(await provider.listServers(response.locals.user.id)); } catch (error) { next(error); }
  });
  router.get("/servers/:id", async (request, response, next) => {
    try { response.json(await provider.getServer(String(request.params.id))); } catch (error) { next(error); }
  });
  router.post("/servers/:id/power", requirePermission("console.power"), async (request, response, next) => {
    try {
      const { signal } = z.object({ signal: z.enum(["start", "restart", "stop", "kill"]) }).parse(request.body);
      response.json({ server: await provider.power(String(request.params.id), signal) });
    } catch (error) { next(error); }
  });
  router.get("/servers/:id/resources", async (request, response, next) => {
    try { response.json(await provider.getStats(String(request.params.id), String(request.query.range ?? "5m"))); } catch (error) { next(error); }
  });
  router.get("/servers/:id/console", async (request, response, next) => {
    try { response.json(await provider.getConsole(String(request.params.id))); } catch (error) { next(error); }
  });
  router.post("/servers/:id/console/commands", requirePermission("console.command"), async (request, response, next) => {
    try {
      const { command } = z.object({ command: z.string().min(1).max(200) }).parse(request.body);
      await provider.sendCommand(String(request.params.id), command);
      response.json({ accepted: true });
    } catch (error) { next(error); }
  });
  router.get("/servers/:id/files", requirePermission("files.read"), async (request, response, next) => {
    try { response.json(await provider.listFiles(String(request.params.id), String(request.query.path ?? "/home/container"))); } catch (error) { next(error); }
  });
  router.get("/servers/:id/backups", requirePermission("backups.read"), async (request, response, next) => {
    try { response.json(await provider.listBackups(String(request.params.id))); } catch (error) { next(error); }
  });
  router.post("/servers/:id/backups", requirePermission("backups.create"), async (request, response, next) => {
    try { response.json(await provider.createBackup(String(request.params.id))); } catch (error) { next(error); }
  });
  router.get("/software", async (_request, response, next) => {
    try { response.json(await provider.listSoftware()); } catch (error) { next(error); }
  });
  router.get("/marketplace", async (_request, response, next) => {
    try { response.json(await provider.listMarketplace()); } catch (error) { next(error); }
  });
  router.get("/versions", async (request, response, next) => {
    try { response.json(await provider.listVersions(String(request.query.software ?? "paper"))); } catch (error) { next(error); }
  });

  router.get("/admin/overview", requirePermission("admin.view"), (_request, response) => {
    response.json({ users: 128, activeServers: 42, onlineServers: 31, nodes: 6 });
  });

  return router;
}
