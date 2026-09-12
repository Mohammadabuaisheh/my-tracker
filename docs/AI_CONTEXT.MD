# AI Context & Maintainer Manual

**WARNING TO AI AGENTS:** 
This document is your primary source of truth for the My Tracker project architecture and conventions. You MUST read and adhere to these constraints before generating code, modifying the architecture, or writing tests. Do not make assumptions based on standard Next.js boilerplates; abide by the specific rules outlined here.

---

## 1. Project Identity
* **What it is:** My Tracker is a fast, URL-state-driven Kanban issue tracker and project management tool.
* **Current Scope:** A single-tenant, globally shared public board.
* **Current User Model:** Public access. There is NO authentication, authorization, or user isolation in the current build. Everyone sees and edits the same global database.
* **Core Philosophy:** Server-first execution, strict URL-to-view synchronization, and minimal client-side state.

## 2. Architecture
* **Frontend:** React 19 (Server and Client Components) via Next.js 15 App Router.
* **Backend:** Next.js Server Actions ONLY. There are no traditional `/api` REST endpoints.
* **Database:** Turso (libSQL/SQLite) hosted in the cloud.
* **Data Flow:** Client UI -> Server Action (`useActionState` or `useTransition`) -> Drizzle ORM -> Turso DB -> `revalidatePath` -> Server renders updated UI.
* **Major Boundaries:** The root active board strictly isolates unassigned issues. Once an issue belongs to a project, it is removed from the root board and exists exclusively in that project's dashboard.

## 3. Technology Stack
* **Framework:** Next.js 15
* **React:** React 19
* **State (URL):** `nuqs`
* **Database:** Turso (libSQL)
* **ORM:** Drizzle ORM
* **Styling:** Tailwind CSS, shadcn/ui, `next-themes`
* **Linting:** ESLint 9 (Native Flat Config)
* **Testing:** Playwright (E2E)

## 4. Project Structure
* `src/app/`: Next.js App Router pages and layouts.
* `src/actions/`: Centralized Server Actions for database mutations.
* `src/components/`: UI components (separated by `features/`, `layout/`, `ui/`).
* `src/db/`: Drizzle schema (`schema.ts`), connection setup (`index.ts`), and queries.
* `src/types/`: TypeScript definitions and Zod schemas.
* `tests/e2e/`: Playwright test suites.
* `eslint.config.mjs`: Native ESLint 9 configuration.

## 5. Database Rules
* **Entities:** `projects` and `issues`.
* **Relationships:** `issues` belong to `projects` via a nullable `projectId`.
* **Safe Modifications (The Deletion Rule):** Do NOT implement cascading SQL deletes for projects. When deleting a project, you MUST first run an `UPDATE` to set `projectId = null` for all associated issues, returning them to the global bucket, before deleting the project record.
* **The Global Bucket Invariant:** The global active issues query MUST filter by `isNull(issues.projectId)`.

## 6. Feature Architecture
* **View Synchronization:** Kanban Board and List views, as well as Priority filters, are managed strictly via URL search parameters using `nuqs`. Do not introduce `useState` for global filtering or view toggling.
* **Form Submissions:** Forms utilize React 19's `useActionState` with `requestSubmit()` for keyboard shortcuts (e.g., CMD+Enter).

## 7. UI Rules
* **Design System:** Built on shadcn/ui and Tailwind.
* **Component Conventions:** Use `lucide-react` for icons.
* **Layout Conventions (Modals):** Modals/Dialogs with multiple inline elements (like `Select` dropdowns for Priority, Status, etc.) MUST use explicit flex/grid gaps (e.g., `gap-3.5`) to prevent touch-target overlapping on small screens.
* **Interaction:** Inline editing components (e.g., `ProjectRename`) must explicitly trap clicks using `e.stopPropagation()` and `e.preventDefault()` to prevent accidental navigation.

