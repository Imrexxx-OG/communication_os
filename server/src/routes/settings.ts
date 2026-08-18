import { Router } from "express";
import { prisma } from "../db";
import { putSettingsSchema } from "../lib/validate";

export const settingsRouter = Router();

async function getOrCreateSettings() {
  return prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });
}

settingsRouter.get("/", async (_req, res) => {
  res.json(await getOrCreateSettings());
});

settingsRouter.put("/", async (req, res) => {
  const parsed = putSettingsSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid settings", details: parsed.error.flatten() });

  await getOrCreateSettings();
  const updated = await prisma.settings.update({
    where: { id: 1 },
    data: {
      ...(parsed.data.currentDay !== undefined && { currentDay: parsed.data.currentDay }),
      ...(parsed.data.currentWeek !== undefined && { currentWeek: parsed.data.currentWeek }),
      ...(parsed.data.lastBackupAt !== undefined && {
        lastBackupAt: parsed.data.lastBackupAt ? new Date(parsed.data.lastBackupAt) : null,
      }),
    },
  });
  res.json(updated);
});
