import { db } from "@/db";
import { issues, activities } from "@/db/schema";
import { and, eq, inArray, desc } from "drizzle-orm";
import type { IssuePriority, IssueStatus } from "@/types/issue";

interface GetIssuesOptions {
  status?: IssueStatus[];
  priority?: IssuePriority[];
  projectId?: string;
}

export async function getIssues(options: GetIssuesOptions = {}) {
  const conditions = [];

  if (options.status && options.status.length > 0) {
    conditions.push(inArray(issues.status, options.status));
  }

  if (options.priority && options.priority.length > 0) {
    conditions.push(inArray(issues.priority, options.priority));
  }

  if (options.projectId) {
    conditions.push(eq(issues.projectId, options.projectId));
  }

  return await db
    .select()
    .from(issues)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(issues.position);
}

export async function getIssueById(id: string) {
  const [issue] = await db
    .select()
    .from(issues)
    .where(eq(issues.id, id))
    .limit(1);

  return issue ?? null;
}

export async function getIssueActivities(issueId: string) {
  return await db
    .select()
    .from(activities)
    .where(eq(activities.issueId, issueId))
    .orderBy(desc(activities.createdAt));
}