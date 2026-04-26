# Linear Clone — Personal Project Plan

## Goal

Build a simpler, web-based, single-user version of Linear in 2 weeks using Claude Code as the primary code author — producing a portfolio-ready artifact that demonstrates effective AI-assisted development, with a clear Phase 2 path to add Google SSO.

## Context

This is a personal project for one developer (you), built primarily as a portfolio piece to showcase skill at directing Claude Code to produce real applications. Secondary goals: learn the standard modern web stack deeply enough to apply it to future client work (websites, SSO implementations), and have a personal task manager you actually want to use. Monetization is not a v1 concern but the architecture should not preclude it later.

The defining constraint is the working style: Claude Code writes the code, you review and test each commit. You are the senior dev approving PRs from a junior, not the typist. This shapes every choice below — small commits over large ones, strong typing to catch Claude's mistakes, opinionated frameworks that minimize the surface area of choices.

## Process Overview

1. **Day 1, Session 1 (autonomous)** — Scaffold the project: Next.js + TypeScript + Tailwind + shadcn/ui + Drizzle + Supabase connection, deployed to Vercel with a real URL on day one.
2. **Day 1-2 (ticket-by-ticket)** — Data model: define Issues and Projects schema in Drizzle, run first migration, seed with test data.
3. **Day 3-5 (ticket-by-ticket)** — Core CRUD: create/edit/delete issues, status changes, project creation. Server actions for mutations.
4. **Day 6-7 (ticket-by-ticket)** — The list view: filterable table of issues, grouping by status, sort by priority/date.
5. **Day 8-9 (ticket-by-ticket)** — Issue detail view: markdown rendering, edit-in-place, status/priority dropdowns.
6. **Day 10 (fun reward)** — Keyboard shortcuts: create issue, change status, navigate. Use `react-hotkeys-hook` or similar.
7. **Day 11-12** — Polish: empty states, loading states, error boundaries, responsive layout for phone browsers.
8. **Day 13** — Begin 7-day dogfooding window. Use it as your real task manager. Track friction points in a `BUGS.md` file.
9. **Day 14 onward** — Fix only the friction points that emerged during dogfooding. Do NOT add new features. When dogfooding completes successfully (day 20 calendar), v1 is done.

## Detailed Steps

### Step 1: Project Scaffolding (Day 1, autonomous)

**What happens:** Run a single Claude Code session with a complete setup prompt. Initialize Next.js 15 project with App Router, install dependencies, configure Tailwind, install shadcn/ui base components (button, input, dialog, dropdown-menu, table), set up Drizzle with Postgres dialect, create a Supabase project, wire up the connection, deploy a "Hello World" page to Vercel.

**Input:** Empty directory, your GitHub account, Vercel account, Supabase account.

**Output:** A live URL on Vercel showing a placeholder page, a working local dev environment, a connected (empty) Supabase database, the project pushed to a GitHub repo.

**Decisions:**
- App Router (not Pages Router) — modern default, better Claude support.
- Drizzle over Prisma — lighter, faster, Claude handles it well. (Reversible if you hate it.)
- Server Actions for mutations, not API routes — fewer files, modern Next.js pattern.

**Owner:** You drive Claude Code. This is the one session where you let it run mostly autonomously — review at the end, not after each step.

**Notes:** **Critical defense against scope creep starts here.** Before this session, write `V1_SCOPE.md` in the repo with the exact feature list from "Done Definition" below. Commit it. Treat any change to that file as a deliberate decision, not a drift.

### Step 2: Data Model (Days 1-2)

**What happens:** Define the Drizzle schema for `users`, `projects`, and `issues`. Even though there's only one user, the `users` table exists from day one with a `user_id` foreign key on every other table — this makes Phase 2 (Google SSO) a small change instead of a migration nightmare. Run the first migration. Seed with 5-10 test issues across 2 projects.

**Input:** Project structure from Step 1.

**Output:** `schema.ts` file with three tables, generated migration files committed, seed script that produces predictable test data.

**Decisions:**
- `issues.status`: enum of `backlog | todo | in_progress | done`. No customization.
- `issues.priority`: enum of `none | low | medium | high | urgent`. Same as Linear's set.
- `issues.description`: text field, markdown stored as raw text, rendered on display.
- IDs: use `uuid` for portability, not auto-increment integers.

**Owner:** Ticket-by-ticket. One commit for the schema, one for the migration, one for the seed script. Review each.

**Notes:** Resist the urge to add fields "just in case" (assignee, due_date, labels, etc.). They're explicitly out of scope. If you want them later, add them later — that's what migrations are for.

### Step 3: Core CRUD (Days 3-5)

