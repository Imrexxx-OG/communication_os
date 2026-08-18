import { z } from "zod";

// Same numeric ranges and string-length caps as validateState() in the
// original offline app — ported, not reinvented, so a 7/10 anxiety rating
// means the same thing everywhere this data has ever lived.

export const sessionPhaseSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(["done", "skip"]),
});

export const createSessionSchema = z.object({
  date: z.string().datetime().or(z.string().date()),
  type: z.literal("routine").default("routine"),
  phases: z.array(sessionPhaseSchema).default([]),
  completedCount: z.number().int().min(0).max(99),
  skippedCount: z.number().int().min(0).max(99),
  durationPlanned: z.number().int().min(0).max(100000),
  notes: z.string().max(2000).default(""),
});

export const createRungSchema = z.object({
  name: z.string().trim().min(1).max(300),
});

export const renameRungSchema = z.object({
  name: z.string().trim().min(1).max(300),
});

export const reorderLadderSchema = z.object({
  // full ordered list of rung ids, front-to-back — simplest possible
  // contract for "the user reordered the list"; the server just renumbers
  // `order` 0..n-1 to match, exactly like the original app's clean pass.
  orderedIds: z.array(z.string()).min(1),
});

export const createExposureLogSchema = z.object({
  date: z.string().datetime().or(z.string().date()),
  rungId: z.string(),
  target: z.string().max(500).default(""),
  predictedAnxiety: z.number().int().min(1).max(10),
  actualBefore: z.number().int().min(1).max(10),
  actualAfter: z.number().int().min(1).max(10),
  freezeCount: z.number().int().min(0).max(999),
  englishOnly: z.boolean().default(true),
  recovered: z.boolean().default(true),
  recoveryMethod: z.string().max(200).default(""),
  evidence: z.array(z.string().max(300)).max(50).default([]),
  notes: z.string().max(2000).default(""),
});

export const putReflectionSchema = z.object({
  text: z.string().max(8000),
});

export const putSettingsSchema = z.object({
  currentDay: z.number().int().min(1).max(100000).optional(),
  currentWeek: z.number().int().min(1).max(12).optional(),
  lastBackupAt: z.string().datetime().nullable().optional(),
});
