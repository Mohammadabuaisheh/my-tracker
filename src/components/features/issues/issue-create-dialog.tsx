"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { IssueCreateForm } from "./issue-create-form";
import { cn } from "@/lib/utils";

export function IssueCreateDialog() {
  const [open, setOpen] = useState(false);
  const [submittedAt, setSubmittedAt] = useState(() => Date.now());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInputFocused =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable;

      if ((e.key === "c" || e.key === "C") && !isInputFocused && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSuccess = () => {
    setSubmittedAt(Date.now());
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(
          buttonVariants({ size: "sm" }),
          "w-full justify-start gap-2 h-8 text-xs font-medium px-2.5 shadow-xs cursor-pointer"
        )}
      >
        <Plus className="h-3.5 w-3.5" />
        <span>New Issue</span>
        <kbd className="ml-auto font-mono text-[10px] text-muted-foreground/90 rounded bg-background/20 px-1.5 py-0.5">
          C
        </kbd>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px] p-5">
        <DialogHeader className="pb-1">
          <DialogTitle className="text-sm font-semibold tracking-tight">
            Create Issue
          </DialogTitle>
        </DialogHeader>

        <IssueCreateForm
          key={submittedAt}
          onSuccess={handleSuccess}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}