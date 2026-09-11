"use client";

import { useState, useTransition } from "react";
import { updateIssue, deleteIssue } from "@/actions/issues";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import type { OptimisticIssue } from "@/hooks/use-optimistic-issues";
import type { IssuePriority, IssueStatus } from "@/types/issue";
import { useRouter } from "next/navigation";

export function IssueDetailView({
  issue,
  isModal = false,
}: {
  issue: OptimisticIssue;
  isModal?: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(issue.title);
  const [description, setDescription] = useState(issue.description || "");
  const [status, setStatus] = useState<IssueStatus>(issue.status);
  const [priority, setPriority] = useState<IssuePriority>(issue.priority);

  const handleUpdate = (
    updates: Partial<{
      title: string;
      description: string;
      status: IssueStatus;
      priority: IssuePriority;
    }>
  ) => {
    startTransition(async () => {
      const res = await updateIssue(issue.id, updates);
      if (res.success) {
        toast.success("Issue updated");
      } else {
        toast.error("Failed to update: " + res.error);
      }
    });
  };

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this issue?")) return;
    startTransition(async () => {
      const res = await deleteIssue(issue.id);
      if (res.success) {
        toast.success("Issue deleted");
        if (isModal) {
          router.back();
        } else {
          router.push("/");
        }
      } else {
        toast.error("Failed to delete issue");
      }
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-3">
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {issue.id}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={isPending}
          className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-3.5 w-3.5 mr-1" />
          Delete
        </Button>
      </div>

      <div className="space-y-1">
        <Input
          value={title}
          disabled={isPending}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => {
            if (title.trim() && title !== issue.title) {
              handleUpdate({ title: title.trim() });
            }
          }}
          className="text-base font-semibold tracking-tight border-none px-0 shadow-none focus-visible:ring-0"
          placeholder="Issue title..."
        />
      </div>

      <div className="grid grid-cols-2 gap-3 pb-2 border-b border-border/40">
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-muted-foreground uppercase">
            Status
          </label>
          <Select
            value={status}
            disabled={isPending}
            onValueChange={(val) => {
              if (!val) return;
              const newStatus = val as IssueStatus;
              setStatus(newStatus);
              handleUpdate({ status: newStatus });
            }}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="backlog" className="text-xs">Backlog</SelectItem>
              <SelectItem value="todo" className="text-xs">To Do</SelectItem>
              <SelectItem value="in-progress" className="text-xs">In Progress</SelectItem>
              <SelectItem value="in-review" className="text-xs">In Review</SelectItem>
              <SelectItem value="done" className="text-xs">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-medium text-muted-foreground uppercase">
            Priority
          </label>
          <Select
            value={priority}
            disabled={isPending}
            onValueChange={(val) => {
              if (!val) return;
              const newPriority = val as IssuePriority;
              setPriority(newPriority);
              handleUpdate({ priority: newPriority });
            }}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no-priority" className="text-xs">No Priority</SelectItem>
              <SelectItem value="low" className="text-xs">Low</SelectItem>
              <SelectItem value="medium" className="text-xs">Medium</SelectItem>
              <SelectItem value="high" className="text-xs">High</SelectItem>
              <SelectItem value="urgent" className="text-xs">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[11px] font-medium text-muted-foreground uppercase">
          Description
        </label>
        <Textarea
          value={description}
          disabled={isPending}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => {
            if (description !== (issue.description || "")) {
              handleUpdate({ description: description.trim() });
            }
          }}
          rows={6}
          placeholder="Add detailed issue description..."
          className="text-xs resize-none"
        />
      </div>

      {isPending && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Saving changes...</span>
        </div>
      )}
    </div>
  );
}