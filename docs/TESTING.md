# Testing

## Framework
**Playwright** is used for End-to-End (E2E) testing. Tests are located in `tests/e2e/`.

## CI/CD Workflow (GitHub Actions)
The workflow (located in `.github/workflows/`) runs on an `ubuntu-latest` runner and executes:
1. `npm ci`
2. `npm run lint` (ESLint 9)
3. `tsc --noEmit` (Strict TypeScript checks)
4. Playwright browser installation & test execution.

## Testing Technical Debt
* **Locator Fragility:** The test suite currently uses `.first()` to bypass Playwright's strict mode errors when encountering duplicate accessible names (e.g., duplicate "New Project" buttons).
* *Action Item:* Migrate locators to unique `data-testid` attributes in the future.