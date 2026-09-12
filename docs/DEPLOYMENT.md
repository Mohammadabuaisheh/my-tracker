# Deployment

Deployed on **Vercel (Hobby Tier)**.

## Environment Configuration
The following variables must be set in the Vercel Dashboard -> Settings -> Environment Variables:
* `TURSO_DATABASE_URL` (Format: `libsql://your-db.turso.io`)
* `TURSO_AUTH_TOKEN`

## Process
1. Push to GitHub `main` branch.
2. Vercel automatically runs `npm run build`.
3. Vercel skips Playwright tests by default during build (tests are handled via GitHub Actions).
4. Project goes live at the `.vercel.app` domain.

## Known Production Configuration
* **Authentication:** The current production deployment is public. Anyone with the URL can view, mutate, or delete records in the database.