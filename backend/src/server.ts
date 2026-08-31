import "dotenv/config";
import http from "http";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { ZodError } from "zod";
import { createProvider } from "./providers/index.js";
import { createRoutes } from "./api/routes.js";
import { attachWebSockets } from "./websocket/serverEvents.js";

const app = express();
const provider = createProvider();

app.use(helmet());
app.use(cors({ origin: process.env.APP_URL ?? "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use("/api", createRoutes(provider));

const frontendDist = path.resolve(process.cwd(), "../frontend/dist");
app.use(express.static(frontendDist));
app.get("*", (request, response, next) => {
  if (request.path.startsWith("/api") || request.path.startsWith("/ws")) {
    next();
    return;
  }
  response.sendFile(path.join(frontendDist, "index.html"));
});

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  console.error(error);
  if (error instanceof ZodError) {
    response.status(400).json({ message: "Please check the request and try again." });
    return;
  }
  response.status(500).json({ message: "Unable to complete the request. Please retry." });
});

const server = http.createServer(app);
attachWebSockets(server, provider);

const port = Number(process.env.PORT ?? 4000);
server.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
