import { Router } from "express";
import { prisma } from "../db";
import { createExposureLogSchema } from "../lib/validate";
import { asyncHandler } from "../lib/asyncHandler";

export const exposureLogsRouter = Router();

// GET /api/exposure-logs?rungId=...&limit=100
exposureLogsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const limit = Math.min(Number(req.query.limit) || 200, 1000);
    const where = req.query.rungId ? { rungId: String(req.query.rungId) } : {};
    const logs = await prisma.exposureLog.findMany({
      where,
      orderBy: { date: "desc" },
      take: limit,
      include: { rung: { select: { name: true } } },
    });
    res.json(logs);
  })
);

// DELETE /api/exposure-logs/:id — for exactly the situation where a form
// got submitted more than once (no loading/success state existed on the
// client before this was caught) and left duplicate rows behind.
exposureLogsRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    try {
      await prisma.exposureLog.delete({ where: { id: req.params.id } });
      res.status(204).end();
    } catch {
      res.status(404).json({ error: "Exposure log not found" });
    }
  })
);

// POST /api/exposure-logs — the rich structured log, exactly per the frozen spec
exposureLogsRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const parsed = createExposureLogSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid exposure log payload", details: parsed.error.flatten() });
    }
    const d = parsed.data;

    const rung = await prisma.ladderRung.findUnique({ where: { id: d.rungId } });
    if (!rung) return res.status(400).json({ error: "rungId does not match any ladder rung" });

    const log = await prisma.exposureLog.create({
      data: {
        date: new Date(d.date),
        rungId: d.rungId,
        target: d.target,
        predictedAnxiety: d.predictedAnxiety,
        actualBefore: d.actualBefore,
        actualAfter: d.actualAfter,
        difference: d.actualAfter - d.actualBefore, // computed server-side, never trusted from the client
        freezeCount: d.freezeCount,
        englishOnly: d.englishOnly,
        recovered: d.recovered,
        recoveryMethod: d.recoveryMethod,
        evidence: d.evidence,
        notes: d.notes,
      },
    });
    res.status(201).json(log);
  })
);
