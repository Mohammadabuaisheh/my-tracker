import { db } from "@/db";
import { issues } from "@/db/schema";
import { and, inArray, asc, desc, eq } from "drizzle-orm";
import type { IssueStatus, IssuePriority } from "@/types/issue";

export interface IssueQueryFilters {
  search?: string;
  status?: IssueStatus[];
  priority?: IssuePriority[];
  sortBy?: "position" | "createdAt" | "priority";
  sortOrder?: "asc" | "desc";
  excludeCompleted?: boolean;
}

export async function getIssues(filters: IssueQueryFilters = {}) {
  const conditions = [];

  if (filters.status && filters.status.length > 0) {
    conditions.push(inArray(issues.status, filters.status));
  } else if (filters.excludeCompleted) {
    conditions.push(inArray(issues.status, ["todo", "in-progress", "in-review"]));
  }

  if (filters.priority && filters.priority.length > 0) {
    conditions.push(inArray(issues.priority, filters.priority));
  }

  const orderByColumn =
    filters.sortBy === "createdAt"
      ? filters.sortOrder === "desc"
        ? desc(issues.createdAt)
        : asc(issues.createdAt)
      : asc(issues.position);

  return await db
    .select()
    .from(issues)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(orderByColumn);
}

export async function getIssueById(id: string) {
  const [issue] = await db
    .select()
    .from(issues)
    .where(eq(issues.id, id))
    .limit(1);

  return issue ?? null;
}