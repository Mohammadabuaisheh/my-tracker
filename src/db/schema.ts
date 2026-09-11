import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const projects = sqliteTable("projects", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  identifier: text("identifier").notNull().unique(), // e.g. "PROJ", "APP"
  description: text("description"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const issues = sqliteTable("issues", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status", {
    enum: ["backlog", "todo", "in-progress", "in-review", "done"],
  })
    .notNull()
    .default("backlog"),
  priority: text("priority", {
    enum: ["no-priority", "low", "medium", "high", "urgent"],
  })
    .notNull()
    .default("no-priority"),
  position: text("position").notNull(),
  projectId: text("project_id").references(() => projects.id, { onDelete: "set null" }),
  dueDate: integer("due_date", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const projectsRelations = relations(projects, ({ many }) => ({
  issues: many(issues),
}));

export const issuesRelations = relations(issues, ({ one }) => ({
  project: one(projects, {
    fields: [issues.projectId],
    references: [projects.id],
  }),
}));