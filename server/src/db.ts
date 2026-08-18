import { PrismaClient } from "@prisma/client";

// Standard single-instance pattern — without this, every dev-server hot
// reload (tsx watch) would open a new PrismaClient and eventually exhaust
// Postgres connections.
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma = global.__prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") global.__prisma = prisma;
