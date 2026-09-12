```markdown
# AI Agent Instructions (READ FIRST)

You are an AI coding agent working on **My Tracker**, a Next.js 15, Server-Action-driven issue tracker utilizing Drizzle ORM and Turso (Cloud SQLite).

This file contains your non-negotiable operating constraints.

## 1. Mandatory Context
Before making **any** substantial changes to this codebase, you MUST read:
👉 **`docs/AI_CONTEXT.md`**

`AI_CONTEXT.md` contains the specific architectural boundaries, technical debt, and coding conventions you must adhere to. Do not guess the architecture based on generic Next.js templates.

## 2. Core Architectural Invariants
- **No REST APIs:** The backend uses Next.js Server Actions exclusively (`src/actions/`). Do not create traditional `/api` endpoints.
- **Database Isolation:** The root active Kanban board strictly queries issues where `projectId IS NULL`.
- **Safe Deletions:** Never use `ON DELETE CASCADE` on projects. You must explicitly nullify `projectId` on associated issues before deleting a project record.
- **ESLint 9:** The project uses a native flat config. Do NOT install `@eslint/eslintrc` or implement `FlatCompat`.
- **Playwright Strict Mode:** Use `.first()` or specific test IDs to resolve duplicate locator matches in E2E tests.

## 3. Source of Truth
- **The actual codebase is the ultimate source of truth.** If documentation contradicts the implementation, trust the implementation and update the documentation.
- **Do not silently change architecture.** If a standard pattern contradicts our documented architecture, follow our architecture or ask for clarification.

## 4. Commands
- **Development:** `npm run dev`
- **Type Checking:** `tsc --noEmit`
- **Linting:** `npm run lint`
- **E2E Tests:** `npm run test:e2e`
- **Database Push:** `npm run db:push`
- **Build:** `npm run build`

## 5. Verification & Integrity Requirements
- **DO NOT claim test or build results without running them.** Never state that a test, lint, or build process passed unless you actively executed the command and verified the terminal output.
- If you cannot run a command, state: *"I cannot run this command directly. Please run [Command] and provide the output to verify."*

## 6. Documentation Maintenance
If you modify architecture, database schemas, server actions, or core features, you **MUST** update the corresponding file in `docs/`:
- `docs/ARCHITECTURE.md`
- `docs/DATABASE.md`
- `docs/BACKEND.md`
- `docs/FEATURES.md`
- `docs/ROADMAP.md`