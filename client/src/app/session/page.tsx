"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { todayLocalDate } from "@/lib/date";
import type { RoutinePhase, SessionPhase } from "@/lib/types";

export default function SessionPage() {
  const [phases, setPhases] = useState<RoutinePhase[] | null>(null);
  const [current, setCurrent] = useState(0);
  const [log, setLog] = useState<SessionPhase[]>([]);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const [saved, setSaved] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    api.content.routinePhases().then((p) => {
      setPhases(p);
      setRemaining((p[0]?.minutes ?? 0) * 60);
    });
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function start() {
    if (running || !phases) return;
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setRunning(false);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
  }
  function pause() {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }
  function reset() {
    pause();
    if (phases) setRemaining(phases[current].minutes * 60);
  }
  function advance(status: "done" | "skip") {
    if (!phases) return;
    pause();
    const phase = phases[current];
    setLog((l) => [...l, { id: phase.id, name: phase.name, status }]);
    if (current < phases.length - 1) {
      const next = current + 1;
      setCurrent(next);
      setRemaining(phases[next].minutes * 60);
    } else {
      setCurrent(current + 1); // past the last phase -> show the save form
    }
  }

  async function saveSession() {
    if (!phases) return;
    const completedCount = log.filter((l) => l.status === "done").length;
    const skippedCount = log.filter((l) => l.status === "skip").length;
    const durationPlanned = phases.reduce((s, p) => s + p.minutes, 0);
    await api.sessions.create({
      date: todayLocalDate(),
      type: "routine",
      phases: log,
      completedCount,
      skippedCount,
      durationPlanned,
      notes: "",
    });
    setSaved(true);
  }

  if (!phases) return <p className="lede">Loading&hellip;</p>;

  if (saved) {
    return (
      <div className="card">
        <h1>Session saved</h1>
        <p className="lede">{log.filter((l) => l.status === "done").length} of {phases.length} phases completed.</p>
        <a href="/dashboard" className="btn solid">Back to dashboard</a>
      </div>
    );
  }

  if (current >= phases.length) {
    return (
      <div className="card">
        <h1>Routine complete — save it?</h1>
        <p className="lede">
          {log.filter((l) => l.status === "done").length} completed, {log.filter((l) => l.status === "skip").length} skipped.
        </p>
        <button className="btn solid" onClick={saveSession}>Save session</button>
      </div>
    );
  }

  const phase = phases[current];
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  return (
    <>
      <h1>Today&rsquo;s Session</h1>
      <p className="lede">Phase {current + 1} of {phases.length}</p>

      <div className="card">
        <h2>{phase.name} — {phase.minutes} min</h2>
        <ul style={{ color: "var(--text-2)", fontSize: 14.5, lineHeight: 1.7 }}>
          {phase.instructions.map((i, idx) => <li key={idx}>{i}</li>)}
        </ul>
        <p style={{ fontSize: 13, color: "var(--text-3)" }}><b>Common mistake:</b> {phase.mistake}</p>
        <p style={{ fontSize: 13, color: "var(--text-3)" }}><b>Success cue:</b> {phase.cue}</p>

        <div style={{ fontSize: 44, fontWeight: 700, textAlign: "center", margin: "18px 0" }}>{mm}:{ss}</div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="btn" onClick={start}>Start</button>
          <button className="btn" onClick={pause}>Pause</button>
          <button className="btn" onClick={reset}>Reset</button>
          <button className="btn" onClick={() => advance("skip")}>Skip</button>
          <button className="btn solid" onClick={() => advance("done")}>Complete</button>
        </div>
      </div>
    </>
  );
}
