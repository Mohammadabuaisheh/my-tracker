# Security

## Implemented
* **SQL Injection Prevention:** Handled natively by Drizzle ORM query builders.
* **Input Validation (Partial):** Zod is used for project creation schemas.

## Missing / Not Implemented
* **Authentication & Authorization:** There is no login system. The database is entirely public.
* **Rate Limiting:** Not configured. Vercel standard limits apply, but application-level DDoS protection is missing.
* **Ownership Checks:** Actions like `deleteProject` do not verify if the requester owns the project.