import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const issues = sqliteTable("issues", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status", { enum: ["backlog", "todo", "in-progress", "in-review", "done"] })
    .notNull()
    .default("todo"),
  priority: text("priority", { enum: ["urgent", "high", "medium", "low", "no-priority"] })
    .notNull()
    .default("no-priority"),
  position: text("position").notNull().default("m"),
  projectId: text("project_id").references(() => projects.id, { onDelete: "set null" }),
  dueDate: integer("due_date", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const projects = sqliteTable("projects", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  identifier: text("identifier").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const activities = sqliteTable("activities", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  issueId: text("issue_id")
    .notNull()
    .references(() => issues.id, { onDelete: "cascade" }),
  actionType: text("action_type").notNull(), // 'created' | 'status_changed' | 'updated'
  metadata: text("metadata", { mode: "json" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export type Issue = typeof issues.$inferSelect;
export type NewIssue = typeof issues.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Activity = typeof activities.$inferSelect;
export type NewActivity = typeof activities.$inferInsert;