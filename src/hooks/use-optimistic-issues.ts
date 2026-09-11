"use client";

import { useOptimistic } from "react";
import type { IssueStatus, IssuePriority } from "@/types/issue";

export interface OptimisticIssue {
  id: string;
  title: string;
  description?: string | null;
  status: IssueStatus;
  priority: IssuePriority;
  position: string;
  projectId?: string | null;
  dueDate?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export type OptimisticAction =
  | {
      type: "MOVE_CARD";
      issueId: string;
      newStatus: IssueStatus;
      newPosition: string;
    }
  | {
      type: "UPDATE_ISSUE";
      issue: Partial<OptimisticIssue> & { id: string };
    }
  | {
      type: "DELETE_ISSUE";
      issueId: string;
    };

export function useOptimisticIssues(initialIssues: OptimisticIssue[]) {
  const [optimisticIssues, setOptimisticIssues] = useOptimistic(
    initialIssues,
    (state: OptimisticIssue[], action: OptimisticAction) => {
      switch (action.type) {
        case "MOVE_CARD":
          return state.map((issue) =>
            issue.id === action.issueId
              ? { ...issue, status: action.newStatus, position: action.newPosition }
              : issue
          );
        case "UPDATE_ISSUE":
          return state.map((issue) =>
            issue.id === action.issue.id ? { ...issue, ...action.issue } : issue
          );
        case "DELETE_ISSUE":
          return state.filter((issue) => issue.id !== action.issueId);
        default:
          return state;
      }
    }
  );

  return [optimisticIssues, setOptimisticIssues] as const;
}