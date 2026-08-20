export function DashboardSkeleton() {
  return (
    <>
      <div className="skel skel-hero" />
      <div className="skel-grid">
        <div className="skel skel-card" />
        <div className="skel skel-card" />
        <div className="skel skel-card" />
        <div className="skel skel-card" />
      </div>
      <div className="skel skel-card" style={{ height: 220 }} />
    </>
  );
}

export function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="skel skel-card" />
      ))}
    </>
  );
}

export function TextSkeleton() {
  return (
    <div style={{ padding: "6px 2px" }}>
      <div className="skel skel-line w60" />
      <div className="skel skel-line w40" />
      <div className="skel skel-line" style={{ width: "80%" }} />
    </div>
  );
}
