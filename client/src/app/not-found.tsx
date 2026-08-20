export default function NotFound() {
  return (
    <div className="status-page">
      <div className="code">404</div>
      <h1>This page doesn&rsquo;t exist</h1>
      <p>The page you&rsquo;re looking for isn&rsquo;t part of Communication OS. It may have moved, or the link might be off.</p>
      <a href="/dashboard" className="btn solid">
        Back to Dashboard
      </a>
    </div>
  );
}
