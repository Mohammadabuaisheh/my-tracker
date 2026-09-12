# UI & Design System

The UI is built with **Tailwind CSS** and relies on **shadcn/ui** primitives.

## Conventions & Rules
* **Modals & Drawers:** Component layouts utilizing multiple `<Select>` dropdowns side-by-side (e.g., `IssueCreateForm`) require explicit flex gaps (e.g., `gap-3.5`) and min-widths to prevent touch-target overlapping on mobile.
* **Loading States:** Button loaders utilize `lucide-react`'s `<Loader2 className="animate-spin" />`. The loading state boolean is derived from either React 19's `useActionState` (for forms like `IssueCreateForm`) or `useTransition` (for inline edits like `ProjectCard`).
* **Inline Editing:** The `ProjectRename` component replaces text with a compact `<Input>` and `<Check>`/`<X>` icon buttons, trapping the click event (`e.stopPropagation()`) to prevent unwanted navigation.

## Known Limitations
* Kanban drag-and-drop mechanics rely on client-side state transitioning to server actions; rapid successive drops without waiting for revalidation may cause UI jitter.