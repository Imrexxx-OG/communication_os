"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { todayLocalDate } from "@/lib/date";
import type { LadderRung, Recommendation } from "@/lib/types";

export default function LadderPage() {
  const [rungs, setRungs] = useState<LadderRung[]>([]);
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [newName, setNewName] = useState("");
  const [openRung, setOpenRung] = useState<string | null>(null);

  async function refresh() {
    const [r, rc] = await Promise.all([api.ladder.list(), api.ladder.recommendations()]);
    setRungs(r);
    setRecs(rc);
  }
  useEffect(() => { refresh(); }, []);

  async function addRung() {
    if (!newName.trim()) return;
    await api.ladder.add(newName.trim());
    setNewName("");
    refresh();
  }
  async function renameRung(id: string, current: string) {
    const name = prompt("Rename rung:", current);
    if (name && name.trim() && name !== current) {
      await api.ladder.rename(id, name.trim());
      refresh();
    }
  }
  async function removeRung(id: string) {
    if (!confirm("Remove this rung?")) return;
    try {
      await api.ladder.remove(id);
      refresh();
    } catch (e: any) {
      alert(e.message);
    }
  }
  async function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= rungs.length) return;
    const ids = rungs.map((r) => r.id);
    [ids[index], ids[target]] = [ids[target], ids[index]];
    await api.ladder.reorder(ids);
    refresh();
  }

  return (
    <>
      <h1>Exposure Ladder</h1>
      <p className="lede">
        Display Order is yours to set and won&rsquo;t reshuffle on its own. Current Difficulty (shown per rung) is
        computed from your actual logged anxiety-after ratings — it updates itself, but never moves the rung for you.
      </p>

      {recs.length > 0 && (
        <div className="card" style={{ borderColor: "rgba(232,195,126,0.4)" }}>
          <h2 style={{ color: "var(--warning)" }}>Recommendations (advisory only)</h2>
          {recs.map((r) => (
            <p key={r.rungId} style={{ fontSize: 14, color: "var(--text-2)" }}>{r.message}</p>
          ))}
        </div>
      )}

      <div className="card">
        <h2>Add a rung</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            style={{ flex: 1 }}
            placeholder="e.g. Ask a follow-up question in a meeting"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button className="btn solid" onClick={addRung}>Add</button>
        </div>
      </div>

      {rungs.map((r, i) => (
        <div key={r.id} className="card">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "var(--text-2)" }}>
              {i + 1}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{r.name}</div>
              <div style={{ fontSize: 12, color: "var(--text-3)" }}>
                {r.currentDifficulty === null
                  ? "No data yet"
                  : `Current difficulty: ${r.currentDifficulty}/10 avg (${r.logCount} logs)`}
              </div>
            </div>
            <button className="btn" onClick={() => move(i, -1)} disabled={i === 0}>↑</button>
            <button className="btn" onClick={() => move(i, 1)} disabled={i === rungs.length - 1}>↓</button>
            <button className="btn" onClick={() => renameRung(r.id, r.name)}>Rename</button>
            <button className="btn danger" onClick={() => removeRung(r.id)}>Remove</button>
            <button className="btn" onClick={() => setOpenRung(openRung === r.id ? null : r.id)}>
              {openRung === r.id ? "Close" : "Log exposure"}
            </button>
          </div>
          {openRung === r.id && <LogForm rungId={r.id} onSaved={refresh} onClose={() => setOpenRung(null)} />}
        </div>
      ))}
    </>
  );
}

