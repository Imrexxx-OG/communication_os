// Factory reset -- wipes ALL app data (sessions, exposure logs,
// reflections, module completions, ladder rungs), resets Day/Week to 1,
// AND restores the original 14 default ladder rungs from seed-data.json --
// same rungs and same order the app ships with on a fresh install.
// This is permanent. There is no undo. Run with: npx tsx scripts/reset-test-data.ts
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { prisma } from "../src/db";
import seedData from "../prisma/seed-data.json";

async function confirm(): Promise<boolean> {
  const rl = readline.createInterface({ input, output });
  const answer = await rl.question(
    "This will PERMANENTLY delete every session, exposure log, reflection, module completion, and ladder rung, reset Day/Week to 1, and restore the original 14 starter rungs -- like a factory reset.\nThere is no undo.\nType RESET to confirm, or anything else to cancel: "
  );
  rl.close();
  return answer.trim() === "RESET";
}

async function main() {
  const ok = await confirm();
  if (!ok) {
    console.log("Cancelled -- nothing was deleted.");
    return;
  }

  // Delete order matters: ExposureLog has onDelete: Restrict against
  // LadderRung, so exposure logs must go first or the rung deletes will
  // fail with a foreign key error.
  const exposureLogs = await prisma.exposureLog.deleteMany();
  const sessions = await prisma.session.deleteMany();
  const reflections = await prisma.reflection.deleteMany();
  const completions = await prisma.moduleCompletion.deleteMany();
  const rungsDeleted = await prisma.ladderRung.deleteMany();

  // Restore the original starter ladder -- same logic as prisma/seed.ts:
  // new cuid() ids, not the old string ids from seed-data.json, since the
  // rest of the schema expects Prisma's own id format.
  await prisma.ladderRung.createMany({
    data: seedData.DEFAULT_LADDER.map((r: { id: string; name: string }, i: number) => ({
      name: r.name,
      order: i,
    })),
  });

  await prisma.settings.upsert({
    where: { id: 1 },
    update: { currentDay: 1, currentWeek: 1, lastBackupAt: null },
    create: { id: 1, currentDay: 1, currentWeek: 1 },
  });

  console.log("Factory reset complete:");
  console.log(`  Exposure logs deleted:    ${exposureLogs.count}`);
  console.log(`  Sessions deleted:         ${sessions.count}`);
  console.log(`  Reflections deleted:      ${reflections.count}`);
  console.log(`  Module completions reset: ${completions.count}`);
  console.log(`  Old ladder rungs removed: ${rungsDeleted.count}`);
  console.log(`  Starter rungs restored:   ${seedData.DEFAULT_LADDER.length}`);
  console.log("  Day/Week reset to 1.");
}

main()
  .catch((e) => {
    console.error("Reset failed:", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
