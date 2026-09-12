# My Tracker

My Tracker is a fast, URL-state-driven issue tracker and project management application built with Next.js 15. It features a Kanban board, isolated project dashboards, and URL-synchronized state designed for speed and clarity.

## Tech Stack
- **Framework:** Next.js 15 (App Router), React 19
- **State Management:** URL-driven via `nuqs`
- **Database:** Turso (Cloud libSQL/SQLite)
- **ORM:** Drizzle ORM
- **Styling:** Tailwind CSS, shadcn/ui, `next-themes`
- **Testing & QA:** Playwright (E2E), ESLint 9 (Native Flat Config), TypeScript

---

## Quick Start

### 1. Prerequisites
- Node.js 20+
- A free [Turso](https://turso.tech) account (required for cloud database persistence)

### 2. Environment Setup
Create a `.env.local` file in the root directory:
```env
TURSO_DATABASE_URL="libsql://your-database-name.turso.io"
TURSO_AUTH_TOKEN="your-turso-auth-token"
```

### 3. Installation & Database Migration
```bash
npm install
npm run db:push
npm run dev
```

---

## Available Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Starts the local development server at `localhost:3000` |
| `npm run build` | Builds the application for production |
| `npm run lint` | Runs native ESLint 9 checks |
| `npm run test:e2e` | Runs Playwright end-to-end integration tests |
| `npm run db:push` | Pushes the Drizzle schema directly to Turso |

---

## Documentation Index

- [Architecture](docs/ARCHITECTURE.md) — System flow, boundaries, and Next.js Server Actions design
- [Database](docs/DATABASE.md) — Drizzle schema, entity relationships, and soft-unlink logic
- [Backend](docs/BACKEND.md) — Server Actions reference and mutation behaviors
- [Features](docs/FEATURES.md) — Inventory of implemented vs. future features
- [UI & Design](docs/UI.md) — Layout guidelines, modal spacing, and loading conventions
- [Development](docs/DEVELOPMENT.md) — Development setup, environment keys, and scripts
- [Deployment](docs/DEPLOYMENT.md) — Vercel hosting setup and production environment configuration
- [Testing](docs/TESTING.md) — Playwright test coverage and CI workflow
- [Security](docs/SECURITY.md) — Current public state and security considerations
- [Roadmap & Tech Debt](docs/ROADMAP.md) — Tracked technical debt and planned multi-tenant upgrades
- [AI Maintainer Context](docs/AI_CONTEXT.md) — Core instructions and constraints for AI coding agents