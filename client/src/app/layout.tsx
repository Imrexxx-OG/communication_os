import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Communication OS",
  description: "Personal training system for calm, English-first speech under pressure.",
  manifest: "/manifest.json"
};

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/session", label: "Today's Session" },
  { href: "/ladder", label: "Exposure Ladder" },
  { href: "/learn/1", label: "Learn" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="shell">
          <nav className="sidenav">
            <div className="brand">
              Communication <span>OS</span>
            </div>
            {NAV.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}
