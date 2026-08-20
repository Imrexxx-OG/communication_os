"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { api } from "@/lib/api";
import type { DashboardData } from "@/lib/types";
import { DashboardSkeleton } from "@/components/Skeleton";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .dashboard()
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    return (
      <div className="card">
        <h1>Dashboard</h1>
        <p className="lede">
          Couldn&rsquo;t reach the API ({error}). Is the server running on{" "}
          {process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api"}?
        </p>
      </div>
    );
  }
  if (!data) return <DashboardSkeleton />;

  const anxietyChartData = data.anxietyTrend.map((d) => ({
    date: d.date.slice(5),
    before: d.value.avgBefore,
    after: d.value.avgAfter,
  }));
  const evidenceChartData = data.evidenceTrend.map((d) => ({
    date: d.date.slice(5),
    evidence: d.value,
  }));

  const ringPct = data.recoveryRate ?? 0;
  const R = 52;
  const CIRC = 2 * Math.PI * R;
  const offset = CIRC - (ringPct / 100) * CIRC;

  return (
    <>
      <div className="hero">
        <div>
          <div className="hero-eyebrow">
            Day {data.currentDay} &middot; Week {data.currentWeek}
          </div>
          <h1 className="hero-title">
            Welcome back, you&rsquo;re on a {data.streak}-day streak
          </h1>
          <p className="hero-sub">
            Everything here is computed live from your logged sessions and exposures.
          </p>
          <a href="/session" className="bigcta">
            &#9654; Start today&rsquo;s session
          </a>
        </div>
        <div className="hero-side">
          <div className="ring">
            <svg viewBox="0 0 120 120">
              <circle className="ring-track" cx="60" cy="60" r={R} strokeWidth="11" />
              <circle
                className="ring-fill"
                cx="60"
                cy="60"
                r={R}
                strokeWidth="11"
                stroke="url(#ringGrad)"
                strokeDasharray={CIRC}
                strokeDashoffset={offset}
              />
              <defs>
                <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#4ec9b0" />
                  <stop offset="100%" stopColor="#7c9dff" />
                </linearGradient>
              </defs>
            </svg>
            <div className="ring-label-center">
              <div className="val">{data.recoveryRate === null ? "\u2014" : `${data.recoveryRate}%`}</div>
              <div className="lbl">Recovery rate</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid">
        <StatCard
          label="Speaking streak"
          value={`${data.streak} day${data.streak === 1 ? "" : "s"}`}
        />
        <StatCard
          label="Ladder progress"
          value={`${data.ladderProgress.rungsWithLogs}/${data.ladderProgress.totalRungs}`}
        />
        <StatCard label="Total sessions" value={String(data.totalSessions)} />
        <StatCard label="Total exposure logs" value={String(data.totalExposureLogs)} />
      </div>

      <div className="card">
        <h2>Anxiety trend &mdash; last 30 days (before vs. after)</h2>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={anxietyChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="date" stroke="#6c7280" fontSize={11} />
            <YAxis domain={[0, 10]} stroke="#6c7280" fontSize={11} />
            <Tooltip
              contentStyle={{
                background: "#1b1e27",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
              }}
            />
            <Line type="monotone" dataKey="before" stroke="#f0736f" dot={{ r: 3 }} connectNulls />
            <Line type="monotone" dataKey="after" stroke="#4ec9b0" dot={{ r: 3 }} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h2>Evidence collected &mdash; last 30 days</h2>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={evidenceChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="date" stroke="#6c7280" fontSize={11} />
            <YAxis stroke="#6c7280" fontSize={11} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                background: "#1b1e27",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
              }}
            />
            <Line type="monotone" dataKey="evidence" stroke="#7c9dff" dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}