## 8. Coding Conventions
* **TypeScript:** Strict typing is enforced. Use explicit interfaces.
* **ESLint 9:** The project uses native ESLint 9 Flat Config. Do NOT attempt to install `@eslint/eslintrc` or use `FlatCompat`.
* **Hydration:** `suppressHydrationWarning` MUST remain on the `<html>` tag in `src/app/layout.tsx` to prevent React 19 / `next-themes` script injection crashes.

## 9. Data/Backend Conventions
* **Server Actions:** Must have `"use server";` at the top of the file.
* **Return Types:** Actions must return a standardized object: `{ success: boolean, data?: any, error?: string }`.
* **Revalidation:** Always call `revalidatePath` appropriately before returning a successful mutation.

## 10. Validation Rules
* **Current Implementation:** Mixed. `createProject` uses a Zod schema (`createProjectSchema.safeParse`), while `updateProject` uses procedural string trimming (`name.trim()`). 
* **Future Rule:** When refactoring or adding new mutations, migrate toward Zod schema validation.

## 11. Error Handling
* **Server-Side:** Catch blocks in Server Actions log to `console.error` and return a safe, user-friendly error string.
* **Client-Side:** UI components listen to the Server Action response and dispatch a `toast.error()` (via Sonner) if `success` is false.

## 12. Testing Requirements (Playwright)
* **Strict Mode Avoidance:** Playwright enforces strict mode. If a locator resolves to multiple elements (e.g., a "New Project" button in the header AND in the empty state), you MUST use `.first()` or target a highly specific `data-testid` to prevent test crashes.
* **Coverage:** New features must have UI visibility checks, interaction tests, and URL state verification.

## 13. Verification Requirements
Before reporting a task as complete, an AI agent MUST verify:
1. `npm run lint` passes natively.
2. `tsc --noEmit` passes with no type errors.
3. `npm run test:e2e` passes.
4. Database migrations generate without errors.
*Never claim a test run passed without actively running it and inspecting output.*

## 14. DO NOT BREAK (Architectural Invariants)
* **DO NOT** remove `suppressHydrationWarning` from `<html>`.
* **DO NOT** change `isNull(issues.projectId)` in the root active board query.
* **DO NOT** add traditional `/api` routes unless strictly integrating webhooks.
* **DO NOT** introduce `FlatCompat` to the ESLint configuration.
* **DO NOT** implement `ON DELETE CASCADE` on the `issues` table schema.

## 15. Common AI Mistakes to Avoid
* Assuming `userId` exists (there is no auth yet).
* Forgetting to mark Client Components with `"use client";`.
* Forgetting to await Drizzle ORM operations or Server Actions.
* Trying to assert Playwright locators using `.click()` without resolving multiple matches, triggering strict mode failures.

## 16. Safe Feature Development Workflow
1. **Inspect:** Read the relevant schema and current component.
2. **Understand:** Cross-reference with `AI_CONTEXT.md` to ensure constraints are met.
3. **Plan:** Outline the Next.js Server Action and UI changes.
4. **Implement:** Write the code following the conventions.
5. **Test:** Add or update Playwright tests.
6. **Verify:** Run lint, build, and tests.
7. **Review & Report:** Present the changes explicitly noting any deviations.

## 17. Future Multi-User Direction
* **Planned Evolution:** Authentication (e.g., Clerk or Auth.js) will be introduced.
* **Data Model Impact:** When implemented, tables will require a `userId` or `tenantId`. Row-Level Security (RLS) or application-level filtering will be required. 
* **Do not implement this speculatively.** Wait for explicit instruction.

## 18. Documentation Maintenance
If you alter the system architecture, you MUST update:
* `docs/ARCHITECTURE.md` (if data flow or modules change).
* `docs/DATABASE.md` (if Drizzle schema is altered).
* `docs/FEATURES.md` (if new user capabilities are added).
* `docs/ROADMAP.md` (if technical debt is cleared).