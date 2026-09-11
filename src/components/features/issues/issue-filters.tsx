"use client";

import { useQueryStates } from "nuqs";
import { issueFiltersParsers, priorityEnumValues, statusEnumValues } from "@/lib/search-params";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IssuePriority, IssueStatus } from "@/types/issue";

export function IssueFilters() {
  const [filters, setFilters] = useQueryStates(issueFiltersParsers, {
    shallow: false,
  });

  const togglePriority = (priority: IssuePriority) => {
    const current = new Set(filters.priority);
    if (current.has(priority)) {
      current.delete(priority);
    } else {
      current.add(priority);
    }
    setFilters({ priority: Array.from(current) as IssuePriority[] });
  };

  const toggleStatus = (status: IssueStatus) => {
    const current = new Set(filters.status);
    if (current.has(status)) {
      current.delete(status);
    } else {
      current.add(status);
    }
    setFilters({ status: Array.from(current) as IssueStatus[] });
  };

  const hasActiveFilters = filters.priority.length > 0 || filters.status.length > 0;

  return (
    <div className="flex flex-wrap items-center gap-2 pb-4 pt-1 border-b border-border/40">
      <span className="text-xs font-medium text-muted-foreground mr-1">Filter:</span>

      {/* Priority Filters */}
      <div className="flex flex-wrap gap-1">
        {priorityEnumValues.map((p) => {
          const isActive = filters.priority.includes(p);
          return (
            <Button
              key={p}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              className={cn(
                "h-7 px-2 text-xs capitalize cursor-pointer transition-colors border",
                isActive
                  ? "bg-red-600 text-white hover:bg-red-700 hover:text-white border-red-600 shadow-xs"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
              aria-pressed={isActive}
              onClick={() => togglePriority(p)}
            >
              {p.replace("-", " ")}
            </Button>
          );
        })}
      </div>

      <div className="h-4 w-[1px] bg-border mx-1" />

      {/* Status Filters */}
      <div className="flex flex-wrap gap-1">
        {statusEnumValues.map((s) => {
          const isActive = filters.status.includes(s);
          return (
            <Button
              key={s}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              className={cn(
                "h-7 px-2 text-xs capitalize cursor-pointer transition-colors border",
                isActive
                  ? "bg-red-600 text-white hover:bg-red-700 hover:text-white border-red-600 shadow-xs"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
              aria-pressed={isActive}
              onClick={() => toggleStatus(s)}
            >
              {s.replace("-", " ")}
            </Button>
          );
        })}
      </div>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground ml-auto cursor-pointer"
          onClick={() => setFilters({ priority: [], status: [] })}
        >
          Reset
          <X className="ml-1 h-3 w-3" />
        </Button>
      )}
    </div>
  );
}