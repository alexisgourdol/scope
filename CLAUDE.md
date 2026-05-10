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
| Database | Postgres (local dev via Docker; Supabase in production) |
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
- `components/issue-list.tsx` — client component: checkbox on hover, floating action pill (always-dark `#1C1C1A` bg, white text, `bg-white/N` opacity buttons that work reliably with CSS variables)

### Kanban board view
- `?view=board` URL param; List/Board toggle in `components/view-toggle.tsx`
- View preference persisted via cookie `scope_view` (set client-side in ViewToggle, read server-side in the issues page — no client redirect flash)
- `components/kanban-view.tsx`: 4 status columns, `@dnd-kit/sortable` for drag-and-drop both between columns (status change → PATCH API) and within columns (local state reorder, no DB write)
- Priority dot vertically centered with card title; project name indented `pl-[18px]` to align under title

## What is NOT in scope yet (V3)

Do not implement these unless the user explicitly starts V3:

- **Google SSO** via Supabase Auth — `user_id` is already on every row, so the migration is a swap
- **Cmd+K command palette**
- Multi-user / sharing / teams
- Search, saved filters, activity log, GitHub integration

Full V3 backlog in [`V3_IDEAS.md`](./V3_IDEAS.md).

## Key components

| File | Role |
|---|---|
| `app/(app)/issues/page.tsx` | Server component — fetches issues, reads `scope_view` cookie, renders IssueList or KanbanView |
| `components/issue-list.tsx` | Client — grouped list view, multi-select, floating bulk action bar |
| `components/kanban-view.tsx` | Client — dnd-kit sortable kanban, optimistic status updates |
| `components/view-toggle.tsx` | Client — List/Board toggle, writes `scope_view` cookie |
| `components/theme-toggle.tsx` | Client — moon/sun icon button, toggles `dark` class on `<html>`, persists to `localStorage` |
| `components/sidebar.tsx` | Client — nav, project list, theme toggle in header |
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

Local dev DB runs in a Docker sidecar at `db:5432`. Production is Supabase Postgres. See `.env.example` for required env vars.
