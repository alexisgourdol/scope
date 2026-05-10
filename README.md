# Scope

A minimal, single-user issue tracker — built with Claude Code.

Scope is a personal project management tool inspired by Linear's clean design, stripped down to the features that actually matter for solo work: issues, projects, statuses, and keyboard shortcuts. Nothing more.

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

| Layer     | Choice                                            |
| --------- | ------------------------------------------------- |
| Framework | Next.js 15 (App Router)                           |
| Language  | TypeScript (strict)                               |
| Styling   | Tailwind CSS + shadcn/ui                          |
| ORM       | Drizzle                                           |
| Database  | Postgres (Supabase in production, Docker locally) |
| Hosting   | Vercel                                            |

## Getting started

### Prerequisites

- Docker Desktop
- VS Code with the [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension
- A [Supabase](https://supabase.com) account (free tier)
- A [Vercel](https://vercel.com) account (free tier)

### Setup

1. Clone the repo and open in VS Code — reopen in the devcontainer when prompted:

   ```bash
   git clone https://github.com/alexisgourdol/scope.git
   cd scope
   ```

2. Copy the environment template and fill in your credentials:

   ```bash
   cp .env.example .env.local
   ```

3. Run the dev server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable            | Description                                    |
| ------------------- | ---------------------------------------------- |
| `DATABASE_URL`      | Postgres connection string (pooled, port 6543) |
| `DIRECT_DATABASE_URL` | Postgres connection string (direct, port 5432) |
| `AUTH_SECRET`       | Admin password (keep private)                  |
| `DEMO_SECRET`       | Read-only demo password (safe to share)        |

## Built with Claude Code

This project was built using [Claude Code](https://claude.com/claude-code) as a pair programmer. Claude wrote the code; I reviewed every commit, tested each feature, and made all architectural decisions. The commit history reflects a ticket-by-ticket workflow — one logical change per commit.

## License

MIT
