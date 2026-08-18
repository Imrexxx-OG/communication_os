# Communication OS — full-stack edition

A personal training system for calm, English-first speech under pressure —
originally a single-file offline HTML app, rebuilt here as a real full-stack
application: **Next.js + TypeScript** (client) and **Express + TypeScript +
Prisma + PostgreSQL** (server).

This is not a redesign. Every table, field, and piece of business logic
(the editable exposure ladder, Display Order vs. computed Current Difficulty,
the structured exposure-log schema, the advisory-only recommendation engine)
is a direct port of what was already working in the offline version. The
only thing that changed is where the data lives.

## Why this stack, and a few decisions worth knowing about

- **Real Express server, not just Next.js API routes.** The brief was
  explicit about keeping Node/Express as its own layer for portfolio
  consistency, so this is two actual services — `server/` and `client/` —
  talking over HTTP, not one Next.js app pretending to be full-stack.
- **No auth in v1.** The original app has always been single-user, and
  adding accounts/login for one lifelong user is complexity with no payoff.
  `Settings` is deliberately a single row (`id = 1`). If this ever needs
  multiple users, that's the seam — add a `userId` column and a real auth
  layer then, don't build it speculatively now.
- **Static content stays in code, not the database.** The 12 learn modules,
  frameworks, role models, recovery scenarios, and FAQ never change per-user
  and are identical on every load — they're served straight from
  `server/src/data/content.ts` (ported verbatim from the working app, not
  retyped) rather than stored as rows. Putting static copy in Postgres would
  be pure overhead here.
- **Difficulty is computed, never stored.** `LadderRung.order` is the only
  thing that represents your manual Display Order, and the only route that
  ever writes to it is `PUT /api/ladder/reorder` — which only runs when you
  explicitly move something. "Current difficulty" shown next to each rung is
  calculated live from `ExposureLog` rows every time you load the ladder, so
  it can never drift out of sync with your actual logged history, and
  nothing in the backend ever reorders the ladder for you. The
  recommendation engine (`server/src/lib/recommend.ts`) only ever returns
  text.

## Project layout

```
communication/
├── server/                  Express + TypeScript + Prisma API
│   ├── prisma/schema.prisma the database schema (see its header comment)
│   ├── prisma/seed.ts       seeds the 14 default ladder rungs
│   ├── scripts/
│   │   └── import-legacy-export.ts   brings in a real export from the old app
│   └── src/
│       ├── data/content.ts  static reference content (modules, frameworks, etc.)
│       ├── lib/              validation, streak calc, recommendation engine
│       ├── routes/           one file per resource
│       └── index.ts          app entry
├── client/                  Next.js (App Router) + TypeScript
│   └── src/
│       ├── app/
│       │   ├── dashboard/    live stats + trend charts (recharts)
│       │   ├── session/      the daily routine, manual phase progression
│       │   ├── ladder/       editable ladder + exposure logging
│       │   └── learn/[num]/  generic module viewer (all 12 modules)
│       └── lib/               typed API client + shared types
└── docker-compose.yml        local Postgres, one command
```

## Setup

**1. Database**
```bash
docker compose up -d
```
This starts Postgres on `localhost:5432` with the credentials already baked
into `server/.env.example`. No Docker? Point `DATABASE_URL` at any Postgres
instance instead.

**2. Server**
```bash
cd server
cp .env.example .env
npm install
npx prisma migrate dev --name init   # creates the tables, runs the seed automatically
npm run dev                          # http://localhost:4000
```

**3. Client**
```bash
cd client
cp .env.local.example .env.local
npm install
npm run dev                          # http://localhost:3000
```

Open `http://localhost:3000` — it redirects straight to the dashboard.

## Bringing over your real data

You have real logged sessions in the offline HTML version already. Don't
start from zero:

1. Open the old app → Settings → **Export JSON**.
2. `cd server && npx tsx scripts/import-legacy-export.ts /path/to/that-export.json`

This creates fresh rows for your actual edited ladder (not the generic
defaults), remaps every exposure log to point at the right rung, and brings
across every session, reflection, and module completion. It only adds rows —
it never deletes anything already in the database.

## What was actually verified before this was handed over

- `npx tsc --noEmit` passes clean on both `server` and `client`
- `npx next build` completes a full production build, all 7 routes
- Two real bugs were caught and fixed in this process: a `tsconfig.json`
  `rootDir` conflict, and a `?? 0` fallback in the session timer that would
  have silently produced `NaN` instead of `0` on an edge case
- Dependencies were checked for known vulnerabilities, not just installed —
  the initial `next@14.2.15` pin was flagged by npm as vulnerable to the
  December 2025 React Server Components CVEs and bumped to the patched
  `14.2.35`
- **Not yet verified**: an actual live run against a real Postgres database
  (this sandbox has no Postgres instance and Prisma's engine binaries are
  blocked by network policy here) — run `npx prisma migrate dev` yourself as
  the first real test of the schema against a live database, and treat that
  as the one remaining unverified step.

## Deploying

- **Client** → Vercel is the natural fit for Next.js; set
  `NEXT_PUBLIC_API_URL` to your deployed API's URL.
- **Server** → Render, Railway, or Fly.io all work well for a small Express +
  Postgres app; most offer managed Postgres directly, which simplifies
  `DATABASE_URL` setup.
- Keep the repo **private** if you go the GitHub route — not because the
  code reveals anything sensitive on its own (your actual session/exposure
  data lives in the database, never in the repo), but because the module
  content in `content.ts` describes your specific situation in detail, and
  that's reasonably yours to keep private regardless.
