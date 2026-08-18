"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Module, ContentBlock } from "@/lib/types";

const TIER_COLOR: Record<string, string> = {
  t1: "var(--accent)", t2: "#67d3ff", t3: "var(--text-2)", t4: "var(--warning)", t5: "var(--error)",
};
const TIER_LABEL: Record<string, string> = {
  t1: "Strong evidence", t2: "Good evidence", t3: "Practitioner consensus", t4: "Inspiration only", t5: "Speculative",
};

export default function ModulePage({ params }: { params: { num: string } }) {
  const num = Number(params.num);
  const [mod, setMod] = useState<Module | null>(null);
  const [reflectionText, setReflectionText] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    api.content.module(num).then(setMod);
    api.reflections.list().then((all) => {
      const mine = all.find((r) => r.moduleNum === num);
      if (mine) setReflectionText(mine.text);
    });
    api.reflections.completions().then((all) => setCompleted(all.some((c) => c.moduleNum === num)));
  }, [num]);

  if (!mod) return <p className="lede">Loading&hellip;</p>;

  async function markComplete() {
    await api.reflections.complete(num);
    setCompleted(true);
  }
  async function saveReflection() {
    await api.reflections.save(num, reflectionText);
  }

  return (
    <>
      <div style={{ display: "flex", gap: 10, marginBottom: 4 }}>
        {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
          <a key={n} href={`/learn/${n}`} className="btn" style={{ padding: "5px 10px", fontSize: 12, background: n === num ? "var(--accent)" : undefined, color: n === num ? "#05201a" : undefined }}>
            {n}
          </a>
        ))}
      </div>
      <h1>{mod.num}. {mod.title}</h1>
      <p className="lede">{mod.subtitle}</p>

      <div className="card">
        <h2>Objective</h2>
        <p style={{ color: "var(--text-2)", fontSize: 14.5 }}>{mod.objective}</p>
        <h2 style={{ marginTop: 16 }}>Why</h2>
        <p style={{ color: "var(--text-2)", fontSize: 14.5 }}>{mod.why}</p>
      </div>

      <div className="card">
        <h2>Science</h2>
        {mod.science.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8, fontSize: 13.5 }}>
            <span style={{ fontSize: 9.5, fontWeight: 700, color: TIER_COLOR[s.tier], border: `1px solid ${TIER_COLOR[s.tier]}`, borderRadius: 4, padding: "2px 6px", flexShrink: 0, marginTop: 2 }}>
              {TIER_LABEL[s.tier] ?? s.tier}
            </span>
            <span style={{ color: "var(--text-2)" }}>{s.text}</span>
          </div>
        ))}
      </div>

      <div className="card">
        <h2>Content</h2>
        <Blocks blocks={mod.content} />
      </div>

      {mod.examples.length > 0 && (
        <div className="card">
          <h2>Examples</h2>
          <Blocks blocks={mod.examples} />
        </div>
      )}

      <div className="card">
        <h2>Practice</h2>
        <Blocks blocks={mod.practice} />
      </div>

      <div className="card">
        <h2>Reflection</h2>
        {mod.reflection.map((q, i) => <p key={i} style={{ color: "var(--text-2)", fontSize: 14 }}>{q}</p>)}
        <textarea style={{ width: "100%", minHeight: 90, marginTop: 8 }} value={reflectionText} onChange={(e) => setReflectionText(e.target.value)} onBlur={saveReflection} placeholder="Write here — saved automatically when you click away." />
      </div>

      <button className="btn solid" onClick={markComplete} disabled={completed}>
        {completed ? "✓ Completed" : "Mark module complete"}
      </button>
    </>
  );
}

function Blocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (typeof b === "string") return <p key={i} style={{ color: "var(--text-2)", fontSize: 14.5, marginBottom: 10 }}>{b}</p>;
        if ("h" in b) return <h3 key={i} style={{ fontSize: 14, marginTop: 16, marginBottom: 6 }}>{b.h}</h3>;
        if ("pair" in b) return (
          <div key={i} style={{ marginBottom: 10, fontSize: 13.5 }}>
            <div style={{ color: "var(--error)", textDecoration: "line-through", opacity: 0.8 }}>{b.pair[0]}</div>
            <div style={{ color: "var(--success)" }}>{b.pair[1]}</div>
          </div>
        );
        if ("ol" in b) return (
          <ol key={i} style={{ color: "var(--text-2)", fontSize: 14.5, paddingLeft: 20 }}>
            {b.ol.map((item, j) => <li key={j} style={{ marginBottom: 4 }}>{item}</li>)}
          </ol>
        );
        if ("note" in b) return (
          <p key={i} style={{ fontSize: 13, color: "var(--text-3)", fontStyle: "italic", marginBottom: 10 }}>{b.note}</p>
        );
        return null;
      })}
    </>
  );
}
