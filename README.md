# Scope

A minimal, single-user issue tracker — built in 14 days with Claude Code.

Scope is a personal project management tool inspired by Linear's clean design, stripped down to the features that actually matter for solo work: issues, projects, statuses, and keyboard shortcuts. Nothing more.

## Status

🚧 **In development** — Day 1 of 14.

## Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Next.js Server Actions
- **Database:** Postgres (Supabase in production, local via Docker in development)
- **ORM:** Drizzle
- **Hosting:** Vercel
- **Dev environment:** VS Code devcontainer with Docker Compose

## Getting started

### Prerequisites

- Docker Desktop
- VS Code with the [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension
- A [Supabase](https://supabase.com) account (free tier)
- A [Vercel](https://vercel.com) account (free tier)

### Setup

1. Clone the repo:

   ```bash
   git clone https://github.com/<your-username>/scope.git
   cd scope
   ```

2. Copy the environment template and fill in your Supabase credentials:

   ```bash
   cp .env.example .env.local
   ```

3. Open in VS Code and reopen in the devcontainer when prompted. The container installs all dependencies automatically.

4. Start the dev server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
.devcontainer/        # Docker + devcontainer config
V1_SCOPE.md           # Binding scope contract for v1 features
V2_IDEAS.md           # Parked ideas for future versions
linear-clone-plan.md  # Full 14-day build plan
CLAUDE.md             # Project context for Claude Code sessions
```

## V1 scope

Issues (title, description, status, priority) · Projects · Status workflow (Backlog → Todo → In Progress → Done) · Keyboard shortcuts · Filterable list view · Dark mode · Responsive layout.

See [V1_SCOPE.md](./V1_SCOPE.md) for the full scope contract including what's explicitly out.

## Built with Claude Code

This project was built using [Claude Code](https://claude.com/claude-code) as a pair programmer. Claude wrote the code; I reviewed every commit, tested each feature, and made all architectural decisions. The commit history reflects a ticket-by-ticket workflow — small, reviewable PRs rather than large autonomous runs.

## License

MIT
