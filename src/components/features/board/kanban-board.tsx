"use client";

import { useEffect, useMemo, useTransition } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { KanbanColumn } from "./kanban-column";
import { LiveRegion } from "@/components/ui/live-region";
import { useBoardAnnouncer } from "@/hooks/use-board-announcer";
import { useOptimisticIssues, type OptimisticIssue } from "@/hooks/use-optimistic-issues";
import { updateIssue } from "@/actions/issues";
import { getLexicographicalIndex } from "@/lib/fractional-index";
import { toast } from "sonner";
import type { IssueStatus } from "@/types/issue";

const ACTIVE_COLUMNS: { status: IssueStatus; title: string }[] = [
  { status: "todo", title: "To Do" },
  { status: "in-progress", title: "In Progress" },
  { status: "in-review", title: "In Review" },
  { status: "done", title: "Done" },
];

export function KanbanBoard({ issues: initialIssues }: { issues: OptimisticIssue[] }) {
  const { optimisticIssues, dispatchOptimistic } = useOptimisticIssues(initialIssues);
  const { announcement, announce } = useBoardAnnouncer();
  const [, startTransition] = useTransition();

  const groupedIssues = useMemo(() => {
    const map: Record<IssueStatus, OptimisticIssue[]> = {
      backlog: [],
      todo: [],
      "in-progress": [],
      "in-review": [],
      done: [],
    };

    for (const issue of optimisticIssues) {
      if (map[issue.status]) {
        map[issue.status].push(issue);
      }
    }

    for (const key of Object.keys(map) as IssueStatus[]) {
      map[key].sort((a, b) => (a.position < b.position ? -1 : a.position > b.position ? 1 : 0));
    }

    return map;
  }, [optimisticIssues]);

  const handleMoveCard = (issue: OptimisticIssue, targetStatus: IssueStatus, targetPosition?: string) => {
    let position = targetPosition;

    if (!position) {
      const colCards = groupedIssues[targetStatus] || [];
      const lastCard = colCards[colCards.length - 1];
      position = getLexicographicalIndex(lastCard ? lastCard.position : null, null);
    }

    startTransition(async () => {
      dispatchOptimistic({
        type: "move",
        payload: {
          id: issue.id,
          status: targetStatus,
          position,
        },
      });

      announce(`Moved issue ${issue.title} to ${targetStatus.replace("-", " ")}`);

      const res = await updateIssue(issue.id, {
        status: targetStatus,
        position,
      });

      if (!res.success) {
        toast.error("Failed to move issue: " + res.error);
      }
    });
  };

  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0];
        if (!destination) return;

        const sourceData = source.data as { type: string; issue: OptimisticIssue };
        if (sourceData.type !== "card") return;

        const draggedIssue = sourceData.issue;
        const destData = destination.data as {
          type: string;
          status?: IssueStatus;
          issue?: OptimisticIssue;
        };

        let targetStatus: IssueStatus = draggedIssue.status;
        let targetPosition: string = draggedIssue.position;

        if (destData.type === "column" && destData.status) {
          targetStatus = destData.status;
          const colCards = groupedIssues[targetStatus];
          const lastCard = colCards[colCards.length - 1];
          targetPosition = getLexicographicalIndex(lastCard ? lastCard.position : null, null);
        } else if (destData.type === "card" && destData.issue) {
          const targetCard = destData.issue;
          targetStatus = targetCard.status;

          const closestEdge = extractClosestEdge(destination.data);
          const colCards = groupedIssues[targetStatus].filter((c) => c.id !== draggedIssue.id);
          const targetIndex = colCards.findIndex((c) => c.id === targetCard.id);

          if (closestEdge === "top") {
            const prevCard = colCards[targetIndex - 1];
            targetPosition = getLexicographicalIndex(
              prevCard ? prevCard.position : null,
              targetCard.position
            );
          } else {
            const nextCard = colCards[targetIndex + 1];
            targetPosition = getLexicographicalIndex(
              targetCard.position,
              nextCard ? nextCard.position : null
            );
          }
        }

        if (targetStatus === draggedIssue.status && targetPosition === draggedIssue.position) {
          return;
        }

        handleMoveCard(draggedIssue, targetStatus, targetPosition);
      },
    });
  }, [groupedIssues]);

  return (
    <>
      <LiveRegion message={announcement} />
      <div className="flex h-full w-full gap-4 overflow-x-auto pb-4 pt-2">
        {ACTIVE_COLUMNS.map((col) => (
          <KanbanColumn
            key={col.status}
            status={col.status}
            title={col.title}
            issues={groupedIssues[col.status] || []}
            onMoveCard={handleMoveCard}
          />
        ))}
      </div>
    </>
  );
}