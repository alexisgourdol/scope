# 🔭 Scope

A minimal, single-user issue tracker — built in ~~14~~ 2 days with Claude Code.

Scope is a personal project management tool inspired by Linear's clean design, stripped down to the features that actually matter for solo work: issues, projects, statuses, and keyboard shortcuts. Nothing more.

## Live demo

**[scope-gamma-seven.vercel.app](https://scope-gamma-seven.vercel.app)**

Password: `scopedemo`
In demo mode, creating and modifying is restricted

## Features

- Issues with title, description, status, and priority
- Projects with cascade filtering
- Status workflow: Backlog → Todo → In Progress → Done
- Keyboard shortcuts (`C` to create, `1–4` to set status, `E` to edit title)
- Filterable issue list by project
- Dark mode (follows system preference)
- Responsive layout (mobile + desktop)

## Stack

| Layer     | Choice                                            |
| --------- | ------------------------------------------------- |
| Framework | Next.js 15 (App Router)                           |
| Language  | TypeScript                                        |
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

| Variable       | Description                             |
| -------------- | --------------------------------------- |
| `DATABASE_URL` | Postgres connection string              |
| `AUTH_SECRET`  | Admin password (keep private)           |
| `DEMO_SECRET`  | Read-only demo password (safe to share) |

## Built with Claude Code

This project was built using [Claude Code](https://claude.com/claude-code) as a pair programmer. Claude wrote the code; I reviewed every commit, tested each feature, and made all architectural decisions. The commit history reflects a ticket-by-ticket workflow — one logical change per commit.

## License

MIT
