# Scope — Claude Context

## Project

Scope is a minimal, single-user issue tracker built as a personal portfolio project. The goal: a real, deployed tool I can dogfood and put on my CV — not a toy, not a kitchen sink.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + shadcn/ui |
| ORM | Drizzle ORM |
| Database | SQLite via `better-sqlite3` — file at `db/seed.sqlite`, no external service |
| Deployment | Vercel |

shadcn components live in `components/ui/`. Database schema and connection in `db/`. App Router pages under `app/`.

## What is shipped (V2)

All three V2 milestones are complete and live on Vercel. Full contract in [`V2_SCOPE.md`](./V2_SCOPE.md).

### Design system
- **uaidata warm palette** imported into `app/globals.css`: amber `#F59E0B`, off-white `#FAF9F6`, warm near-black `#1C1C1A`
- Full dark mode token set (exact hex values matching uaidata.css, not oklch approximations)
- **DM Sans** (UI) + **JetBrains Mono** (mono) via Google Fonts in `app/layout.tsx`
- Dark mode: manual toggle (`components/theme-toggle.tsx` in sidebar) + system preference on first visit; preference saved to `localStorage`
- Tailwind config extended with `fontFamily`, `boxShadow`, `borderRadius` in `tailwind.config.ts`

### Archive + multi-select
- `archived_at` nullable timestamp on the `issues` table (migration `drizzle/0002_strong_the_hand.sql`)
- `GET /api/issues` filters `WHERE archived_at IS NULL` by default; `?showArchived=true` inverts
- `POST /api/issues/bulk` handles `archive`, `unarchive`, `status` bulk actions
- `components/issue-list.tsx` — client component: checkbox on hover, floating action pill (always-dark via `bg-surface-invert` token, white text, `bg-white/N` opacity buttons that work reliably with CSS variables)

### Kanban board view
- `?view=board` URL param; List/Board toggle in `components/view-toggle.tsx`
- View preference persisted via cookie `scope_view` (set client-side in ViewToggle, read server-side in the issues page — no client redirect flash)
- `components/kanban-view.tsx`: 4 status columns, `@dnd-kit/sortable` for drag-and-drop both between columns (status change → PATCH API) and within columns (local state reorder, no DB write)
- Priority dot vertically centered with card title; project name indented `pl-[18px]` to align under title

## Design decisions (read before the next design sprint)

Decisions that aren't obvious from the code and should not be re-litigated without a reason. Tokens live in `app/globals.css`; Tailwind utilities in `tailwind.config.ts`.

### `--surface-invert` dark value is `#2E2D2A`, not the documented uaidata `#0D0D0B`
The uaidata design system documents `#0D0D0B` for always-dark surfaces — but that value is calibrated for **full-bleed** sections (stats bar, footer) that sit *below* the page background and read as a "well." Scope's only always-dark surface today is the **floating action pill**, which is an overlay that needs to *lift off* the dark page bg (`#141412`), not sink into it. `#2E2D2A` sits one notch above the page bg, giving the pill the elevation a floating overlay needs. If a future pass adds a real full-bleed always-dark section (V3 footer, hero variant), split into two tokens: `--surface-invert` (full-bleed, `#0D0D0B`) and `--surface-overlay-dark` (floating, `#2E2D2A`).

### Status colors are semantic, not Linear-style restraint
`--status-todo` is **indigo** (`#6366F1` / `#818CF8`) and `--status-done` is **teal** (`#0D9488` / `#14B8A6`), pulled from the uaidata portfolio-bar palette. This deliberately diverges from Linear's "all four statuses are gray-with-subtle-distinction" treatment. The intent is to make Scope read as a uaidata product rather than a Linear clone. If a future pass wants to dial restraint back up, change those two tokens in `app/globals.css` — no component edits needed.

### Dates in the issue list stay relative + mono — not absolute uppercase
The uaidata blog-card pattern uses `MAY 10` (mono, uppercase, absolute). The issue list uses `formatRelative` (`3d ago`, `today`, `2w ago`) because relative reading is faster in a productivity tool — answers "is this stale?" at a glance. Mono treatment applied to match the uaidata hand; uppercase dropped because `"3D AGO"` reads shouty in dense rows. If a future pass wants absolute mono-uppercase dates, treat it as a UX decision (relative-vs-absolute is the real question), not a styling tweak.

### Status group eyebrows live only on the list view
The mono amber eyebrows (`BACKLOG`, `TODO`, `IN PROGRESS`, `DONE`) appear above each group in `components/issue-list.tsx`. **Not** applied to Kanban column headers in `components/kanban-view.tsx` — the column container already provides separation, and the colored `IssueStatusIcon` next to the label makes an additional amber eyebrow feel redundant. Apply selectively if eyebrows go elsewhere; don't make it a uniform rule.

### Short issue IDs (`SCP-42`) are deliberately absent
Considered in the V2.5 plan but skipped: the schema stores only UUIDs and the UI never displays them. Adding short IDs is a schema decision (new column? computed from row order?), not a styling decision — defer to a dedicated pass. Don't reach for mono ID styling without resolving the data model question first.

