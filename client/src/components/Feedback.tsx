"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";

type ToastItem = { id: number; message: string; kind: "success" | "error" };

type Dialog =
  | { type: "confirm"; message: string; resolve: (v: boolean) => void }
  | { type: "prompt"; message: string; defaultValue: string; resolve: (v: string | null) => void }
  | null;

type FeedbackContextType = {
  toast: (message: string, kind?: "success" | "error") => void;
  confirmDialog: (message: string) => Promise<boolean>;
  promptDialog: (message: string, defaultValue?: string) => Promise<string | null>;
};

const FeedbackContext = createContext<FeedbackContextType | null>(null);

export function useFeedback() {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error("useFeedback must be used within FeedbackProvider");
  return ctx;
}

let idCounter = 0;

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  // Only ever one dialog at a time -- opening a new one always replaces
  // whatever was open, so a confirm and a prompt can never show together.
  const [dialog, setDialog] = useState<Dialog>(null);
  const [promptValue, setPromptValue] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const toast = useCallback((message: string, kind: "success" | "error" = "success") => {
    const id = ++idCounter;
    setToasts((t) => [...t, { id, message, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const confirmDialog = useCallback((message: string) => {
    return new Promise<boolean>((resolve) => {
      setDialog({ type: "confirm", message, resolve });
    });
  }, []);

  const promptDialog = useCallback((message: string, defaultValue = "") => {
    setPromptValue(defaultValue);
    return new Promise<string | null>((resolve) => {
      setDialog({ type: "prompt", message, defaultValue, resolve });
    });
  }, []);

  function closeDialog(result: any) {
    if (dialog) dialog.resolve(result);
    setDialog(null);
  }

  const overlay = (
    <>
      <div className="toast-stack" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast-item${t.kind === "error" ? " error" : ""}`}>
            {t.message}
          </div>
        ))}
      </div>

      {dialog?.type === "confirm" && (
        <div className="modal-backdrop" onClick={() => closeDialog(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <p>{dialog.message}</p>
            <div className="modal-actions">
              <button className="btn" onClick={() => closeDialog(false)}>
                Cancel
              </button>
              <button className="btn danger" onClick={() => closeDialog(true)}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {dialog?.type === "prompt" && (
        <div className="modal-backdrop" onClick={() => closeDialog(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <p>{dialog.message}</p>
            <input
              autoFocus
              value={promptValue}
              onChange={(e) => setPromptValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") closeDialog(promptValue);
                if (e.key === "Escape") closeDialog(null);
              }}
              style={{ width: "100%", marginTop: 12, marginBottom: 4 }}
            />
            <div className="modal-actions">
              <button className="btn" onClick={() => closeDialog(null)}>
                Cancel
              </button>
              <button className="btn solid" onClick={() => closeDialog(promptValue)}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <FeedbackContext.Provider value={{ toast, confirmDialog, promptDialog }}>
      {children}
      {mounted ? createPortal(overlay, document.body) : null}
    </FeedbackContext.Provider>
  );
}
