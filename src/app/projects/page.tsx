import { getProjectsWithStats } from "@/actions/projects";
import { ProjectCreateDialog } from "@/components/features/projects/project-create-dialog";
import { FolderKanban } from "lucide-react";

export default async function ProjectsPage() {
  const projectList = await getProjectsWithStats();

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Projects</h1>
          <p className="text-xs text-muted-foreground">
            Group issues by initiative and monitor delivery milestones.
          </p>
        </div>
        <ProjectCreateDialog />
      </div>

      {projectList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-lg">
          <FolderKanban className="h-8 w-8 text-muted-foreground/50 mb-2" />
          <p className="text-sm font-medium text-muted-foreground">No projects yet</p>
          <p className="text-xs text-muted-foreground/80 mt-1 max-w-sm">
            Group related tasks under common initiatives to track completion progress.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projectList.map((project) => (
            <div
              key={project.id}
              className="flex flex-col justify-between rounded-lg border border-border/80 bg-card p-4 shadow-xs hover:border-foreground/30 transition-all"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground font-semibold">
                    {project.identifier}
                  </span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {project.completedIssues}/{project.totalIssues} done
                  </span>
                </div>
                <h3 className="font-semibold text-sm tracking-tight">{project.name}</h3>
                {project.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>
                )}
              </div>

              <div className="pt-4 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Progress</span>
                  <span className="font-mono tabular-nums">{project.progress}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}