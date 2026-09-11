"use server";

import { db } from "@/db";
import { projects, issues } from "@/db/schema";
import { createProjectSchema, type CreateProjectInput } from "@/types/project";
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