**What happens:** Build the server actions and UI flows for creating, reading, updating, and deleting issues and projects. Each action is its own ticket. Forms use shadcn/ui components. Validation with Zod.

**Input:** Working data model from Step 2.

**Output:** Working CRUD on a basic UI — not pretty yet, but functional. You can create an issue from a form, see it appear in a list, click it, edit it, change its status, delete it.

**Decisions:**
- Optimistic updates: yes for status changes (feels Linear-like), no for create/delete (cleaner mental model).
- Soft delete vs hard delete: hard delete for v1. Single user, no recovery needed. Add soft delete later if you want it.
- Form library: react-hook-form + Zod resolvers. Standard in this stack.

**Owner:** Strict ticket-by-ticket. Each commit should be reviewable in under 5 minutes.

**Notes:** This is the boring middle. This is also where projects die. **If you find yourself slowing down here, that's the danger zone — push through.** The reward is at Step 6 (keyboard shortcuts), not here.

### Step 4: List View (Days 6-7)

**What happens:** Build the main app view — a table of all issues with grouping by status, filtering by project, sorting by priority and updated date. This is the screen you'll spend 90% of your time on.

**Input:** Working CRUD from Step 3.

**Output:** A polished list view that looks recognizably Linear-shaped. Each row shows status icon, priority indicator, title, project tag, updated time.

**Decisions:**
- Grouping: collapsible sections per status, like Linear's main view.
- Filter UI: a dropdown menu of projects, multi-select.
- Empty state: design a real one ("No issues yet — press C to create your first one"), not just whitespace. This sells the polish.

**Owner:** Ticket-by-ticket. Probably 4-5 commits across the two days.

**Notes:** This is the screenshot. Whatever you put in your portfolio will likely be a picture of this view. Spend the polish budget here.

### Step 5: Detail View (Days 8-9)

**What happens:** Click an issue, see its full detail page. Markdown description rendered with `react-markdown`, edit in place, status/priority/project changeable from the detail view. URL is `/issues/[id]` so detail pages are linkable.

**Input:** List view from Step 4.

**Output:** A working detail page accessible by clicking from the list or by direct URL.

**Decisions:**
- Edit mode: click-to-edit on title and description, dropdowns for status/priority/project (always editable, no edit mode toggle).
- Markdown: support basic syntax (headers, lists, code blocks, links). No image uploads in v1.
- Back navigation: explicit back button, not just browser back. Better UX.

**Owner:** Ticket-by-ticket.

**Notes:** Don't get sucked into a full markdown editor with toolbars. Plain textarea + live preview is fine for v1.

### Step 6: Keyboard Shortcuts (Day 10) — The Reward

**What happens:** Add the 5-6 most useful keyboard shortcuts. This is the structurally-placed motivation reward to power you through the dogfooding phase.

**Input:** Working app from Step 5.

**Output:** Keyboard shortcuts for: `C` (create issue), `E` (edit current issue title), `1-4` (set status when issue is focused), `?` (show shortcut help modal), `/` (focus filter input).

**Decisions:**
- Library: `react-hotkeys-hook` — well-maintained, plays nicely with React.
- Help modal: pressing `?` shows a list of all shortcuts. Adds polish, easy to build.
- Scope: only on the list view and detail view, not on forms (where shortcuts conflict with typing).

**Owner:** Ticket-by-ticket. Should take half a session — easy and fun, which is the point.

**Notes:** This is also a great commit to record a screen capture of for your portfolio. "Demo of keyboard navigation" reads as professional and Linear-coded.

### Step 7: Polish (Days 11-12)

**What happens:** Empty states, loading states, error boundaries, mobile responsive layout, dark mode (Tailwind makes this nearly free with shadcn).

**Input:** Functionally complete app.

**Output:** App that doesn't visibly break on any path — slow network, no data, JS error, narrow viewport.

**Decisions:**
- Dark mode: yes. shadcn/ui supports it via CSS variables; Claude can toggle it on in one commit. Worth it for screenshots.
- Mobile: responsive only, not mobile-optimized. The list view should be readable and the detail view should work. No need for a mobile-first redesign.
- Errors: a global error boundary + per-route error pages. Generic messages are fine.

**Owner:** Ticket-by-ticket but smaller commits — these are 5-15 minute fixes each.

**Notes:** Set a hard time-box. Polish has no natural ceiling — you can polish for months. Two days, then stop, even if you see things you'd want to fix.

### Step 8: Dogfooding (Days 13-19, 7 calendar days)

**What happens:** Stop adding features. Use the app as your real task manager for 7 consecutive days. Migrate your actual current todos in. Track friction in `BUGS.md` — anything that annoys you, breaks, or feels wrong.

**Input:** Polished app from Step 7.

**Output:** A list of real friction points discovered through actual use, not speculation.

