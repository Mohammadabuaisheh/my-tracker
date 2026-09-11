"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  attachClosestEdge,
  extractClosestEdge,
  type Edge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDueDate } from "@/lib/dates";
import type { OptimisticIssue } from "@/hooks/use-optimistic-issues";
import type { IssueStatus } from "@/types/issue";
import {
  AlertCircle,
  ArrowUp,
  ArrowRight,
  ArrowDown,
  MoreHorizontal,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

const priorityConfig = {
  urgent: { icon: AlertCircle, color: "text-red-500", label: "Urgent" },
  high: { icon: ArrowUp, color: "text-orange-500", label: "High" },
  medium: { icon: ArrowRight, color: "text-yellow-500", label: "Medium" },
  low: { icon: ArrowDown, color: "text-blue-500", label: "Low" },
  "no-priority": { icon: null, color: "text-muted-foreground", label: "" },
};

const ORDERED_COLUMNS: { status: IssueStatus; label: string }[] = [
  { status: "backlog", label: "Backlog" },
  { status: "todo", label: "To Do" },
  { status: "in-progress", label: "In Progress" },
  { status: "in-review", label: "In Review" },
  { status: "done", label: "Done" },
];

interface KanbanCardProps {
  issue: OptimisticIssue;
  onMoveCard?: (issue: OptimisticIssue, targetStatus: IssueStatus) => void;
}

export function KanbanCard({ issue, onMoveCard }: KanbanCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const cleanupDraggable = draggable({
      element: el,
      getInitialData: () => ({ type: "card", issue }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    });

    const cleanupDropTarget = dropTargetForElements({
      element: el,
      canDrop: ({ source }) => source.data.type === "card",
      getData: ({ input }) => {
        return attachClosestEdge(
          { type: "card", issue },
          { element: el, input, allowedEdges: ["top", "bottom"] }
        );
      },
      onDragEnter: ({ self }) => {
        setClosestEdge(extractClosestEdge(self.data));
      },
      onDrag: ({ self }) => {
        setClosestEdge(extractClosestEdge(self.data));
      },
      onDragLeave: () => setClosestEdge(null),
      onDrop: () => setClosestEdge(null),
    });

    return () => {
      cleanupDraggable();
      cleanupDropTarget();
    };
  }, [issue]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!e.altKey || !onMoveCard) return;

    const currentIndex = ORDERED_COLUMNS.findIndex((col) => col.status === issue.status);
    if (currentIndex === -1) return;

    if (e.key === "ArrowRight" && currentIndex < ORDERED_COLUMNS.length - 1) {
      e.preventDefault();
      onMoveCard(issue, ORDERED_COLUMNS[currentIndex + 1].status);
    } else if (e.key === "ArrowLeft" && currentIndex > 0) {
      e.preventDefault();
      onMoveCard(issue, ORDERED_COLUMNS[currentIndex - 1].status);
    }
  };

  const priority = priorityConfig[issue.priority] ?? priorityConfig["no-priority"];
  const PriorityIcon = priority.icon;

  return (
    <div
      ref={cardRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`${issue.title}, Priority: ${issue.priority}, Status: ${issue.status}. Press Alt with left or right arrow to move.`}
      className={cn(
        "group relative flex flex-col gap-2 rounded-md border border-border/80 bg-card p-3 shadow-xs transition-all cursor-grab active:cursor-grabbing hover:border-foreground/30 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring select-none",
        isDragging && "opacity-40",
        closestEdge === "top" && "border-t-2 border-t-primary",
        closestEdge === "bottom" && "border-b-2 border-b-primary"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono text-[11px] text-muted-foreground/80 tabular-nums">
          {issue.id.slice(0, 8)}
        </span>

        <div className="flex items-center gap-1">
          {PriorityIcon && (
            <PriorityIcon className={`h-3.5 w-3.5 shrink-0 ${priority.color}`} aria-label={priority.label} />
          )}

          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "h-5 w-5 p-0 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity cursor-pointer"
              )}
              aria-label={`Actions for issue ${issue.title}`}
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs">Move to...</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {ORDERED_COLUMNS.map((col) => (
                  <DropdownMenuItem
                    key={col.status}
                    disabled={col.status === issue.status}
                    onClick={() => onMoveCard?.(issue, col.status)}
                    className="text-xs cursor-pointer"
                  >
                    {col.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Link href={`/issue/${issue.id}`} scroll={false} className="hover:underline">
        <p className="text-xs font-medium leading-snug tracking-tight text-foreground line-clamp-2">
          {issue.title}
        </p>
      </Link>

      {issue.description && (
        <p className="text-[11px] text-muted-foreground line-clamp-2">
          {issue.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-1 text-[10px] text-muted-foreground/70">
        <span className="tabular-nums">
          {new Date(issue.createdAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}
        </span>

        {(issue as any).dueDate && (() => {
          const { label, isOverdue } = formatDueDate((issue as any).dueDate);
          return (
            <span
              className={cn(
                "inline-flex items-center gap-1 font-medium tabular-nums",
                isOverdue ? "text-destructive font-semibold" : "text-muted-foreground"
              )}
            >
              <Calendar className="h-3 w-3" />
              {label}
            </span>
          );
        })()}
      </div>
    </div>
  );
}