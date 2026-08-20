"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { todayLocalDate } from "@/lib/date";
import type { LadderRung, Recommendation } from "@/lib/types";
import { useFeedback } from "@/components/Feedback";
import { ListSkeleton } from "@/components/Skeleton";

export default function LadderPage() {
  const { toast, confirmDialog, promptDialog } = useFeedback();
  const [rungs, setRungs] = useState<LadderRung[]>([]);
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [newName, setNewName] = useState("");
  const [openRung, setOpenRung] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);

  async function refresh() {
    try {
      const [r, rc] = await Promise.all([api.ladder.list(), api.ladder.recommendations()]);
      setRungs(r);
      setRecs(rc);
      setLoadError(null);
    } catch (e: any) {
      setLoadError(e?.message ?? "Couldn't reach the server.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    refresh();
  }, []);

  async function addRung() {
    if (!newName.trim()) return;
    try {
      await api.ladder.add(newName.trim());
      setNewName("");
      toast("Rung added");
      refresh();
    } catch (e: any) {
      toast(e?.message ?? "Couldn't reach the server \u2014 rung wasn't added.", "error");
    }
  }
  async function renameRung(id: string, current: string) {
    const name = await promptDialog("Rename rung:", current);
    if (name && name.trim() && name !== current) {
      try {
        await api.ladder.rename(id, name.trim());
        toast("Rung renamed");
        refresh();
      } catch (e: any) {
        toast(e?.message ?? "Couldn't reach the server \u2014 rename wasn't saved.", "error");
      }
    }
  }
  async function removeRung(id: string) {
    const ok = await confirmDialog("Remove this rung?");
    if (!ok) return;
    try {
      await api.ladder.remove(id);
      toast("Rung removed");
      refresh();
    } catch (e: any) {
      toast(e.message, "error");
    }
  }
  async function move(index: number, dir: -1 | 1) {
    if (reordering) return; // a reorder is already saving -- ignore rapid clicks
    const target = index + dir;
    if (target < 0 || target >= rungs.length) return;

    // Optimistic update: reorder on screen immediately so the row responds
    // right away, instead of waiting on the network before anything moves.
    const reordered = [...rungs];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setRungs(reordered);
    setReordering(true);

    try {
      await api.ladder.reorder(reordered.map((r) => r.id));
      await refresh();
    } catch (e: any) {
      toast(e?.message ?? "Couldn't save the new order \u2014 check your server connection.", "error");
      await refresh(); // revert to whatever the backend actually has
    } finally {
      setReordering(false);
    }
  }

  return (
    <>
      <h1>Exposure Ladder</h1>
      <p className="lede">
        Display order is yours to set and won&rsquo;t reshuffle on its own. Current difficulty is
        computed from your logged anxiety-after ratings &mdash; it updates itself, but never
        moves the rung for you.
      </p>

      {loadError && (
        <div className="card" style={{ borderLeft: "3px solid var(--error)" }}>
          <h2 style={{ color: "var(--error)" }}>Couldn&rsquo;t reach the server</h2>
          <p style={{ fontSize: 14, color: "var(--text-2)", marginBottom: 14 }}>
            {loadError} Check that your backend server is running, then try again.
          </p>
          <button className="btn solid" onClick={refresh}>
            Retry
          </button>
        </div>
      )}

      {recs.length > 0 && (
        <div className="card accent-left" style={{ borderLeftColor: "var(--warning)" }}>
          <h2 style={{ color: "var(--warning)" }}>Recommendations &mdash; advisory only</h2>
          {recs.map((r) => (
            <p key={r.rungId} style={{ fontSize: 14, color: "var(--text-2)", marginBottom: 6 }}>
              {r.message}
            </p>
          ))}
        </div>
      )}

      <div className="card">
        <h2>Add a rung</h2>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            style={{ flex: 1 }}
            placeholder="e.g. Ask a follow-up question in a meeting"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addRung()}
          />
          <button className="btn solid" onClick={addRung}>
            Add
          </button>
        </div>
      </div>

      {loading ? (
        <ListSkeleton rows={3} />
      ) : rungs.length === 0 ? (
        <div className="empty-state">
          <div className="icon">&#128444;&#65039;</div>
          <h3>No rungs yet</h3>
          <p>
            Add your first exposure above &mdash; something small and low-stakes works best to
            start your ladder.
          </p>
        </div>
      ) : (
        rungs.map((r, i) => (
          <div key={r.id} className="rung">
            <div className="rung-row">
              <div className="rung-num">{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div className="rung-name">{r.name}</div>
                <div className="rung-meta">
                  {r.currentDifficulty === null
                    ? "No data yet"
                    : `${r.currentDifficulty}/10 avg \u00b7 ${r.logCount} log${r.logCount === 1 ? "" : "s"}`}
                </div>
              </div>
              <div className="rung-actions">
                <button className="btn" onClick={() => move(i, -1)} disabled={i === 0 || reordering}>
                  &uarr;
                </button>
                <button
                  className="btn"
                  onClick={() => move(i, 1)}
                  disabled={i === rungs.length - 1 || reordering}
                >
                  &darr;
                </button>
                <button className="btn" onClick={() => renameRung(r.id, r.name)}>
                  Rename
                </button>
                <button className="btn danger" onClick={() => removeRung(r.id)}>
                  Remove
                </button>
                <button className="btn solid" onClick={() => setOpenRung(openRung === r.id ? null : r.id)}>
                  {openRung === r.id ? "Close" : "Log exposure"}
                </button>
              </div>
            </div>
            {openRung === r.id && (
              <LogForm rungId={r.id} onSaved={refresh} onClose={() => setOpenRung(null)} />
            )}
          </div>
        ))
      )}
    </>
  );
}

