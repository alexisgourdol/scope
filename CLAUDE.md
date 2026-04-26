# Scope — Claude Context

## Project

Scope is a minimal, single-user issue tracker built as a 14-day personal project. The goal: a real, deployed tool I can dogfood and put on my CV — not a toy, not a kitchen sink.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + shadcn/ui |
| ORM | Drizzle ORM |
| Database | Postgres (local dev via Docker; Supabase in production) |
| Deployment | Vercel (set up at end of Day 1) |

shadcn components live in `components/ui/`. Database schema and connection in `db/`. App Router pages under `app/`.

## Scope Contract

**V1 scope is defined in [`V1_SCOPE.md`](./V1_SCOPE.md).** That file is a binding contract. If a requested feature isn't in there, push back and suggest it goes in [`V2_IDEAS.md`](./V2_IDEAS.md) instead.

## Auth

Auth is a **Phase 2 concern**. Do not implement real auth for V1. The plan is hardcoded placeholder auth (single user, secret URL or simple password). Every DB table carries a `user_id` column from day one so Phase 2 is a swap, not a migration.

## Commit Convention

- Work ticket-by-ticket: one logical change per commit, reviewable diffs.
- Commit messages: imperative mood, ≤72 chars subject line.
- No "WIP" commits on main.

## Dev Commands

```bash
npm run dev          # Start Next.js dev server on :3000
npm run build        # Production build
npm run lint         # ESLint
npm run db:generate  # Generate Drizzle migration files
npm run db:migrate   # Apply migrations to the database
npm run db:studio    # Open Drizzle Studio (DB browser)
```

## Environment

Local dev DB runs in a Docker sidecar at `db:5432`. See `.env.example` for required env vars.