### Page width tiers go through `PageContainer`, not raw Tailwind utilities
Three widths, three intents, all centered: `narrow` (672px, reading — issue detail), `default` (768px, scanning lists — projects), `wide` (1120px, data density — issues list + Kanban). The 1120px value is the uaidata canonical `--max-width`. Every page **and its loading skeleton** uses the same width so first paint never reflows. If a new page needs a different width, add a fourth variant to `components/ui/page-container.tsx` rather than reaching for `max-w-*` directly — that's how the previous drift happened (`max-w-3xl` / `max-w-4xl` / `max-w-5xl` scattered across files, `/projects/[id]` missing `mx-auto` entirely).

### Sidebar project rows are filter shortcuts, not detail links
The per-project rows in the sidebar link to `/issues?project=<id>`, not `/projects/<id>`. The mental model: **Issues is the work surface; Projects is administration.** A user clicking "ProjectA" in the sidebar wants to see ProjectA's issues, not edit ProjectA's link slots. Project detail (`/projects/[id]`) is still reachable via the Projects list row. If a future pass wants project detail front-and-center (e.g. a project becomes a dashboard with stats + recent activity), reconsider — but don't revert silently. Active-state for project rows lights up only when `pathname === "/issues" && searchParam("project") === <id>`.

### Eyebrows say SCOPE, not WORKSPACE
The top breadcrumb segment is the brand (`SCOPE / ISSUES`, `SCOPE / PROJECTS / Project name`), not the generic `WORKSPACE` placeholder. Single-user app — there is no workspace concept to disambiguate. Detail pages extend to three segments and all non-terminal segments are clickable Links. Pattern is in `components/ui/eyebrow.tsx`; don't hand-roll the mono-amber `<p>` again.

### Verification protocol for any design change
Toggle dark mode and walk this path in both modes, plus a 375px and 768px viewport check:
1. **List view** → select 2+ issues → confirm the floating pill is dark, white text legible, opacity buttons feel solid.
2. **Board view** → confirm status icons read as indigo / amber / teal / muted (not green / yellow).
3. **/projects** with an open-issue project → click archive → the warning callout and "Archive anyway" button should feel like one warm amber family, not a stack of separate amber utilities.
4. Eyebrows wrap gracefully at narrow widths; no horizontal overflow.
5. **Page width**: navigate `/issues` → `/issues/[id]` → `/projects` → `/projects/[id]` at ≥1280px. Each page is centered; container width changes only at expected boundaries (wide → narrow → default → default). No left-pinned pages, no reflow when a skeleton swaps to real content.
6. **Sidebar nav**: at `/projects/abc`, only the project-list row highlights — not the top-level "Projects" link. At `/issues?project=abc`, only the project-list row highlights — not "Issues".

## Maintenance mode

This repo is in maintenance mode after V2.0.0. No further feature work is planned here. V3 and beyond live in a separate private repo. If asked to start new features, stop and confirm with the user first.

## Key components

| File | Role |
|---|---|
| `app/(app)/issues/page.tsx` | Server component — fetches issues, reads `scope_view` cookie, renders IssueList or KanbanView |
| `components/issue-list.tsx` | Client — grouped list view, multi-select, floating bulk action bar |
| `components/kanban-view.tsx` | Client — dnd-kit sortable kanban, optimistic status updates |
| `components/view-toggle.tsx` | Client — List/Board toggle, writes `scope_view` cookie |
| `components/theme-toggle.tsx` | Client — moon/sun icon button, toggles `dark` class on `<html>`, persists to `localStorage` |
| `components/sidebar.tsx` | Client — nav, project filter shortcuts, theme toggle in header |
| `components/ui/page-container.tsx` | Centered page wrapper with `narrow` / `default` / `wide` variants — used by every page + matching loading skeleton |
| `components/ui/eyebrow.tsx` | Mono-amber breadcrumb (`SCOPE / ISSUES / Project name`) with clickable non-terminal segments |
| `app/api/issues/route.ts` | GET (list with archive filter) + POST (create) |
| `app/api/issues/bulk/route.ts` | POST — archive / unarchive / bulk status |
| `app/api/issues/[id]/route.ts` | GET / PATCH / DELETE single issue |
| `db/schema.ts` | Drizzle schema — projects + issues (including `archivedAt`) |
| `app/globals.css` | uaidata design tokens (light + dark), Tailwind base overrides |
| `tailwind.config.ts` | Color, radius, shadow extensions |

## Auth

Single-user app. Auth is a hardcoded `USER_ID` constant in `lib/auth.ts`. Demo mode (read-only) is triggered by a separate `DEMO_SECRET` env var. Real Google SSO is V3.

## Commit convention

- Conventional Commits: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`
- One logical change per commit, ≤72 char subject line
- No "WIP" commits on main

## Dev commands

```bash
npm run dev          # Start Next.js dev server on :3000
npm run build        # Production build
npm run lint         # ESLint
npm run db:generate  # Generate Drizzle migration files
npm run db:migrate   # Apply migrations to the database
npm run db:studio    # Open Drizzle Studio (DB browser)
```

## Environment

No external database required. The app reads from `db/seed.sqlite` by default (override with `DB_PATH` env var). Only two env vars are needed:

| Variable      | Description                             |
|---------------|-----------------------------------------|
| `AUTH_SECRET` | Admin password (keep private)           |
| `DEMO_SECRET` | Read-only demo password (safe to share) |