function LogForm({ rungId, onSaved, onClose }: { rungId: string; onSaved: () => void; onClose: () => void }) {
  const [target, setTarget] = useState("");
  const [predicted, setPredicted] = useState(5);
  const [before, setBefore] = useState(5);
  const [after, setAfter] = useState(5);
  const [freezeCount, setFreezeCount] = useState(0);
  const [englishOnly, setEnglishOnly] = useState(true);
  const [recovered, setRecovered] = useState(true);
  const [recoveryMethod, setRecoveryMethod] = useState("");
  const [evidenceInput, setEvidenceInput] = useState("");
  const [evidence, setEvidence] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [recent, setRecent] = useState<Awaited<ReturnType<typeof api.exposureLogs.list>>>([]);

  async function loadRecent() {
    const logs = await api.exposureLogs.list(rungId, 5);
    setRecent(logs);
  }
  useEffect(() => { loadRecent(); }, [rungId]);

  function addEvidence() {
    if (evidenceInput.trim()) {
      setEvidence((e) => [...e, evidenceInput.trim()]);
      setEvidenceInput("");
    }
  }

  async function save() {
    if (status === "saving") return; // the actual fix: a second click while a save is in flight now does nothing
    setStatus("saving");
    try {
      await api.exposureLogs.create({
        date: todayLocalDate(),
        rungId,
        target,
        predictedAnxiety: predicted,
        actualBefore: before,
        actualAfter: after,
        freezeCount,
        englishOnly,
        recovered,
        recoveryMethod,
        evidence,
        notes,
      });
      setStatus("saved");
      onSaved();
      await loadRecent();
      setTimeout(onClose, 1100); // brief visible confirmation, then close on its own
    } catch (e: any) {
      setStatus("error");
      alert(e.message ?? "Save failed — nothing was recorded.");
    }
  }

  async function deleteLog(id: string) {
    if (!confirm("Delete this exposure log?")) return;
    await api.exposureLogs.remove(id);
    await loadRecent();
    onSaved();
  }

  return (
    <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
      <label style={{ fontSize: 12, color: "var(--text-3)" }}>What actually happened</label>
      <input style={{ width: "100%", marginBottom: 10 }} value={target} onChange={(e) => setTarget(e.target.value)} placeholder="e.g. Asked the receptionist where the HR office is." disabled={status === "saving" || status === "saved"} />

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
        <NumberField label="Predicted anxiety" value={predicted} onChange={setPredicted} />
        <NumberField label="Actual before" value={before} onChange={setBefore} />
        <NumberField label="Actual after" value={after} onChange={setAfter} />
        <NumberField label="Freeze count" value={freezeCount} onChange={setFreezeCount} max={20} />
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 10, fontSize: 13.5 }}>
        <label><input type="checkbox" checked={englishOnly} onChange={(e) => setEnglishOnly(e.target.checked)} /> Stayed English-only</label>
        <label><input type="checkbox" checked={recovered} onChange={(e) => setRecovered(e.target.checked)} /> Recovered without switching</label>
      </div>

      <input style={{ width: "100%", marginBottom: 10 }} value={recoveryMethod} onChange={(e) => setRecoveryMethod(e.target.value)} placeholder="Recovery method used (e.g. PACE+)" />

      <label style={{ fontSize: 12, color: "var(--text-3)" }}>Evidence collected today</label>
      <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
        <input style={{ flex: 1 }} value={evidenceInput} onChange={(e) => setEvidenceInput(e.target.value)} placeholder="e.g. Stayed in English" onKeyDown={(e) => e.key === "Enter" && addEvidence()} />
        <button className="btn" onClick={addEvidence}>Add</button>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
        {evidence.map((ev, i) => (
          <span key={i} style={{ fontSize: 12.5, background: "var(--surface-2)", padding: "4px 9px", borderRadius: 999 }}>{ev}</span>
        ))}
      </div>

      <textarea style={{ width: "100%", minHeight: 60, marginBottom: 10 }} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" disabled={status === "saving" || status === "saved"} />

      <button
        className="btn solid"
        onClick={save}
        disabled={status === "saving" || status === "saved"}
        style={status === "saved" ? { background: "var(--success)", borderColor: "var(--success)" } : undefined}
      >
        {status === "saving" ? "Saving…" : status === "saved" ? "✓ Saved" : "Save exposure log"}
      </button>

      {recent.length > 0 && (
        <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px dashed var(--border)" }}>
          <div style={{ fontSize: 11.5, color: "var(--text-3)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Recent logs for this rung
          </div>
          {recent.map((log) => (
            <div key={log.id} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, padding: "6px 0", borderBottom: "1px solid #1c1e26" }}>
              <span style={{ color: "var(--text-3)", width: 88, flexShrink: 0 }}>{log.date.slice(0, 10)}</span>
              <span style={{ color: "var(--text-2)", flex: 1 }}>{log.target || "—"} (before {log.actualBefore} → after {log.actualAfter})</span>
              <button className="btn danger" style={{ padding: "3px 9px", fontSize: 12 }} onClick={() => deleteLog(log.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NumberField({ label, value, onChange, max = 10 }: { label: string; value: number; onChange: (n: number) => void; max?: number }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 11.5, color: "var(--text-3)", marginBottom: 4 }}>{label}</label>
      <input type="number" min={0} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ width: 70 }} />
    </div>
  );
}
