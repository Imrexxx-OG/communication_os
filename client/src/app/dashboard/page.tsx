"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { api } from "@/lib/api";
import type { DashboardData } from "@/lib/types";

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
          Couldn&rsquo;t reach the API ({error}). Is the server running on {process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api"}?
        </p>
      </div>
    );
  }
  if (!data) return <p className="lede">Loading&hellip;</p>;

  const anxietyChartData = data.anxietyTrend.map((d) => ({
    date: d.date.slice(5),
    before: d.value.avgBefore,
    after: d.value.avgAfter,
  }));
  const evidenceChartData = data.evidenceTrend.map((d) => ({ date: d.date.slice(5), evidence: d.value }));

  return (
    <>
      <h1>Dashboard</h1>
      <p className="lede">Everything here is computed live from your logged sessions and exposures.</p>

      <div className="grid">
        <StatCard label="Speaking streak" value={`${data.streak} day${data.streak === 1 ? "" : "s"}`} />
        <StatCard label="Recovery rate" value={data.recoveryRate === null ? "—" : `${data.recoveryRate}%`} />
        <StatCard
          label="Ladder progress"
          value={`${data.ladderProgress.rungsWithLogs}/${data.ladderProgress.totalRungs}`}
        />
        <StatCard label="Total sessions" value={String(data.totalSessions)} />
        <StatCard label="Total exposure logs" value={String(data.totalExposureLogs)} />
        <StatCard label="Day / Week" value={`${data.currentDay} / ${data.currentWeek}`} />
      </div>

      <div className="card">
        <h2>Anxiety trend — last 30 days (before vs. after)</h2>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={anxietyChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="date" stroke="#6c7280" fontSize={11} />
            <YAxis domain={[0, 10]} stroke="#6c7280" fontSize={11} />
            <Tooltip contentStyle={{ background: "#1b1e27", border: "1px solid rgba(255,255,255,0.1)" }} />
            <Line type="monotone" dataKey="before" stroke="#f0736f" dot={{ r: 3 }} connectNulls />
            <Line type="monotone" dataKey="after" stroke="#4ec9b0" dot={{ r: 3 }} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h2>Evidence collected — last 30 days</h2>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={evidenceChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="date" stroke="#6c7280" fontSize={11} />
            <YAxis stroke="#6c7280" fontSize={11} allowDecimals={false} />
            <Tooltip contentStyle={{ background: "#1b1e27", border: "1px solid rgba(255,255,255,0.1)" }} />
            <Line type="monotone" dataKey="evidence" stroke="#7c9dff" dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <a href="/session" className="btn solid">
          Start today&rsquo;s session →
        </a>
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
