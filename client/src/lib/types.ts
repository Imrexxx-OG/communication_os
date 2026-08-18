// Mirrors server/prisma/schema.prisma exactly. If a field changes on one
// side, it has to change on both — there's no code generation bridging
// client and server in this setup (deliberately: two small repos, kept in
// sync by hand, is simpler than a shared-package build step for a
// single-developer project).

export type SessionPhase = { id: string; name: string; status: "done" | "skip" };

export type Session = {
  id: string;
  date: string;
  type: string;
  phases: SessionPhase[];
  completedCount: number;
  skippedCount: number;
  durationPlanned: number;
  notes: string;
  createdAt: string;
};

export type LadderRung = {
  id: string;
  name: string;
  order: number;
  createdAt: string;
  currentDifficulty: number | null;
  logCount: number;
};

export type ExposureLog = {
  id: string;
  date: string;
  rungId: string;
  target: string;
  predictedAnxiety: number;
  actualBefore: number;
  actualAfter: number;
  difference: number;
  freezeCount: number;
  englishOnly: boolean;
  recovered: boolean;
  recoveryMethod: string;
  evidence: string[];
  notes: string;
  createdAt: string;
  rung?: { name: string };
};

export type Recommendation = {
  rungId: string;
  rungName: string;
  averageAfter: number;
  sampleSize: number;
  message: string;
};

export type DashboardData = {
  streak: number;
  currentDay: number;
  currentWeek: number;
  totalSessions: number;
  totalExposureLogs: number;
  ladderProgress: { totalRungs: number; rungsWithLogs: number };
  recoveryRate: number | null;
  evidenceTrend: { date: string; value: number }[];
  anxietyTrend: { date: string; value: { avgBefore: number | null; avgAfter: number | null } }[];
  lastBackupAt: string | null;
};

export type RoutinePhase = {
  id: string;
  num: number;
  name: string;
  minutes: number;
  instructions: string[];
  mistake: string;
  cue: string;
};

// Module content blocks — ported as-is from the original app's block types.
export type ContentBlock =
  | { h: string }
  | { pair: [string, string] }
  | { ol: string[] }
  | { note: string }
  | string;

export type Module = {
  num: number;
  title: string;
  subtitle: string;
  objective: string;
  why: string;
  science: { tier: string; text: string }[];
  content: ContentBlock[];
  examples: ContentBlock[];
  practice: ContentBlock[];
  reflection: string[];
};
