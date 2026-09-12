# Database Schema & Data Flow

My Tracker uses **Turso (libSQL)** managed by **Drizzle ORM**. 

## Entity Relationship Diagram

```mermaid
erDiagram
    PROJECTS ||--o{ ISSUES : "contains"
    PROJECTS {
        string id PK
        string name
        string identifier
        datetime createdAt
        datetime updatedAt
    }
    ISSUES {
        string id PK
        string title
        string description
        string status "backlog, todo, in-progress, in-review, done"
        string priority "no-priority, low, medium, high, urgent"
        string projectId FK "Nullable"
        datetime dueDate "Nullable"
        datetime createdAt
        datetime updatedAt
    }
```

## Data Lifecycle & Quirks
* **Soft Unlinking:** Deleting a project does **not** cascade-delete issues. The `deleteProject` action runs an `UPDATE` setting `projectId: null` for all associated issues before deleting the project, returning them to the global unassigned bucket.
* **The Global Bucket:** The main active issues query explicitly uses `isNull(issues.projectId)`.