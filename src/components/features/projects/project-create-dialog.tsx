"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createProject } from "@/actions/projects";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ProjectCreateDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const identifier = formData.get("identifier") as string;
    const description = (formData.get("description") as string) || undefined;

    startTransition(async () => {
      const res = await createProject({ name, identifier, description });
      if (res.success) {
        toast.success("Project created");
        setOpen(false);
      } else {
        toast.error(res.error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(
          buttonVariants({ size: "sm" }),
          "h-8 px-2.5 text-xs font-medium cursor-pointer"
        )}
      >
        <Plus className="h-3.5 w-3.5 mr-1.5" />
        New Project
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold tracking-tight">
            Create Project
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-muted-foreground uppercase">
              Name
            </label>
            <Input
              name="name"
              placeholder="Project name..."
              required
              disabled={isPending}
              className="text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-muted-foreground uppercase">
              Identifier (Prefix)
            </label>
            <Input
              name="identifier"
              placeholder="e.g. CORE"
              required
              maxLength={10}
              disabled={isPending}
              className="text-xs font-mono uppercase"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-muted-foreground uppercase">
              Description
            </label>
            <Textarea
              name="description"
              placeholder="What is this project focused on?"
              rows={3}
              disabled={isPending}
              className="text-xs resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              disabled={isPending}
              className="h-8 px-3 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isPending}
              className="h-8 px-3 text-xs font-medium"
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
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}