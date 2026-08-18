import { PrismaClient } from "@prisma/client";
import seedData from "./seed-data.json";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.ladderRung.count();
  if (existing > 0) {
    console.log(`Ladder already has ${existing} rungs — skipping seed. Delete them first if you want to reseed.`);
  } else {
    await prisma.ladderRung.createMany({
      data: seedData.DEFAULT_LADDER.map((r: { id: string; name: string }, i: number) => ({
        // Note: we do NOT reuse the old string ids from the HTML app's
        // localStorage ladder verbatim as primary keys — cuid()-style ids
        // are what the rest of the schema expects. If you're migrating real
        // exported data (not just starting fresh), see MIGRATION.md instead
        // of this seed script.
        name: r.name,
        order: i,
      })),
    });
    console.log(`Seeded ${seedData.DEFAULT_LADDER.length} ladder rungs.`);
  }

  await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, currentDay: 1, currentWeek: 1 },
  });
  console.log("Settings row ready.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
