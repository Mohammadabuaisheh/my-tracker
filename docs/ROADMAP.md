# Roadmap & Technical Debt

## Technical Debt to Address
1. **Validation Consistency:** Migrate `updateProject` Server Action from manual `string.trim()` validation to a strict Zod schema matching `createProject`.
2. **E2E Locators:** Replace `.first()` usage in Playwright tests with `data-testid` implementations.
3. **Hydration Shielding:** Assess if `suppressHydrationWarning` on `<html>` is masking actual SSR mismatches outside of `next-themes`.

## Phase 2 (Future Implementations)
- **Multi-Tenant Authentication:** Integrate Clerk or Auth.js to lock data behind user accounts (`userId` in database).
- **Subtasks:** Support nested issues.
- **File Attachments:** Connect an S3-compatible blob storage provider.
- **FTS5:** Add SQLite Full-Text Search.