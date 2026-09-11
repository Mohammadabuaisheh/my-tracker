"use client";

import { useState, useTransition } from "react";
import { Plus, Loader2 } from "lucide-react";
import { createProject } from "@/actions/projects";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function ProjectCreateDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!identifier || identifier.length <= 4) {
      const generated = val
        .trim()
        .slice(0, 4)
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "");
      setIdentifier(generated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !identifier.trim()) {
      toast.error("Name and key identifier are required");
      return;
    }

    startTransition(async () => {
      const res = await createProject({
        name: name.trim(),
        identifier: identifier.trim().toUpperCase(),
      });

      if (res.success) {
        toast.success(`Project "${name}" created`);
        setName("");
        setIdentifier("");
        setOpen(false);
      } else {
        toast.error(res.error || "Failed to create project");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(
          buttonVariants({ size: "sm" }),
          "h-8 gap-1.5 text-xs font-medium cursor-pointer"
        )}
      >
        <Plus className="h-3.5 w-3.5" />
        <span>New Project</span>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Create Project</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Group related issues together under an initiative and track progress milestones.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Project Name
              </label>
              <Input
                placeholder="e.g., Mobile Redesign, Core API"
                value={name}
                onChange={handleNameChange}
                disabled={isPending}
                autoFocus
                required
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Identifier Key
              </label>
              <Input
                placeholder="e.g., CORE, MOB"
                maxLength={8}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value.toUpperCase())}
                disabled={isPending}
                required
                className="h-8 text-xs font-mono uppercase tracking-wider"
              />
              <p className="text-[10px] text-muted-foreground">
                Short uppercase prefix used to reference this project.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isPending}
              onClick={() => setOpen(false)}
              className="h-8 text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isPending}
              className="h-8 text-xs font-medium cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Project"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}