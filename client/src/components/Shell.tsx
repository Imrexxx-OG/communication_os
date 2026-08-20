"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { FeedbackProvider } from "./Feedback";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "\u25A2" },
  { href: "/session", label: "Today's Session", icon: "\u25B6" },
  { href: "/ladder", label: "Exposure Ladder", icon: "\u2261" },
  { href: "/learn/1", label: "Learn", icon: "\uD83D\uDCDA", base: "/learn" },
];

export default function Shell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "/dashboard";
  const inLearn = pathname.startsWith("/learn");
  const activeModule = inLearn ? pathname.split("/")[2] : null;

  return (
    <FeedbackProvider>
      <div className="shell">
        <div className="titlebar">
          <button className="menuBtn" aria-label="Toggle navigation" onClick={() => setOpen((o) => !o)}>
            &#9776;
          </button>
          <div className="traffic">
            <span className="r" />
            <span className="y" />
            <span className="g" />
          </div>
        </div>

        {open && <div className="backdrop" onClick={() => setOpen(false)} />}

        <nav className={`sidenav ${open ? "open" : ""}`}>
          <div className="brand">
            <span className="mark" />
            Communication <span>OS</span>
          </div>
          {NAV.map((item) => {
            const active = item.base ? inLearn : pathname === item.href;
            return (
              <div key={item.href}>
                <a href={item.href} className={active ? "active" : ""} onClick={() => setOpen(false)}>
                  <span className="ico">{item.icon}</span>
                  {item.label}
                </a>
                {item.base && inLearn && (
                  <div className="sub-tabs">
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                      <a
                        key={n}
                        href={`/learn/${n}`}
                        className={String(n) === activeModule ? "active" : ""}
                        onClick={() => setOpen(false)}
                      >
                        {n}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <main className="main">
          <div key={pathname} className="page-fade">
            {children}
          </div>
        </main>
      </div>
    </FeedbackProvider>
  );
}

