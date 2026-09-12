"use server";

import { db } from "@/db";
import { projects, issues } from "@/db/schema";
import { createProjectSchema, type CreateProjectInput } from "@/types/project";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createProject(rawInput: CreateProjectInput) {
  const result = createProjectSchema.safeParse(rawInput);
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const [project] = await db
      .insert(projects)
      .values(result.data)
      .returning();

    revalidatePath("/projects");
    return { success: true, data: project };
  } catch (error) {
    console.error("Failed to create project:", error);
    return { success: false, error: "Identifier must be unique." };
  }
}

export async function updateProject(id: string, name: string) {
  const trimmedName = name.trim();
  if (!trimmedName) {
    return { success: false, error: "Project name cannot be empty." };
  }

  try {
    const [updated] = await db
      .update(projects)
      .set({ name: trimmedName })
      .where(eq(projects.id, id))
      .returning();

    revalidatePath("/projects");
    revalidatePath("/");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Failed to update project:", error);
    return { success: false, error: "Failed to update project name." };
  }
}

export async function deleteProject(id: string) {
  try {
    // Safely unlink issues from this project before deleting
    await db
      .update(issues)
      .set({ projectId: null, updatedAt: new Date() })
      .where(eq(issues.projectId, id));

    await db.delete(projects).where(eq(projects.id, id));

    revalidatePath("/projects");
    revalidatePath("/");
    revalidatePath("/backlog");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete project:", error);
    return { success: false, error: "Failed to delete project" };
  }
}

export async function getProjects() {
  try {
    return await db.select().from(projects).orderBy(projects.createdAt);
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
}

export async function getProjectsWithStats() {
  const allProjects = await db.select().from(projects);
  const allIssues = await db.select().from(issues);

  return allProjects.map((project) => {
    const projectIssues = allIssues.filter((i) => i.projectId === project.id);
    const completedCount = projectIssues.filter((i) => i.status === "done").length;
    const progress =
      projectIssues.length > 0
        ? Math.round((completedCount / projectIssues.length) * 100)
        : 0;

    return {
      ...project,
      totalIssues: projectIssues.length,
      completedIssues: completedCount,
      progress,
    };
  });
}