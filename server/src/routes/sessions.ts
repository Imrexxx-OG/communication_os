import { Router } from "express";
import { prisma } from "../db";
import { createSessionSchema } from "../lib/validate";

export const sessionsRouter = Router();

// GET /api/sessions?limit=50 — most recent first
sessionsRouter.get("/", async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 100, 500);
  const sessions = await prisma.session.findMany({
    orderBy: { date: "desc" },
    take: limit,
  });
  res.json(sessions);
});

// POST /api/sessions — log one completed (or partially completed) routine
sessionsRouter.post("/", async (req, res) => {
  const parsed = createSessionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid session payload", details: parsed.error.flatten() });
  }
  const data = parsed.data;
  const session = await prisma.session.create({
    data: {
      date: new Date(data.date),
      type: data.type,
      phases: data.phases,
      completedCount: data.completedCount,
      skippedCount: data.skippedCount,
      durationPlanned: data.durationPlanned,
      notes: data.notes,
    },
  });
  res.status(201).json(session);
});
