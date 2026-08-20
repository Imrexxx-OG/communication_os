"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="status-page">
      <div className="code">Something went wrong</div>
      <h1>This page hit a snag</h1>
      <p>
        {error.message || "An unexpected error occurred."} Try again, or head back to the
        dashboard.
      </p>
      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn solid" onClick={() => reset()}>
          Try again
        </button>
        <a href="/dashboard" className="btn">
          Back to Dashboard
        </a>
      </div>
    </div>
  );
}