**Decisions:**
- What counts as a fix vs a feature: anything in `BUGS.md` that's about something already built being broken or annoying = fix. Anything that's "I wish it also did X" = NOT in v1, write it in `V2_IDEAS.md` and move on.
- If you can't dogfood for a full 7 days because the app is too broken to use: that's a signal to fix critical bugs, not to ship anyway.

**Owner:** You, as a user. No Claude Code sessions during this week unless fixing a bug from the list.

**Notes:** **This is the actual quality bar.** A working feature list means nothing if you don't want to use the app. The 7-day dogfooding test is the difference between "portfolio piece" and "abandoned side project."

### Step 9: Fix Friction (Day 20)

**What happens:** One final session to fix the top 3-5 items from `BUGS.md`. Anything else gets pushed to v2 or deferred indefinitely.

**Input:** `BUGS.md` from dogfooding.

**Output:** v1 declared done. Update README with screenshots, deployment URL, tech stack summary, and "Built with Claude Code in 14 days" tagline. Tweet/post if you want.

**Owner:** Ticket-by-ticket, one commit per fix.

**Notes:** When this is done, **stop**. The Phase 2 Google SSO project is a separate calendar event, not a continuation of this one. Closing v1 cleanly is part of the portfolio narrative.

## Edge Cases and Failure Modes

- **Scope creep mid-project:** If you find yourself wanting to add a feature mid-build, write it in `V2_IDEAS.md` and continue with v1. The presence of `V2_IDEAS.md` is the pressure release valve — ideas don't get lost, they get parked.
- **Claude generates broken code you can't debug:** Three responses in order: (1) ask Claude to explain what the code does, line by line; (2) ask Claude to write a smaller version that does just one thing; (3) revert the commit and re-prompt with more constraints. TypeScript catches a lot before this happens.
- **Database schema needs to change after data exists:** You're the only user — `DROP TABLE` is a legitimate option for v1. Drizzle Kit makes migrations easy if you want to do it properly, but don't agonize over it.
- **You miss a day:** Don't try to make it up by doubling on the next day. Just continue. Two-hour sessions, daily, with gaps, is fine. Two four-hour sessions to "catch up" lead to bad decisions.
- **You miss a week:** This is the real failure mode. Rule: if you miss more than 3 consecutive days, do a 30-minute "re-onboarding" session — re-read this plan, the README, and the last 5 commits before writing any code. Don't try to remember from memory.
- **Vercel deployment breaks:** Most likely cause is environment variables (Supabase connection string). Check Vercel project settings first. Second most likely: a build error from a Claude commit that worked locally but breaks in CI — read the build log carefully, it'll tell you the line.
- **You finish early:** Don't add features. Either start dogfooding earlier (good) or start the Phase 2 SSO project as a separate effort (also good). Adding features extends v1 and weakens the portfolio narrative ("built in 14 days" beats "built over 6 weeks").
- **You hate the result:** Walk away for 3 days, then look again. If you still hate it, the problem is usually visual polish, which is the cheapest thing to fix. Spend a session on typography and spacing before declaring it a failure.

## Dependencies and Requirements

- GitHub account with a new empty repo
- Vercel account (free tier sufficient)
- Supabase account (free tier sufficient)
- Node.js 20+ installed locally
- Claude Code CLI installed and authenticated
- A code editor (VS Code recommended for Claude Code integration)
- Approximately 28 hours of focused time across 14 calendar days
- Discipline to follow ticket-by-ticket review even when it feels slower

## Open Questions

- None at the time of plan finalization. All major decisions are resolved.
- Items deferred to Phase 2 (separate project): Google SSO, multi-user support, multi-device-by-user-account.
- Items explicitly out of scope and parked in `V2_IDEAS.md` (to be created on Day 1): Cmd+K command palette, cycles/sprints, labels, sub-issues, comments, multiple saved views, triage inbox, integrations, templates, time tracking, JSON export.

## Success Criteria

V1 is complete when **all four** of the following are true:

1. **Deployed at a real URL** suitable for putting on your CV and linking from your portfolio.
2. **Dogfooded as your actual task manager for 7 consecutive days** without you wanting to switch back to your previous tool.
3. **Demo-able in 60 seconds** — you can show someone the create-issue → status-change → keyboard-shortcut → list-view loop without anything embarrassing happening.
4. **Screenshot-worthy** — at least one view (probably the list view) looks polished enough that a screenshot in your portfolio reads as "I know what I'm doing" rather than "this is a tutorial project."

If any of these are not met, v1 is not done — but you also do not extend the feature list. You either fix what makes the existing scope fail the bar, or you accept the project as a learning exercise rather than a portfolio piece. Adding features to compensate for unmet quality bars is the failure mode.
