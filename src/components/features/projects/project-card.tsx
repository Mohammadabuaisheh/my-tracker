"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Check, MoreHorizontal, Pencil, Trash2, X } from "lucide-react";
import { deleteProject, updateProject } from "@/actions/projects";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    identifier: string;
  };
  total: number;
  done: number;
  progress: number;
}

export function ProjectCard({ project, total, done, progress }: ProjectCardProps) {
  const router = useRouter();
  const [isDeleting, startDeleteTransition] = useTransition();
  const [isSaving, startSaveTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(project.name);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm(`Delete "${project.name}"? Attached tasks will remain in your board.`)) {
      return;
    }

    startDeleteTransition(async () => {
      const res = await deleteProject(project.id);
      if (res.success) {
        toast.success("Project deleted");
      } else {
        toast.error(res.error || "Failed to delete project");
      }
    });
  };

  const handleSave = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Project name cannot be empty");
      return;
    }

    if (trimmed === project.name) {
      setIsEditing(false);
      return;
    }

    startSaveTransition(async () => {
      const res = await updateProject(project.id, trimmed);
      if (res.success) {
        toast.success("Project renamed");
        setIsEditing(false);
      } else {
        toast.error(res.error || "Failed to update project");
      }
    });
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setName(project.name);
    setIsEditing(false);
  };

  return (
    <div
      onClick={() => {
        if (!isEditing) {
          router.push(`/?project=${project.id}`);
        }
      }}
      className="group relative flex flex-col justify-between rounded-lg border border-border/70 bg-card p-4 hover:border-red-500/50 hover:shadow-xs transition-all cursor-pointer select-none"
    >
      <div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-mono text-[10px] tracking-wider uppercase font-semibold text-muted-foreground/80">
            {project.identifier}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="tabular-nums font-mono text-[11px]">
              {done}/{total} done
            </span>

            <DropdownMenu>
              <DropdownMenuTrigger
                onClick={(e) => e.stopPropagation()}
                className="h-6 w-6 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/80 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity cursor-pointer"
                aria-label={`Options for ${project.name}`}
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsEditing(true);
                    }}
                    className="text-xs cursor-pointer flex items-center gap-2"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={isDeleting}
                    onClick={handleDelete}
                    className="text-xs text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer flex items-center gap-2"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete Project
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {isEditing ? (
          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-2 flex items-center gap-1.5"
          >
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSave();
                } else if (e.key === "Escape") {
                  handleCancel(e as unknown as React.MouseEvent);
                }
              }}
              className="h-7 text-xs px-2 py-0"
              autoFocus
              disabled={isSaving}
            />
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSave}
              className="p-1 text-emerald-500 hover:text-emerald-400 disabled:opacity-50 cursor-pointer"
              title="Save name"
            >
              <Check className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={handleCancel}
              className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-50 cursor-pointer"
              title="Cancel"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <h3 className="mt-2 text-sm font-semibold text-foreground group-hover:text-red-500 transition-colors flex items-center justify-between">
            <span>{project.name}</span>
            <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
        )}
      </div>

      <div className="mt-5 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-red-600 transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}