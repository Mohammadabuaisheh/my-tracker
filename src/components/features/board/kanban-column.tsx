"use client";

import { useEffect, useRef, useState } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { KanbanCard } from "./kanban-card";
import { Badge } from "@/components/ui/badge";
import type { OptimisticIssue } from "@/hooks/use-optimistic-issues";
import type { IssueStatus } from "@/types/issue";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  status: IssueStatus;
  title: string;
  issues: OptimisticIssue[];
  onMoveCard?: (issue: OptimisticIssue, targetStatus: IssueStatus) => void;
}

export function KanbanColumn({ status, title, issues, onMoveCard }: KanbanColumnProps) {
  const columnRef = useRef<HTMLDivElement | null>(null);
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    const el = columnRef.current;
    if (!el) return;

    return dropTargetForElements({
      element: el,
      canDrop: ({ source }) => source.data.type === "card",
      getData: () => ({ type: "column", status }),
      onDragEnter: () => setIsOver(true),
      onDragLeave: () => setIsOver(false),
      onDrop: () => setIsOver(false),
    });
  }, [status]);

  return (
    <div
      ref={columnRef}
      className={cn(
        "flex flex-col w-72 shrink-0 rounded-lg bg-muted/40 p-2.5 border border-border/40 transition-colors",
        isOver && "border-primary/50 bg-muted/60"
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-2.5 px-1">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-semibold tracking-tight text-foreground uppercase">
            {title}
          </h3>
          <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-mono tabular-nums">
            {issues.length}
          </Badge>
        </div>
      </div>

      {/* Cards List */}
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto min-h-[450px]">
        {issues.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-md border border-dashed border-border/60 p-4 text-center">
            <span className="text-xs text-muted-foreground/60 font-normal">
              No issues
            </span>
          </div>
        ) : (
          issues.map((issue) => (
            <KanbanCard key={issue.id} issue={issue} onMoveCard={onMoveCard} />
          ))
        )}
      </div>
    </div>
  );
}