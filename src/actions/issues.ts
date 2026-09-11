"use server";

import { db } from "@/db";
import { issues, activities } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { IssueStatus, IssuePriority } from "@/types/issue";

export interface FormActionState {
  success: boolean;
  error?: string;
}

export async function createIssueFormAction(
  _prevState: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const status = (formData.get("status") as IssueStatus) || "todo";
  const priority = (formData.get("priority") as IssuePriority) || "no-priority";

  const rawProjectId = (formData.get("projectId") as string)?.trim();
  const projectId = rawProjectId && rawProjectId !== "none" ? rawProjectId : null;

  const dueDateRaw = formData.get("dueDate") as string;
  const dueDate = dueDateRaw ? new Date(dueDateRaw) : null;

  if (!title) {
    return { success: false, error: "Title is required" };
  }

  try {
    const existingIssues = await db
      .select({ position: issues.position })
      .from(issues)
      .where(eq(issues.status, status));

    const position =
      existingIssues.length > 0
        ? existingIssues[existingIssues.length - 1].position + "m"
        : "m";

    const [created] = await db
      .insert(issues)
      .values({
        title,
        description,
        status,
        priority,
        position,
        dueDate,
        projectId,
      })
      .returning();

    // Sync to SQLite FTS5 index
    try {
      await db.run(sql`
        INSERT INTO issues_fts (id, title, description)
        VALUES (${created.id}, ${created.title}, ${created.description ?? ""});
      `);
    } catch {
      // Continue safely if FTS virtual table has not initialized yet
    }

    // Log creation activity
    await db.insert(activities).values({
      issueId: created.id,
      actionType: "created",
      metadata: { title: created.title, status: created.status },
    });

    revalidatePath("/");
    revalidatePath("/backlog");
    revalidatePath("/projects");
    return { success: true };
  } catch (error) {
    console.error("Failed to create issue:", error);
    return { success: false, error: "Database error creating issue" };
  }
}

export async function updateIssue(
  id: string,
  data: Partial<{
    title: string;
    description: string | null;
    status: IssueStatus;
    priority: IssuePriority;
    dueDate: Date | string | null;
    projectId: string | null;
    position: string;
  }>
) {
  try {
    const [existing] = await db.select().from(issues).where(eq(issues.id, id)).limit(1);

    const sanitizedData = {
      ...data,
      projectId: data.projectId === "none" ? null : data.projectId,
      dueDate: data.dueDate ? new Date(data.dueDate) : data.dueDate === null ? null : undefined,
      updatedAt: new Date(),
    };

    Object.keys(sanitizedData).forEach(
      (key) =>
        sanitizedData[key as keyof typeof sanitizedData] === undefined &&
        delete sanitizedData[key as keyof typeof sanitizedData]
    );

    await db.update(issues).set(sanitizedData).where(eq(issues.id, id));

    // Sync title/description edits to SQLite FTS5 index
    if (data.title !== undefined || data.description !== undefined) {
      try {
        await db.run(sql`
          UPDATE issues_fts
          SET title = COALESCE(${data.title ?? null}, title),
              description = COALESCE(${data.description ?? null}, description)
          WHERE id = ${id};
        `);
      } catch {
        // Continue if FTS sync fails
      }
    }

    // Audit log specific changes
    if (data.status && existing && existing.status !== data.status) {
      await db.insert(activities).values({
        issueId: id,
        actionType: "status_changed",
        metadata: { from: existing.status, to: data.status },
      });
    } else {
      await db.insert(activities).values({
        issueId: id,
        actionType: "updated",
        metadata: { updatedFields: Object.keys(data) },
      });
    }

    revalidatePath("/");
    revalidatePath("/backlog");
    revalidatePath("/projects");
    revalidatePath(`/issue/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update issue:", error);
    return { success: false, error: "Failed to update issue" };
  }
}

export async function updateIssueStatus(
  id: string,
  status: IssueStatus,
  position: string
) {
  try {
    const [existing] = await db.select().from(issues).where(eq(issues.id, id)).limit(1);

    await db
      .update(issues)
      .set({
        status,
        position,
        updatedAt: new Date(),
      })
      .where(eq(issues.id, id));

    if (existing && existing.status !== status) {
      await db.insert(activities).values({
        issueId: id,
        actionType: "status_changed",
        metadata: { from: existing.status, to: status },
      });
    }

    revalidatePath("/");
    revalidatePath("/backlog");
    revalidatePath("/projects");
    revalidatePath(`/issue/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update issue status:", error);
    return { success: false, error: "Failed to update issue status" };
  }
}

export async function deleteIssue(id: string) {
  try {
    await db.delete(issues).where(eq(issues.id, id));

    // Clean up record from SQLite FTS5 index
    try {
      await db.run(sql`
        DELETE FROM issues_fts WHERE id = ${id};
      `);
    } catch {
      // Continue if FTS record cleanup fails
    }

    revalidatePath("/");
    revalidatePath("/backlog");
    revalidatePath("/projects");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete issue:", error);
    return { success: false, error: "Failed to delete issue" };
  }
}