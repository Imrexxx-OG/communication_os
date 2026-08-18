import { CONFIG } from "../data/content";

export type Recommendation = {
  rungId: string;
  rungName: string;
  averageAfter: number;
  sampleSize: number;
  message: string;
};

type LogForRecommend = { rungId: string; actualAfter: number; date: Date };
type RungForRecommend = { id: string; name: string };

// Spec rule #5, verbatim: "This situation has averaged <=2/10 anxiety over
// the last five completed exposures. Consider moving it lower in your
// ladder." This function ONLY returns text. Nothing in this file — or
// anywhere else in the server — ever writes to LadderRung.order based on
// this output. Reordering is a POST /api/ladder/reorder call the person
// makes themselves, or it doesn't happen.
export function buildRecommendations(
  rungs: RungForRecommend[],
  logs: LogForRecommend[]
): Recommendation[] {
  const sample = CONFIG.RECOMMEND_SAMPLE;
  const threshold = CONFIG.RECOMMEND_THRESHOLD;
  const out: Recommendation[] = [];

  for (const rung of rungs) {
    const rungLogs = logs
      .filter((l) => l.rungId === rung.id)
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, sample);

    if (rungLogs.length < sample) continue; // not enough data — say nothing, per spec

    const avg =
      rungLogs.reduce((sum, l) => sum + l.actualAfter, 0) / rungLogs.length;

    if (avg <= threshold) {
      out.push({
        rungId: rung.id,
        rungName: rung.name,
        averageAfter: Math.round(avg * 10) / 10,
        sampleSize: rungLogs.length,
        message: `"${rung.name}" has averaged ${Math.round(avg * 10) / 10}/10 anxiety over the last ${rungLogs.length} completed exposures. Consider moving it lower in your ladder.`,
      });
    }
  }
  return out;
}
