"use server";

import { db } from "@/db";
import { issues } from "@/db/schema";
import {
  createIssueSchema,
  updateIssueSchema,
  CreateIssueInput,
  UpdateIssueInput,
} from "@/types/issue";
import { getLexicographicalIndex } from "@/lib/fractional-index";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createIssue(rawInput: CreateIssueInput) {
  const result = createIssueSchema.safeParse(rawInput);
  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const { title, description, status, priority, projectId, dueDate, prevPosition, nextPosition } =
    result.data;
  const position = getLexicographicalIndex(prevPosition ?? null, nextPosition ?? null);

  try {
    const [inserted] = await db
      .insert(issues)
      .values({
        title,
        description: description || null,
        status,
        priority,
        position,
        projectId: projectId || null,
        dueDate: dueDate || null,
      })
      .returning();

    revalidatePath("/");
    revalidatePath("/backlog");
    return { success: true, data: inserted };
  } catch (error) {
    console.error("Failed to create issue:", error);
    return { success: false, error: "Database error: Failed to create issue." };
  }
}

export async function updateIssue(id: string, rawInput: UpdateIssueInput) {
  const result = updateIssueSchema.safeParse(rawInput);
  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0]?.message ?? "Invalid input",
    };
  }

  try {
    const [updated] = await db
      .update(issues)
      .set({
        ...result.data,
        updatedAt: new Date(),
      })
      .where(eq(issues.id, id))
      .returning();

    revalidatePath("/");
    revalidatePath("/backlog");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Failed to update issue:", error);
    return { success: false, error: "Database error: Failed to update issue." };
  }
}

export async function deleteIssue(id: string) {
  try {
    await db.delete(issues).where(eq(issues.id, id));
    revalidatePath("/");
    revalidatePath("/backlog");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete issue:", error);
    return { success: false, error: "Database error: Failed to delete issue." };
  }
}

export interface FormActionState {
  success: boolean;
  error?: string;
  timestamp?: number;
}

export async function createIssueFormAction(
  _prevState: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  const dueDateRaw = formData.get("dueDate") as string;
  const rawInput = {
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || undefined,
    status: (formData.get("status") as any) || "todo",
    priority: (formData.get("priority") as any) || "no-priority",
    dueDate: dueDateRaw ? new Date(dueDateRaw) : null,
  };

  const result = await createIssue(rawInput);

  if (!result.success) {
    return {
      success: false,
      error: result.error,
      timestamp: Date.now(),
    };
  }

  return {
    success: true,
    timestamp: Date.now(),
  };
}