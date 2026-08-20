"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

type ToastItem = {
  id: number;
  message: string;
  kind: "success" | "error";
};

type Dialog =
  | {
      type: "confirm";
      message: string;
      resolve: (value: boolean) => void;
    }
  | {
      type: "prompt";
      message: string;
      defaultValue: string;
      resolve: (value: string | null) => void;
    }
  | null;

type FeedbackContextType = {
  toast: (message: string, kind?: "success" | "error") => void;
  confirmDialog: (message: string) => Promise<boolean>;
  promptDialog: (
    message: string,
    defaultValue?: string
  ) => Promise<string | null>;
};

const FeedbackContext = createContext<FeedbackContextType | null>(null);

export function useFeedback() {
  const context = useContext(FeedbackContext);

  if (!context) {
    throw new Error("useFeedback must be used within FeedbackProvider");
  }

  return context;
}

let idCounter = 0;

export function FeedbackProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [promptValue, setPromptValue] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const toast = useCallback(
    (message: string, kind: "success" | "error" = "success") => {
      const id = ++idCounter;

      setToasts((currentToasts) => [
        ...currentToasts,
        {
          id,
          message,
          kind,
        },
      ]);

      window.setTimeout(() => {
        setToasts((currentToasts) =>
          currentToasts.filter((toastItem) => toastItem.id !== id)
        );
      }, 3200);
    },
    []
  );

  const confirmDialog = useCallback((message: string) => {
    return new Promise<boolean>((resolve) => {
      setDialog({
        type: "confirm",
        message,
        resolve,
      });
    });
  }, []);

  const promptDialog = useCallback(
    (message: string, defaultValue = "") => {
      setPromptValue(defaultValue);

      return new Promise<string | null>((resolve) => {
        setDialog({
          type: "prompt",
          message,
          defaultValue,
          resolve,
        });
      });
    },
    []
  );

  function closeConfirm(result: boolean) {
    if (dialog?.type === "confirm") {
      dialog.resolve(result);
    }

    setDialog(null);
  }

  function closePrompt(result: string | null) {
    if (dialog?.type === "prompt") {
      dialog.resolve(result);
    }

    setPromptValue("");
    setDialog(null);
  }

  const overlay = (
    <>
      <div className="toast-stack" aria-live="polite">
        {toasts.map((toastItem) => (
          <div
            key={toastItem.id}
            className={`toast-item${
              toastItem.kind === "error" ? " error" : ""
            }`}
          >
            {toastItem.message}
          </div>
        ))}
      </div>

      {dialog?.type === "confirm" && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => closeConfirm(false)}
        >
          <div
            className="modal-box"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <p>{dialog.message}</p>

            <div className="modal-actions">
              <button
                type="button"
                className="btn"
                onClick={() => closeConfirm(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn danger"
                onClick={() => closeConfirm(true)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {dialog?.type === "prompt" && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => closePrompt(null)}
        >
          <div
            className="modal-box"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <p>{dialog.message}</p>

            <input
              autoFocus
              value={promptValue}
              onChange={(event) => setPromptValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  closePrompt(promptValue);
                }

                if (event.key === "Escape") {
                  closePrompt(null);
                }
              }}
              style={{
                width: "100%",
                marginTop: 12,
                marginBottom: 4,
              }}
            />

            <div className="modal-actions">
              <button
                type="button"
                className="btn"
                onClick={() => closePrompt(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn solid"
                onClick={() => closePrompt(promptValue)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <FeedbackContext.Provider
      value={{
        toast,
        confirmDialog,
        promptDialog,
      }}
    >
      {children}

      {mounted ? createPortal(overlay, document.body) : null}
    </FeedbackContext.Provider>
  );
}