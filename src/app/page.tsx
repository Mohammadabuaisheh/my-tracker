import { issueFiltersCache } from "@/lib/search-params";
import { getIssues } from "@/db/queries/issues";
import { IssueFilters } from "@/components/features/issues/issue-filters";
import { IssueList } from "@/components/features/issues/issue-list";
import { KanbanBoard } from "@/components/features/board/kanban-board";
import { ViewSwitcher } from "@/components/features/issues/view-switcher";
import type { SearchParams } from "nuqs/server";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function ActivePage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const parsedParams = issueFiltersCache.parse(resolvedSearchParams);

  const issues = await getIssues({
    status: parsedParams.status.length > 0 ? (parsedParams.status as any) : undefined,
    priority: parsedParams.priority.length > 0 ? (parsedParams.priority as any) : undefined,
  });

  return (
    <div className="flex flex-col h-full space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Active Issues</h1>
          <p className="text-xs text-muted-foreground">
            Current work in progress and actionable tasks.
          </p>
        </div>
        <ViewSwitcher />
      </div>

      <IssueFilters />

      <div className="flex-1 min-h-0">
        {parsedParams.view === "list" ? (
          <IssueList issues={issues as any} />
        ) : (
          <KanbanBoard issues={issues as any} />
        )}
      </div>
    </div>
  );
}