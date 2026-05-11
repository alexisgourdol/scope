# Scope

A self-hostable, open-source single-user issue tracker — built with Claude Code.

Scope is a personal project management tool inspired by Linear's clean design, stripped down to the features that actually matter for solo work: issues, projects, statuses, and keyboard shortcuts. No accounts, no infra — just clone, set two env vars, and deploy.

## Live demo

**[scope-gamma-seven.vercel.app](https://scope-gamma-seven.vercel.app)**

Password: `scopedemo`
In demo mode, creating and modifying is restricted.

## Features

- Issues with title, description, status, and priority
- Projects with cascade filtering
- Status workflow: Backlog → Todo → In Progress → Done
- **Archive** — soft-delete issues individually or in bulk; restore at any time
- **Multi-select** — checkbox on hover, floating action bar to bulk-change status or archive
- **Board view** — Kanban layout with drag-and-drop between columns and within-column reordering
- **List / Board toggle** — preference persists across navigation via cookie
- **uaidata design system** — warm palette (amber `#F59E0B`, off-white `#FAF9F6`, near-black `#1C1C1A`), DM Sans + JetBrains Mono, full dark mode token set
- Dark mode — manual toggle in sidebar + system preference on first visit
- Keyboard shortcuts (`C` to create, `1–4` to set status, `E` to edit title)
- Responsive layout (mobile + desktop)

## Stack

| Layer     | Choice                          |
| --------- | ------------------------------- |
| Framework | Next.js 15 (App Router)         |
| Language  | TypeScript (strict)             |
| Styling   | Tailwind CSS + shadcn/ui        |
| ORM       | Drizzle                         |
| Database  | SQLite (via better-sqlite3)     |
| Hosting   | Vercel                          |

## Self-hosting

### Prerequisites

- Node.js 18+
- A [Vercel](https://vercel.com) account (free tier) — or any Node.js host

### Setup

1. Clone the repo:

   ```bash
   git clone https://github.com/alexisgourdol/scope.git
   cd scope
   npm install
   ```

2. Copy the environment template and set your passwords:

   ```bash
   cp .env.example .env.local
   ```

3. Run the dev server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) and log in with your `AUTH_SECRET`.

### Environment variables

| Variable       | Description                                |
| -------------- | ------------------------------------------ |
| `AUTH_SECRET`  | Admin password (keep private)              |
| `DEMO_SECRET`  | Read-only demo password (safe to share)    |

No database setup required — the app ships with a SQLite file at `db/seed.sqlite`.

### Deploying to Vercel

```bash
vercel deploy
```

Set `AUTH_SECRET` and optionally `DEMO_SECRET` in the Vercel project's environment variables. No other configuration needed.

## Built with Claude Code

This project was built using [Claude Code](https://claude.com/claude-code) as a pair programmer. Claude wrote the code; I reviewed every commit, tested each feature, and made all architectural decisions. The commit history reflects a ticket-by-ticket workflow — one logical change per commit.

## License

MIT
