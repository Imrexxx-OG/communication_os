import { z } from "zod";

// Same numeric ranges and string-length caps as validateState() in the
// original offline app — ported, not reinvented, so a 7/10 anxiety rating
// means the same thing everywhere this data has ever lived.
//
// One correction made here: predictedAnxiety/actualBefore/actualAfter were
// previously min(1), but the ladder UI's number inputs allow 0 (a genuine,
// meaningful reading on the standard 0-10 anxiety scale -- "felt nothing"
// is real data). min(1) silently rejected every 0 rating with a generic
// 400. Changed to min(0) to match what the frontend actually allows.

export const sessionPhaseSchema = z.object({
  id: z.string().trim().min(1).max(100),
  name: z.string().trim().min(1).max(200),
  status: z.enum(["done", "skip"]),
});

export const createSessionSchema = z.object({
  date: z.string().datetime().or(z.string().date()),
  type: z.literal("routine").default("routine"),
  phases: z.array(sessionPhaseSchema).max(50).default([]),
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
  // Duplicate-id rejection happens here; whether the set of ids actually
  // matches every current rung (no missing, none unexpected) is checked
  // in the route itself, since that requires a database read.
  orderedIds: z
    .array(z.string())
    .min(1)
    .max(500)
    .refine((ids) => new Set(ids).size === ids.length, {
      message: "orderedIds must not contain duplicate ids",
    }),
});

export const createExposureLogSchema = z.object({
  date: z.string().datetime().or(z.string().date()),
  rungId: z.string(),
  target: z.string().max(500).default(""),
  predictedAnxiety: z.number().int().min(0).max(10),
  actualBefore: z.number().int().min(0).max(10),
  actualAfter: z.number().int().min(0).max(10),
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
