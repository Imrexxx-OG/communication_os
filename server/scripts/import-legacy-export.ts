// Imports a JSON file exported from the offline HTML app's Settings →
// Export JSON button. Run with: npx tsx scripts/import-legacy-export.ts path/to/export.json
//
// This does NOT touch the seed script's ladder — it reads the *old* ladder
// straight out of the export (their real edited rung names, not the
// defaults) and creates fresh rows for them, remapping the old string ids
// to new database ids as it goes so exposure logs still point at the right
// rung. Existing rows in the target database are left alone; this only adds.

import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";

const prisma = new PrismaClient();

type LegacyLadderRung = { id: string; name: string; order: number };
type LegacyExposureLog = {
  date: string; rungId: string; target: string; predictedAnxiety: number;
  actualBefore: number; actualAfter: number; freezeCount: number;
  englishOnly: boolean; recovered: boolean; recoveryMethod: string;
  evidence: string[]; notes: string;
};
type LegacySession = {
  date: string; type: string; phases: { id: string; name: string; status: "done" | "skip" }[];
  completedCount: number; skippedCount: number; durationPlanned: number; notes: string;
};
type LegacyExport = {
  version: string;
  settings: { currentDay: number; currentWeek: number };
  moduleCompletions: Record<string, string>;
  reflections: Record<string, string>;
  sessions: LegacySession[];
  ladder: LegacyLadderRung[];
  exposureLogs: LegacyExposureLog[];
};

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error("Usage: npx tsx scripts/import-legacy-export.ts path/to/export.json");
    process.exit(1);
  }
  const raw = JSON.parse(readFileSync(filePath, "utf8")) as LegacyExport;
  if (raw.version !== "2.0.0") {
    console.warn(`Warning: export version is "${raw.version}", this script was written against 2.0.0. Proceeding anyway — check the results carefully.`);
  }

  // 1. Ladder — create rows, build old-id -> new-id map
  const idMap = new Map<string, string>();
  for (const rung of [...raw.ladder].sort((a, b) => a.order - b.order)) {
    const created = await prisma.ladderRung.create({ data: { name: rung.name, order: rung.order } });
    idMap.set(rung.id, created.id);
  }
  console.log(`Imported ${raw.ladder.length} ladder rungs.`);

  // 2. Exposure logs — remap rungId through idMap, skip any that reference
  // a rung id not present in the export's own ladder (shouldn't happen with
  // a real export, but never trust input blindly).
  let importedLogs = 0, skippedLogs = 0;
  for (const log of raw.exposureLogs) {
    const newRungId = idMap.get(log.rungId);
    if (!newRungId) { skippedLogs++; continue; }
    await prisma.exposureLog.create({
      data: {
        date: new Date(log.date),
        rungId: newRungId,
        target: log.target,
        predictedAnxiety: log.predictedAnxiety,
        actualBefore: log.actualBefore,
        actualAfter: log.actualAfter,
        difference: log.actualAfter - log.actualBefore,
        freezeCount: log.freezeCount,
        englishOnly: log.englishOnly,
        recovered: log.recovered,
        recoveryMethod: log.recoveryMethod,
        evidence: log.evidence,
        notes: log.notes,
      },
    });
    importedLogs++;
  }
  console.log(`Imported ${importedLogs} exposure logs${skippedLogs ? ` (skipped ${skippedLogs} with an unmatched rungId)` : ""}.`);

  // 3. Sessions
  for (const s of raw.sessions) {
    await prisma.session.create({
      data: {
        date: new Date(s.date), type: s.type, phases: s.phases,
        completedCount: s.completedCount, skippedCount: s.skippedCount,
        durationPlanned: s.durationPlanned, notes: s.notes,
      },
    });
  }
  console.log(`Imported ${raw.sessions.length} sessions.`);

  // 4. Reflections + module completions
  for (const [key, text] of Object.entries(raw.reflections ?? {})) {
    const moduleNum = Number(key.replace("m", ""));
    if (Number.isInteger(moduleNum)) {
      await prisma.reflection.upsert({ where: { moduleNum }, update: { text }, create: { moduleNum, text } });
    }
  }
  for (const key of Object.keys(raw.moduleCompletions ?? {})) {
    const moduleNum = Number(key.replace("m", ""));
    if (Number.isInteger(moduleNum)) {
      await prisma.moduleCompletion.upsert({ where: { moduleNum }, update: {}, create: { moduleNum } });
    }
  }
  console.log(`Imported ${Object.keys(raw.reflections ?? {}).length} reflections and ${Object.keys(raw.moduleCompletions ?? {}).length} module completions.`);

  // 5. Settings
  await prisma.settings.upsert({
    where: { id: 1 },
    update: { currentDay: raw.settings.currentDay, currentWeek: raw.settings.currentWeek },
    create: { id: 1, currentDay: raw.settings.currentDay, currentWeek: raw.settings.currentWeek },
  });
  console.log("Settings updated.");

  console.log("\nDone. This script only adds rows — it never deletes or overwrites anything already in the database, other than settings/reflections/completions which upsert by design.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
