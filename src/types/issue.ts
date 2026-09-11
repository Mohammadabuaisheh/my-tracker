import { z } from "zod";

export const IssueStatusEnum = z.enum([
  "backlog",
  "todo",
  "in-progress",
  "in-review",
  "done",
]);

export const IssuePriorityEnum = z.enum([
  "no-priority",
  "low",
  "medium",
  "high",
  "urgent",
]);

export const createIssueSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(255, "Title is too long"),
  description: z.string().trim().optional(),
  status: IssueStatusEnum.default("backlog"),
  priority: IssuePriorityEnum.default("no-priority"),
  projectId: z.string().nullable().optional(),
  dueDate: z.date().nullable().optional(),
  prevPosition: z.string().nullable().optional(),
  nextPosition: z.string().nullable().optional(),
});

export const updateIssueSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(255).optional(),
  description: z.string().trim().nullable().optional(),
  status: IssueStatusEnum.optional(),
  priority: IssuePriorityEnum.optional(),
  position: z.string().optional(),
  projectId: z.string().nullable().optional(),
  dueDate: z.date().nullable().optional(),
});

export type IssueStatus = z.infer<typeof IssueStatusEnum>;
export type IssuePriority = z.infer<typeof IssuePriorityEnum>;
export type CreateIssueInput = z.infer<typeof createIssueSchema>;
export type UpdateIssueInput = z.infer<typeof updateIssueSchema>;