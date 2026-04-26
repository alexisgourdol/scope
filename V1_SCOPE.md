# V1 Scope — Scope (the app)

This file is a contract with myself. It defines exactly what V1 is, and — more importantly — what V1 is not. If I want to add something to V1 that isn't in this file, I have to come back here and explicitly edit this file with a dated note explaining why. No silent scope creep.

**Project:** Scope — a minimal, single-user issue tracker
**Build window:** 14 days, ~2 hours/day
**Stack:** Next.js 15 (App Router) + TypeScript + Tailwind + shadcn/ui + Drizzle + Postgres (Supabase) + Vercel
**Last edited:** April 25, 2026

---

## In Scope for V1

### Data model
- `users` table (single row for V1, but the table exists so Phase 2 SSO is a swap, not a migration)
- `projects` table — id, name, user_id, timestamps
- `issues` table — id, title, description (markdown), status, priority, project_id, user_id, timestamps

### Issue properties
- Title (required)
- Description (markdown, optional)
- Status (enum): `backlog | todo | in_progress | done`
- Priority (enum): `none | low | medium | high | urgent`
- Project (foreign key, optional — issues can be unassigned)

### Features
- Create, read, update, delete issues
- Create, read, update, delete projects
- Main list view: all issues, grouped by status, filterable by project, sortable by priority and updated date
- Issue detail view at `/issues/[id]` — markdown rendering, edit-in-place
- Keyboard shortcuts: `C` (create), `E` (edit title), `1-4` (set status), `?` (help modal), `/` (focus filter)
- Empty states, loading states, error boundaries
- Responsive layout (works on phone browsers; not mobile-optimized)
- Dark mode (free with shadcn/ui)

### Auth
- Hardcoded placeholder auth for V1 (single user, single password or secret URL)
- Every record carries `user_id` from day one to enable Phase 2 swap

### Deployment
- Live on Vercel from day 1
- Connected to Supabase Postgres
- GitHub repo with full commit history

---

## Explicitly OUT of V1

These are not "maybe later" — they are committed-out. If I want one of them, it goes in V2_IDEAS.md, not here.

- Google SSO / any real auth (Phase 2)
- Multi-user / sharing / teams
- Cmd+K command palette
- Cycles or sprints
- Labels / tags
- Sub-issues / parent-child relationships
- Comments
- Multiple saved views
- Triage inbox
- Roadmaps
- Git/GitHub integration
- Slack/email integration
- Templates
- Time tracking
- JSON/CSV export
- Notifications (email, push, anything)
- Image uploads in descriptions
- Markdown toolbar / WYSIWYG editor
- Custom workflows or status names
- Assignees (single user — meaningless in V1)
- Due dates (intentional cut — adds nagging UX I don't want yet)
- Search (filtering is enough for V1's data volume)

---

## Done Definition

V1 is complete when ALL FOUR are true:

1. Deployed at a real URL I can put on my CV
2. Dogfooded as my actual task manager for 7 consecutive days without wanting to switch back
3. Demo-able in 60 seconds (create → status change → keyboard shortcut → list view)
4. Screenshot-worthy — the list view doesn't embarrass me

If any of these fail, I fix the existing scope. I do not add features to compensate.

---

## Scope Change Log

Any change to this file gets logged here with a date and reason. If this section has more than 2-3 entries, that's a signal I'm losing discipline.

- [2025-04-25] — Initial scope locked.
