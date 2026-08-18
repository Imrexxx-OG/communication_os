// Sessions are logged against a plain YYYY-MM-DD date representing the
// person's own local calendar day (decided once, client-side, at the
// moment they save — see client/src/app/session/page.tsx). Postgres stores
// that literally with no timezone conversion, and Prisma reads it back as
// a Date representing UTC midnight of that exact date — so UTC getters
// recover the original string exactly, with no drift.
function dbDateKey(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// "Today," from wherever this server process is actually running. For a
// personal tool where you also control the server, this is an acceptable
// simplification — flagged here rather than left as a silent assumption:
// if the server and the person using the app are ever in different
// timezones (e.g. server on a UTC cloud box, person in WAT), this should
// really be computed from the client's local time and sent up instead.
function todayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function calcStreak(sessionDates: Date[]): number {
  const daySet = new Set(sessionDates.map(dbDateKey));
  let streak = 0;
  const cursor = new Date();

  // If there's no session today, check whether yesterday still has one —
  // the streak isn't "broken" until a full day has passed with nothing
  // logged, so someone checking the dashboard at 8am before today's
  // session still sees yesterday's streak intact.
  if (!daySet.has(todayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (daySet.has(todayKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
