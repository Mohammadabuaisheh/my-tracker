import { db } from "@/db";
import { projects, issues } from "@/db/schema";
import { ProjectCreateDialog } from "@/components/features/projects/project-create-dialog";
import { ProjectCard } from "@/components/features/projects/project-card";
import { FolderKanban } from "lucide-react";

export default async function ProjectsPage() {
  const allProjects = await db.select().from(projects).orderBy(projects.createdAt);
  const allIssues = await db.select({ status: issues.status, projectId: issues.projectId }).from(issues);

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between border-b border-border/40 pb-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Projects</h1>
          <p className="text-xs text-muted-foreground">
            Group issues by initiative and monitor delivery milestones.
          </p>
        </div>
        <ProjectCreateDialog />
      </div>

      {allProjects.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-border/60 p-12 text-center">
          <FolderKanban className="h-8 w-8 text-muted-foreground mb-3" />
          <h3 className="text-sm font-semibold">No projects yet</h3>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            Create your first project to organize and track issues collectively.
          </p>
          <ProjectCreateDialog />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {allProjects.map((project) => {
            const projectIssues = allIssues.filter((i) => i.projectId === project.id);
            const total = projectIssues.length;
            const done = projectIssues.filter((i) => i.status === "done").length;
            const progress = total > 0 ? Math.round((done / total) * 100) : 0;

            return (
              <ProjectCard
                key={project.id}
                project={project}
                total={total}
                done={done}
                progress={progress}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}