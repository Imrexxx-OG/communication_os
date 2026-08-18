import { Router } from "express";
import { prisma } from "../db";
import { calcStreak } from "../lib/streak";

export const dashboardRouter = Router();

dashboardRouter.get("/", async (_req, res) => {
  const [sessions, exposureLogs, ladderCount, rungsWithLogs, settings] = await Promise.all([
    prisma.session.findMany({ select: { date: true } }),
    prisma.exposureLog.findMany({
      select: { date: true, actualBefore: true, actualAfter: true, recovered: true, freezeCount: true, evidence: true },
    }),
    prisma.ladderRung.count(),
    prisma.exposureLog.findMany({ select: { rungId: true }, distinct: ["rungId"] }),
    prisma.settings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } }),
  ]);

  const streak = calcStreak(sessions.map((s: { date: Date }) => s.date));

  // Recovery rate: of logs where a freeze actually happened, how many were
  // recovered without switching language. A log with freezeCount 0 isn't a
  // "recovery" data point at all — nothing to recover from.
  const freezeEvents = exposureLogs.filter((l: { freezeCount: number }) => l.freezeCount > 0);
  const recoveryRate = freezeEvents.length
    ? Math.round(
        (freezeEvents.filter((l: { recovered: boolean }) => l.recovered).length / freezeEvents.length) * 100
      )
    : null;

  // Evidence trend — last 30 days, count of evidence[] entries per day.
  // This is the "Evidence Collected Today" number, extended into a trend
  // line instead of a one-off. Days with zero logs still appear, at 0 —
  // a flat trend is real information too, not a gap to hide.
  const evidenceTrend = buildDailySeries(30, exposureLogs, (dayLogs) =>
    dayLogs.reduce((sum, l) => sum + l.evidence.length, 0)
  );

  // Anxiety trend — average before/after per day, last 30 days.
  const anxietyTrend = buildDailySeries(30, exposureLogs, (dayLogs) => ({
    avgBefore: avg(dayLogs.map((l) => l.actualBefore)),
    avgAfter: avg(dayLogs.map((l) => l.actualAfter)),
  }));

  res.json({
    streak,
    currentDay: settings.currentDay,
    currentWeek: settings.currentWeek,
    totalSessions: sessions.length,
    totalExposureLogs: exposureLogs.length,
    ladderProgress: { totalRungs: ladderCount, rungsWithLogs: rungsWithLogs.length },
    recoveryRate,
    evidenceTrend,
    anxietyTrend,
    lastBackupAt: settings.lastBackupAt,
  });
});

function avg(nums: number[]): number | null {
  if (!nums.length) return null;
  return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10;
}

function buildDailySeries<T>(
  days: number,
  logs: { date: Date }[],
  reducer: (dayLogs: any[]) => T
): { date: string; value: T }[] {
  const byDay = new Map<string, any[]>();
  for (const log of logs) {
    const key = log.date.toISOString().slice(0, 10); // DB dates are UTC-midnight instants of the exact date logged — correct as-is
    const arr = byDay.get(key) ?? [];
    arr.push(log);
    byDay.set(key, arr);
  }
  const out: { date: string; value: T }[] = [];
  const cursor = new Date();
  cursor.setDate(cursor.getDate() - (days - 1));
  for (let i = 0; i < days; i++) {
    // Same fix as streak.ts: build the key from LOCAL date parts directly,
    // not setHours(0,0,0,0) followed by toISOString() — that combination
    // silently shifts to the previous day in any timezone ahead of UTC,
    // which was making the last day of this chart's range wrong.
    const y = cursor.getFullYear();
    const m = String(cursor.getMonth() + 1).padStart(2, "0");
    const d = String(cursor.getDate()).padStart(2, "0");
    const key = `${y}-${m}-${d}`;
    out.push({ date: key, value: reducer(byDay.get(key) ?? []) });
    cursor.setDate(cursor.getDate() + 1);
  }
  return out;
}
