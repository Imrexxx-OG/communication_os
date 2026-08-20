import "dotenv/config";
import express from "express";
import cors from "cors";
import { sessionsRouter } from "./routes/sessions";
import { ladderRouter } from "./routes/ladder";
import { exposureLogsRouter } from "./routes/exposureLogs";
import { reflectionsRouter } from "./routes/reflections";
import { settingsRouter } from "./routes/settings";
import { dashboardRouter } from "./routes/dashboard";
import { contentRouter } from "./routes/content";

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? "http://localhost:3000" }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/sessions", sessionsRouter);
app.use("/api/ladder", ladderRouter);
app.use("/api/exposure-logs", exposureLogsRouter);
app.use("/api/reflections", reflectionsRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/content", contentRouter);

// Centralized error handler — anything that throws (bad JSON body, Prisma
// errors, etc.) lands here instead of crashing the process or leaking a
// stack trace to the client. This only ever gets reached for routes that
// forward their errors to next(err) -- see lib/asyncHandler.ts, which is
// what makes that actually happen for async routes.
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => {
  console.log(`Communication OS API listening on http://localhost:${PORT}`);
});

// Safety net: asyncHandler is the real fix for every route wrapped with
// it, but this catches anything from a route that isn't wrapped yet, or a
// truly unexpected error anywhere else in the process. Without this,
// Node 15+ kills the entire server on an unhandled promise rejection --
// which is exactly what happened before. This logs the error and keeps
// the server running instead of taking every page down with it.
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection (server stayed up):", reason);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception (server stayed up):", err);
});