function LogForm({
  rungId,
  onSaved,
  onClose,
}: {
  rungId: string;
  onSaved: () => void;
  onClose: () => void;
}) {
  const { toast, confirmDialog } = useFeedback();
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
    setRecent(await api.exposureLogs.list(rungId, 5));
  }
  useEffect(() => {
    loadRecent();
  }, [rungId]);

  function addEvidence() {
    if (evidenceInput.trim()) {
      setEvidence((e) => [...e, evidenceInput.trim()]);
      setEvidenceInput("");
    }
  }

  async function save() {
    if (status === "saving") return;
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
      setTimeout(onClose, 1100);
    } catch (e: any) {
      setStatus("error");
      toast(e.message ?? "Save failed \u2014 nothing was recorded.", "error");
    }
  }

  async function deleteLog(id: string) {
    const ok = await confirmDialog("Delete this exposure log?");
    if (!ok) return;
    await api.exposureLogs.remove(id);
    await loadRecent();
    onSaved();
    toast("Log deleted");
  }

  return (
    <div className="rung-form">
      <label className="field-label">What actually happened</label>
      <input
        style={{ width: "100%", marginBottom: 14 }}
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        placeholder="e.g. Asked the receptionist where the HR office is."
        disabled={status === "saving" || status === "saved"}
      />

      <div className="field-row">
        <NumberField label="Predicted anxiety" value={predicted} onChange={setPredicted} />
        <NumberField label="Actual before" value={before} onChange={setBefore} />
        <NumberField label="Actual after" value={after} onChange={setAfter} />
        <NumberField label="Freeze count" value={freezeCount} onChange={setFreezeCount} max={20} />
      </div>

      <div style={{ display: "flex", gap: 18, marginBottom: 14, fontSize: 13.5, color: "var(--text-2)" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <input
            type="checkbox"
            checked={englishOnly}
            onChange={(e) => setEnglishOnly(e.target.checked)}
            style={{ minHeight: "auto" }}
          />{" "}
          Stayed English-only
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <input
            type="checkbox"
            checked={recovered}
            onChange={(e) => setRecovered(e.target.checked)}
            style={{ minHeight: "auto" }}
          />{" "}
          Recovered without switching
        </label>
      </div>

      <label className="field-label">Recovery method</label>
      <input
        style={{ width: "100%", marginBottom: 14 }}
        value={recoveryMethod}
        onChange={(e) => setRecoveryMethod(e.target.value)}
        placeholder="e.g. PACE+"
      />

      <label className="field-label">Evidence collected today</label>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input
          style={{ flex: 1 }}
          value={evidenceInput}
          onChange={(e) => setEvidenceInput(e.target.value)}
          placeholder="e.g. Stayed in English"
          onKeyDown={(e) => e.key === "Enter" && addEvidence()}
        />
        <button className="btn" onClick={addEvidence}>
          Add
        </button>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {evidence.map((ev, i) => (
          <span key={i} className="evidence-chip">
            {ev}
          </span>
        ))}
      </div>

      <label className="field-label">Notes</label>
      <textarea
        style={{ width: "100%", minHeight: 64, marginBottom: 16 }}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        disabled={status === "saving" || status === "saved"}
      />

      <button
        className="btn solid"
        onClick={save}
        disabled={status === "saving" || status === "saved"}
        style={status === "saved" ? { background: "var(--success)", borderColor: "var(--success)" } : undefined}
      >
        {status === "saving" ? "Saving\u2026" : status === "saved" ? "\u2713 Saved" : "Save exposure log"}
      </button>

      {recent.length > 0 && (
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px dashed var(--border)" }}>
          <div className="field-label" style={{ marginBottom: 10 }}>
            Recent logs for this rung
          </div>
          {recent.map((log) => (
            <div
              key={log.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 13,
                padding: "7px 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <span style={{ color: "var(--text-3)", width: 84, flexShrink: 0 }}>
                {log.date.slice(0, 10)}
              </span>
              <span style={{ color: "var(--text-2)", flex: 1 }}>
                {log.target || "\u2014"} (before {log.actualBefore} &rarr; after {log.actualAfter})
              </span>
              <button
                className="btn danger"
                style={{ padding: "4px 10px", fontSize: 12, minHeight: 30 }}
                onClick={() => deleteLog(log.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  max = 10,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  max?: number;
}) {
  return (
    <div className="field">
      <label className="field-label" style={{ marginBottom: 0 }}>
        {label}
      </label>
      <input type="number" min={0} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}
