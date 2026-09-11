"use client";

import { useOptimistic } from "react";
import type { IssueStatus, IssuePriority } from "@/types/issue";

export interface OptimisticIssue {
  id: string;
  title: string;
  description: string | null;
  status: IssueStatus;
  priority: IssuePriority;
  position: string;
  projectId: string | null;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type IssueOptimisticAction =
  | { type: "create"; payload: OptimisticIssue }
  | { type: "update"; payload: Partial<OptimisticIssue> & { id: string } }
  | { type: "move"; payload: { id: string; status: IssueStatus; position: string } }
  | { type: "delete"; payload: { id: string } };

export function useOptimisticIssues(initialIssues: OptimisticIssue[]) {
  const [optimisticIssues, dispatchOptimistic] = useOptimistic(
    initialIssues,
    (current, action: IssueOptimisticAction) => {
      switch (action.type) {
        case "create":
          return [...current, action.payload];

        case "update":
          return current.map((issue) =>
            issue.id === action.payload.id
              ? { ...issue, ...action.payload, updatedAt: new Date() }
              : issue
          );

        case "move":
          return current.map((issue) =>
            issue.id === action.payload.id
              ? {
                  ...issue,
                  status: action.payload.status,
                  position: action.payload.position,
                  updatedAt: new Date(),
                }
              : issue
          );

        case "delete":
          return current.filter((issue) => issue.id !== action.payload.id);

        default:
          return current;
      }
    }
  );

  return { optimisticIssues, dispatchOptimistic };
}