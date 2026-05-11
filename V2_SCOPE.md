# V2 Scope — Scope (the app)

This file is a contract with myself. It defines exactly what V2 is, and — more importantly — what V2 is not. If I want to add something to V2 that isn't in this file, I have to come back here and explicitly edit this file with a dated note explaining why. No silent scope creep.

**Project:** Scope — a minimal, single-user issue tracker
**Build window:** TBD
**Stack:** unchanged from V1 — Next.js 15 (App Router) + TypeScript + Tailwind + shadcn/ui + Drizzle + Postgres (Supabase) + Vercel
**Last edited:** 2026-05-10 (V2.1 additions)

---

## In Scope for V2

### Design system revamp
- Replace the generic shadcn/neutral defaults with the **uaidata warm palette**: amber accent (`#F59E0B`), warm off-white background (`#FAF9F6`), warm near-black text (`#1C1C1A`)
- Full token set imported: colors, shadows (`--shadow-card`, `--shadow-cta`), radius scale (`--radius-sm` → `--radius-pill`), spacing scale
- Typography: **DM Sans** (UI text) + **JetBrains Mono** (code, kbd) loaded via Google Fonts
- Dark mode: same token names, re-mapped to uaidata dark values (`#141412` bg, `#FBBF24` amber)
- Tailwind config extended: `fontFamily`, `boxShadow`, `borderRadius`

### Archive
- Manual, per-issue or bulk soft-delete — no auto-archive timer
- **Multi-select**: checkbox appears on row hover; once 1+ issue is selected, all checkboxes stay visible
- **Floating action bar**: appears at bottom center when selection is active — shows count, status picker, archive/unarchive button, dismiss
- **Bulk status change**: same multi-select flow, same action bar — change status on N issues at once
- Archived issues hidden from all views by default
- **"Show archived" toggle** in the filter area — surfaces archived issues with unarchive action available
- DB: `archived_at timestamp` column on `issues` (nullable; `null` = active)
- API: `GET /api/issues` filters `WHERE archived_at IS NULL` by default; `?showArchived=true` inverts. New `POST /api/issues/bulk` endpoint handles `archive`, `unarchive`, `status` bulk actions

### Kanban board view
- **View toggle** in page header (List / Board) — stored in URL as `?view=board`; default is list
- 4 columns = 4 statuses: Backlog → Todo → In Progress → Done
- **Drag-and-drop** between columns to change status (`@dnd-kit/core`)
- Optimistic update on drop + server refresh on completion
- Project filter carries over from list view — same URL param, same data filter
- Archived issues never appear on the board

### Search *(V2.1 addition)*
- Search bar in the issues page header; filters by `?q=` URL param (preserved on refresh)
- Server-side filter: `WHERE title ILIKE '%q%' OR description ILIKE '%q%'`
- No schema changes — operates on existing `issues` columns

### Project archiving *(V2.1 addition)*
- Soft-delete for projects — same `archived_at` nullable timestamp pattern as issue archiving
- DB: `archived_at timestamp` column added to `projects` table (nullable; `null` = active)
- **Two-state confirmation dialog** before archiving:
  - **Warn state**: one or more issues are not Done/Archived → "X issues are still open and will be set to Archived. Proceed?"
  - **Inform state**: all issues are Done or Archived → "All issues are Done or Archived. Confirm project archiving?"
- Archived projects hidden from the projects list by default; "Show archived" toggle surfaces them
- Archiving a project also bulk-archives any open issues within it

### Project links *(V2.1 addition)*
- Attach up to 3 URLs (GitHub repo, docs, design file, etc.) with an optional label to any project
- DB: 6 nullable columns on `projects` — `link1_url`, `link1_label`, `link2_url`, `link2_label`, `link3_url`, `link3_label`
- Editable section on the project detail page (`/projects/[id]`); blank slots hidden in read mode
- Displayed as clickable links with label (or truncated URL if no label)

---

## Explicitly OUT of V2

These are not "maybe later" — they are committed-out. If I want one of them, it goes in V3_IDEAS.md, not here.

- Google SSO / any real auth → V3
- Cmd+K command palette → V3
- Multi-user / sharing / teams
- Activity log per issue → V3
- GitHub integration → V3
- Inline issue creation (press C, type, enter — no modal)
- Saved filters as named views
- Keyboard navigation between issues (J/K)
- Issue templates
- Markdown toolbar
- Subtle animations for status transitions
- Custom domains

---

## Done Definition

V2 is complete when ALL THREE are true:

1. Design revamp is live on Vercel and visually distinct from the V1 shadcn defaults
2. I can select 10 Done issues and archive them in one action without touching my keyboard
3. I can drag an issue from Backlog to In Progress on the board and see it persist after refresh

If any of these fail, I fix the existing scope. I do not add features to compensate.

---

## Scope Change Log

Any change to this file gets logged here with a date and reason.

- [2026-05-10] — Initial V2 scope locked. SSO and Cmd+K moved to V3.
- [2026-05-10] — V2.1: Added Search, Project archiving, and Project links after V2 core shipped ahead of schedule. Activity log and GitHub integration remain in V3 (non-trivial schema + integration work). Search was pulled from V3 (zero schema cost). Project archiving reuses the issue soft-delete pattern. Project links are bounded new columns on the projects table.
- [2026-05-10] — V2.1: Reworked the design to match uaidata.io 's design system. Polished color palette, animations, positions ...
- [2026-05-10] — V2.2 polish: unified page widths via PageContainer primitive (1120px / 768px / 672px), extended eyebrow breadcrumb to detail pages, and rerouted sidebar project rows from /projects/[id] to /issues?project=<id>. Latter is a UX change (one click to the filtered view), not a bug fix — logged here so the choice isn't silently reverted. Does not reopen V2 Done Definition.
- [2026-05-11] — V2.3: Swapped Postgres/Supabase for SQLite (better-sqlite3). Schema ported from pgTable to sqliteTable, timestamps as millisecond integers, enums as text. App ships with db/seed.sqlite — no external database required. Removed DATABASE_URL/DIRECT_DATABASE_URL from Vercel; only AUTH_SECRET and DEMO_SECRET remain. Repo tagged v2.0.0 and enters maintenance mode.
