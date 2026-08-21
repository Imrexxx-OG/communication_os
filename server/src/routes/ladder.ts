import { Router } from "express";
import { prisma } from "../db";
import { createRungSchema, renameRungSchema, reorderLadderSchema } from "../lib/validate";
import { buildRecommendations } from "../lib/recommend";
import { asyncHandler } from "../lib/asyncHandler";

export const ladderRouter = Router();

// GET /api/ladder — rungs in Display Order, each with a computed
// "current difficulty" (avg actualAfter of its most recent logs). Difficulty
// is computed on read, never stored — it can never go stale or drift from
// the actual log data, and reordering the display never has to touch it.
ladderRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const rungs = await prisma.ladderRung.findMany({ orderBy: { order: "asc" } });
    const logs = await prisma.exposureLog.findMany({
      select: { rungId: true, actualAfter: true, date: true },
    });

    const byRung = new Map<string, number[]>();
    for (const log of logs) {
      const arr = byRung.get(log.rungId) ?? [];
      arr.push(log.actualAfter);
      byRung.set(log.rungId, arr);
    }

    const enriched = rungs.map((r: { id: string; name: string; order: number; createdAt: Date }) => {
      const vals = byRung.get(r.id) ?? [];
      const currentDifficulty = vals.length
        ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10
        : null; // null = "no data yet", shown as such in the UI, never faked
      return { ...r, currentDifficulty, logCount: vals.length };
    });

    res.json(enriched);
  })
);

// GET /api/ladder/recommendations — advisory text only, see recommend.ts
ladderRouter.get(
  "/recommendations",
  asyncHandler(async (_req, res) => {
    const rungs = await prisma.ladderRung.findMany({ select: { id: true, name: true } });
    const logs = await prisma.exposureLog.findMany({
      select: { rungId: true, actualAfter: true, date: true },
    });
    res.json(buildRecommendations(rungs, logs));
  })
);

// POST /api/ladder — add a rung at the end of the Display Order
ladderRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const parsed = createRungSchema.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({ error: "Invalid rung", details: parsed.error.flatten() });

    const max = await prisma.ladderRung.aggregate({ _max: { order: true } });
    const nextOrder = (max._max.order ?? -1) + 1;
    const rung = await prisma.ladderRung.create({ data: { name: parsed.data.name, order: nextOrder } });
    res.status(201).json(rung);
  })
);

// PATCH /api/ladder/:id — rename
ladderRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const parsed = renameRungSchema.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({ error: "Invalid name", details: parsed.error.flatten() });
    try {
      const rung = await prisma.ladderRung.update({
        where: { id: req.params.id },
        data: { name: parsed.data.name },
      });
      res.json(rung);
    } catch {
      res.status(404).json({ error: "Rung not found" });
    }
  })
);

// DELETE /api/ladder/:id — refuses if exposure logs point at it, same
// spirit as onDelete: Restrict in the schema: never silently orphan real
// logged history because a rung got deleted.
ladderRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const logCount = await prisma.exposureLog.count({ where: { rungId: req.params.id } });
    if (logCount > 0) {
      return res.status(409).json({
        error: `This rung has ${logCount} logged exposure(s) attached. Rename it instead, or accept that deleting it isn't offered while history depends on it.`,
      });
    }
    try {
      await prisma.ladderRung.delete({ where: { id: req.params.id } });
      res.status(204).end();
    } catch {
      res.status(404).json({ error: "Rung not found" });
    }
  })
);

// PUT /api/ladder/reorder — the person drags/moves rungs in the UI, the
// client sends the full new id order, the server renumbers 0..n-1 to match.
// This is the ONLY route that changes `order` — nothing else in the server
// ever touches it, which is what keeps Display Order "manual and stable."
//
// Deadlock safety: if two reorder requests overlap, each one updates the
// same rows. Postgres deadlocks when two transactions lock the same rows
// in a *different* order. To make that impossible, this always acquires
// row locks in a fixed order (ascending id) regardless of what order the
// client wants the rungs displayed in -- the *values* being written still
// reflect the client's requested order, only the *lock order* is pinned.
// The updates run as Prisma's batch transaction form (all statements sent
// together, one round trip) rather than a step-by-step interactive
// transaction. Interactive transactions need to hold one specific DB
// connection open across several round trips, which breaks on a pooled
// connection like Supabase's PgBouncer -- the pooler can swap the
// underlying connection between statements, orphaning the transaction
// (Prisma error P2028, "Transaction not found"). The batch form sends
// everything as one request, which poolers handle safely, while the
// sorted id order below still guarantees consistent lock ordering across
// concurrent requests -- that's what actually prevents the deadlock.
ladderRouter.put(
  "/reorder",
  asyncHandler(async (req, res) => {
    const parsed = reorderLadderSchema.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({ error: "Invalid reorder payload", details: parsed.error.flatten() });

    const { orderedIds } = parsed.data;

    // Confirm orderedIds is exactly the current set of rungs -- no ids
    // that don't exist, and none missing. A partial or stale list would
    // otherwise leave the rungs it omits with a leftover `order` value,
    // silently producing duplicate/inconsistent ordering.
    const currentRungs = await prisma.ladderRung.findMany({ select: { id: true } });
    const currentIds = new Set(currentRungs.map((r) => r.id));
    const requestedIds = new Set(orderedIds);
    const missing = [...currentIds].filter((id) => !requestedIds.has(id));
    const unexpected = [...requestedIds].filter((id) => !currentIds.has(id));
    if (missing.length || unexpected.length) {
      return res.status(400).json({
        error: "orderedIds must include every current rung exactly once, and no others.",
        details: { missing, unexpected },
      });
    }

    const newOrderById = new Map(orderedIds.map((id, index) => [id, index]));
    const idsInLockOrder = [...orderedIds].sort(); // fixed order, same for every concurrent request

    try {
      await prisma.$transaction(
        idsInLockOrder.map((id) =>
          prisma.ladderRung.update({ where: { id }, data: { order: newOrderById.get(id)! } })
        )
      );
    } catch (e: any) {
      console.error("Reorder failed:", e?.message ?? e);
      return res.status(409).json({ error: "Couldn't save the new order \u2014 please try again." });
    }

    const rungs = await prisma.ladderRung.findMany({ orderBy: { order: "asc" } });
    res.json(rungs);
  })
);
