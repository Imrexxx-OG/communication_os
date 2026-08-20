import { Router } from "express";
import { prisma } from "../db";
import { putReflectionSchema } from "../lib/validate";
import { asyncHandler } from "../lib/asyncHandler";

export const reflectionsRouter = Router();

reflectionsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const all = await prisma.reflection.findMany();
    res.json(all);
  })
);

reflectionsRouter.put(
  "/:moduleNum",
  asyncHandler(async (req, res) => {
    const moduleNum = Number(req.params.moduleNum);
    if (!Number.isInteger(moduleNum) || moduleNum < 1 || moduleNum > 12) {
      return res.status(400).json({ error: "moduleNum must be 1-12" });
    }
    const parsed = putReflectionSchema.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({ error: "Invalid reflection", details: parsed.error.flatten() });

    const saved = await prisma.reflection.upsert({
      where: { moduleNum },
      update: { text: parsed.data.text },
      create: { moduleNum, text: parsed.data.text },
    });
    res.json(saved);
  })
);

// POST /api/reflections/:moduleNum/complete — mark a module complete
reflectionsRouter.post(
  "/:moduleNum/complete",
  asyncHandler(async (req, res) => {
    const moduleNum = Number(req.params.moduleNum);
    if (!Number.isInteger(moduleNum) || moduleNum < 1 || moduleNum > 12) {
      return res.status(400).json({ error: "moduleNum must be 1-12" });
    }
    const saved = await prisma.moduleCompletion.upsert({
      where: { moduleNum },
      update: {},
      create: { moduleNum },
    });
    res.json(saved);
  })
);

reflectionsRouter.get(
  "/completions",
  asyncHandler(async (_req, res) => {
    const all = await prisma.moduleCompletion.findMany();
    res.json(all);
  })
);
