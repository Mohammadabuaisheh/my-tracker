"use server";

import { db } from "@/db";
import { issues } from "@/db/schema";
import { eq } from "drizzle-orm";
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

    await db.insert(issues).values({
      title,
      description,
      status,
      priority,
      position,
      dueDate,
    });

    revalidatePath("/");
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
    const sanitizedData = {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : data.dueDate === null ? null : undefined,
      updatedAt: new Date(),
    };

    // Remove undefined properties before updating
    Object.keys(sanitizedData).forEach(
      (key) =>
        sanitizedData[key as keyof typeof sanitizedData] === undefined &&
        delete sanitizedData[key as keyof typeof sanitizedData]
    );

    await db
      .update(issues)
      .set(sanitizedData)
      .where(eq(issues.id, id));

    revalidatePath("/");
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
    await db
      .update(issues)
      .set({
        status,
        position,
        updatedAt: new Date(),
      })
      .where(eq(issues.id, id));

    revalidatePath("/");
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
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete issue:", error);
    return { success: false, error: "Failed to delete issue" };
  }
}