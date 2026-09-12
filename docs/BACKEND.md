# Backend / Server Actions

Backend logic is centralized in the `src/actions/` directory.

## `projects.ts`
| Action | Input | Output / Side Effect | Notes |
|---|---|---|---|
| `createProject` | Zod `CreateProjectInput` | `{ success, data/error }` | Validated strictly via Zod. |
| `updateProject` | `id: string, name: string` | `{ success, data/error }` | Uses manual string trim validation (Tech Debt). |
| `deleteProject` | `id: string` | `{ success, error }` | Nullifies `projectId` on related issues first. |
| `getProjects` | None | `Project[]` | Returns all projects ordered by creation. |
| `getProjectsWithStats` | None | `Project[]` + aggregations | Calculates % done and total issues per project. |

## `issues.ts`
| Action | Input | Output / Side Effect | Notes |
|---|---|---|---|
| `createIssueFormAction` | `FormData` | `FormActionState` | Designed for React 19 `useActionState`. |
| `getActiveIssues` | None | `Issue[]` | Strictly filters where `projectId IS NULL`. |