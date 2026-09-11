"use client";

import { useEffect, useState, useTransition } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { KanbanColumn } from "@/components/features/board/kanban-column";
import { useOptimisticIssues, type OptimisticIssue } from "@/hooks/use-optimistic-issues";
import { updateIssueStatus } from "@/actions/issues";
import { generatePositionBetween } from "@/lib/fractional-index";
import { useBoardAnnouncer } from "@/hooks/use-board-announcer";
import { LiveRegion } from "@/components/ui/live-region";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IssueStatus } from "@/types/issue";

const BASE_COLUMNS: { id: IssueStatus; title: string }[] = [
  { id: "backlog", title: "Backlog" },
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "in-review", title: "In Review" },
];

const DONE_COLUMN: { id: IssueStatus; title: string } = {
  id: "done",
  title: "Done",
};

interface KanbanBoardProps {
  issues: OptimisticIssue[];
}

export function KanbanBoard({ issues }: KanbanBoardProps) {
  const [optimisticIssues, setOptimisticIssues] = useOptimisticIssues(issues);
  const [, startTransition] = useTransition();
  const { announcement, announce } = useBoardAnnouncer();
  const [isClient, setIsClient] = useState(false);
  const [showDone, setShowDone] = useState(false);

  const activeColumns = showDone ? [...BASE_COLUMNS, DONE_COLUMN] : BASE_COLUMNS;
  const doneCount = optimisticIssues.filter((i) => i.status === "done").length;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    return monitorForElements({
      canMonitor: ({ source }) => source.data.type === "card",
      onDrop: ({ source, location }) => {
        const target = location.current.dropTargets[0];
        if (!target) return;

        const sourceIssue = source.data.issue as OptimisticIssue;
        const targetData = target.data;

        // Dropped directly on a column
        if (targetData.type === "column") {
          const targetStatus = targetData.status as IssueStatus;
          if (sourceIssue.status === targetStatus) return;

          const columnCards = optimisticIssues
            .filter((i) => i.status === targetStatus)
            .sort((a: OptimisticIssue, b: OptimisticIssue) =>
              (a.position ?? "").localeCompare(b.position ?? "")
            );

          const lastCard = columnCards[columnCards.length - 1];
          const newPos = generatePositionBetween(lastCard?.position ?? null, null);

          startTransition(async () => {
            setOptimisticIssues({
              type: "MOVE_CARD",
              issueId: sourceIssue.id,
              newStatus: targetStatus,
              newPosition: newPos,
            });

            announce(`Moved ${sourceIssue.title} to ${targetStatus}`);
            await updateIssueStatus(sourceIssue.id, targetStatus, newPos);
          });
          return;
        }

        // Dropped on another card
        if (targetData.type === "card") {
          const targetIssue = targetData.issue as OptimisticIssue;
          const targetStatus = targetIssue.status;
          const edge = extractClosestEdge(targetData);

          const columnCards = optimisticIssues
            .filter((i) => i.status === targetStatus && i.id !== sourceIssue.id)
            .sort((a: OptimisticIssue, b: OptimisticIssue) =>
              (a.position ?? "").localeCompare(b.position ?? "")
            );

          const targetIndex = columnCards.findIndex((i) => i.id === targetIssue.id);
          if (targetIndex === -1) return;

          let beforePos: string | null = null;
          let afterPos: string | null = null;

          if (edge === "top") {
            beforePos = targetIndex > 0 ? columnCards[targetIndex - 1].position : null;
            afterPos = targetIssue.position;
          } else {
            beforePos = targetIssue.position;
            afterPos = targetIndex < columnCards.length - 1 ? columnCards[targetIndex + 1].position : null;
          }

          const newPos = generatePositionBetween(beforePos, afterPos);

          startTransition(async () => {
            setOptimisticIssues({
              type: "MOVE_CARD",
              issueId: sourceIssue.id,
              newStatus: targetStatus,
              newPosition: newPos,
            });

            announce(`Reordered ${sourceIssue.title}`);
            await updateIssueStatus(sourceIssue.id, targetStatus, newPos);
          });
        }
      },
    });
  }, [optimisticIssues, setOptimisticIssues, announce, startTransition]);

  const handleMoveCard = (issue: OptimisticIssue, targetStatus: IssueStatus) => {
    const columnCards = optimisticIssues
      .filter((i) => i.status === targetStatus)
      .sort((a: OptimisticIssue, b: OptimisticIssue) =>
        (a.position ?? "").localeCompare(b.position ?? "")
      );

    const lastCard = columnCards[columnCards.length - 1];
    const newPos = generatePositionBetween(lastCard?.position ?? null, null);

    startTransition(async () => {
      setOptimisticIssues({
        type: "MOVE_CARD",
        issueId: issue.id,
        newStatus: targetStatus,
        newPosition: newPos,
      });

      announce(`Moved ${issue.title} to ${targetStatus}`);
      await updateIssueStatus(issue.id, targetStatus, newPos);
    });
  };

  if (!isClient) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 h-full pb-4">
        {BASE_COLUMNS.map((col) => (
          <div key={col.id} className="h-full rounded-lg border border-border/40 bg-muted/20" />
        ))}
      </div>
    );
  }

  return (
    <>
      <LiveRegion message={announcement} />

      <div className="flex items-center justify-end pb-2">
        <Button
          type="button"
          variant={showDone ? "secondary" : "outline"}
          size="sm"
          onClick={() => setShowDone(!showDone)}
          className="h-7 px-2.5 text-xs gap-1.5 cursor-pointer"
        >
          <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{showDone ? "Hide Done" : "Show Done"}</span>
          {doneCount > 0 && (
            <span className="ml-1 rounded-full bg-muted px-1.5 py-0.2 text-[10px] font-mono">
              {doneCount}
            </span>
          )}
        </Button>
      </div>

      <div
        className={cn(
          "grid gap-3 h-full pb-4 overflow-x-auto transition-all",
          showDone
            ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 min-w-[1000px]"
            : "grid-cols-1 sm:grid-cols-2 md:grid-cols-4 min-w-[800px]"
        )}
      >
        {activeColumns.map((col) => {
          const colIssues = optimisticIssues
            .filter((i) => i.status === col.id)
            .sort((a: OptimisticIssue, b: OptimisticIssue) =>
              (a.position ?? "").localeCompare(b.position ?? "")
            );

          return (
            <KanbanColumn
              key={col.id}
              status={col.id}
              title={col.title}
              issues={colIssues}
              onMoveCard={handleMoveCard}
            />
          );
        })}
      </div>
    </>
  );
}