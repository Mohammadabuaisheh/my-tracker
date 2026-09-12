# Development Workflow

## AI & Agent Instructions (CRITICAL)
Future developers or AI agents MUST adhere to these rules:
1. **No `FlatCompat` in ESLint:** Do NOT attempt to install `@eslint/eslintrc` or migrate the flat config backwards. It causes circular JSON schema crashes with `@typescript-eslint` v8.
2. **Playwright Strict Mode:** When targeting elements that may appear multiple times (like "New Project" in the empty state vs. header), use `.first()` or explicitly target the parent container `data-testid`.
3. **Hydration:** Do NOT remove `suppressHydrationWarning` from the `<html>` tag in `layout.tsx`; it is required by `next-themes` in React 19.
4. **Database:** Do NOT add SQL `ON DELETE CASCADE` to issues. Rely on the soft-unlink logic in `deleteProject`.

## Scripts
* `npm run dev`: Start dev server.
* `npm run build`: Build production Next.js app.
* `npm run lint`: Run native ESLint 9.
* `npm run test:e2e`: Run Playwright tests.
* `npm run db:push`: Push Drizzle schema to Turso.
*(Note: Refer to package.json for additional configured scripts).*