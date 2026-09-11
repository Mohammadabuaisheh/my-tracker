import { issueFiltersCache } from "@/lib/search-params";
import { getIssues } from "@/db/queries/issues";
import { IssueList } from "@/components/features/issues/issue-list";
import { Inbox } from "lucide-react";
import type { SearchParams } from "nuqs/server";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function BacklogPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const parsedParams = issueFiltersCache.parse(resolvedSearchParams);

  const issues = await getIssues({
    status: ["backlog"],
    priority: parsedParams.priority.length > 0 ? (parsedParams.priority as any) : undefined,
  });

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between border-b border-border/40 pb-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Backlog</h1>
          <p className="text-xs text-muted-foreground">
            Future tasks and unprioritized work.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">
            {issues.length} {issues.length === 1 ? "issue" : "issues"}
          </span>
        </div>
      </div>

      {issues.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-border/60 p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/60">
            <Inbox className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-sm font-semibold">No backlog tasks</h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm leading-relaxed">
            Your backlog is empty. Press{" "}
            <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-foreground border">
              C
            </kbd>{" "}
            to capture a new issue with status set to <strong>Backlog</strong>.
          </p>
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto">
          <IssueList issues={issues as any} />
        </div>
      )}
    </div>
  );
}