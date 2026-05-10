# V2 Scope — Scope (the app)

This file is a contract with myself. It defines exactly what V2 is, and — more importantly — what V2 is not. If I want to add something to V2 that isn't in this file, I have to come back here and explicitly edit this file with a dated note explaining why. No silent scope creep.

**Project:** Scope — a minimal, single-user issue tracker
**Build window:** TBD
**Stack:** unchanged from V1 — Next.js 15 (App Router) + TypeScript + Tailwind + shadcn/ui + Drizzle + Postgres (Supabase) + Vercel
**Last edited:** 2026-05-10

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

---

## Explicitly OUT of V2

These are not "maybe later" — they are committed-out. If I want one of them, it goes in V3_IDEAS.md, not here.

- Google SSO / any real auth → V3
- Cmd+K command palette → V3
- Multi-user / sharing / teams
- Activity log per issue
- GitHub integration
- Search
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
