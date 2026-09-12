# System Architecture

My Tracker uses a modern Next.js 15 Server-First architecture, eliminating traditional REST APIs in favor of Server Actions and tightly coupled Server Components.

## Core Flow

```mermaid
graph TD
    Client[Client UI / React 19] -->|Server Action| SA[Next.js Server Actions]
    SA -->|Validation| Zod[Zod / Manual Validation]
    Zod -->|Query| Drizzle[Drizzle ORM]
    Drizzle -->|TCP/WebSockets| Turso[(Turso SQLite Cloud)]
    Turso -->|Response| Drizzle
    Drizzle -->|revalidatePath| Cache[Next.js Router Cache]
    Cache -->|Updated HTML/RSC| Client
```

## Architectural Decisions
1. **URL-Driven State (`nuqs`):** View toggles (Board vs. List) and priority filters are stored in the URL search params. This allows deep-linking and prevents hydration mismatches.
2. **Server Actions for Mutations:** Form submissions (`useActionState`) and interactive UI updates (`useTransition`) trigger Server Actions, which revalidate paths upon completion.
3. **Isolated Bucket Model:** The root `/` active board only queries tasks where `projectId` is `null`. Project-specific tasks live exclusively on their respective project dashboards.
4. **No API Routes:** There are no traditional `/api/` endpoints. All data fetching is done directly in Server Components, and mutations are handled by `src/actions/`.