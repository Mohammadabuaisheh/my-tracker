import { issueFiltersCache } from "@/lib/search-params";
import { getIssues } from "@/db/queries/issues";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { IssueFilters } from "@/components/features/issues/issue-filters";
import { IssueList } from "@/components/features/issues/issue-list";
import { KanbanBoard } from "@/components/features/board/kanban-board";
import { ViewSwitcher } from "@/components/features/issues/view-switcher";
import Link from "next/link";
import { FolderKanban, X } from "lucide-react";
import type { SearchParams } from "nuqs/server";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function ActivePage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const parsedParams = issueFiltersCache.parse(resolvedSearchParams);

  const activeProject = parsedParams.project
    ? (await db.select().from(projects).where(eq(projects.id, parsedParams.project)))[0]
    : null;

  const issues = await getIssues({
    status: parsedParams.status.length > 0 ? (parsedParams.status as any) : undefined,
    priority: parsedParams.priority.length > 0 ? (parsedParams.priority as any) : undefined,
    projectId: parsedParams.project || undefined,
  });

  return (
    <div className="flex flex-col h-full space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold tracking-tight">Active Issues</h1>
            {activeProject && (
              <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs text-foreground font-medium border border-border">
                <FolderKanban className="h-3 w-3 text-red-500" />
                {activeProject.name}
                <Link href="/" className="ml-1 hover:text-red-500">
                  <X className="h-3 w-3" />
                </Link>
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {activeProject
              ? `Filtered to issues in "${activeProject.name}"`
              : "Current work in progress and actionable tasks."}
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