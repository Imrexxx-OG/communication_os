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
// stack trace to the client.
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => {
  console.log(`Communication OS API listening on http://localhost:${PORT}`);
});
