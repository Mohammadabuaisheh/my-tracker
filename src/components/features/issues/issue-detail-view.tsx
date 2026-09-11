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
import { Trash2, History, Clock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Issue, Activity } from "@/db/schema";
import type { IssuePriority, IssueStatus } from "@/types/issue";

interface IssueDetailViewProps {
  issue: Issue;
  activities?: Activity[];
  onClose?: () => void;
}

export function IssueDetailView({
  issue,
  activities = [],
  onClose,
}: IssueDetailViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(issue.title);
  const [description, setDescription] = useState(issue.description ?? "");
  const [status, setStatus] = useState<IssueStatus>(issue.status as IssueStatus);
  const [priority, setPriority] = useState<IssuePriority>(
    issue.priority as IssuePriority
  );

  const handleTitleBlur = () => {
    if (title.trim() === "" || title === issue.title) {
      setTitle(issue.title);
      return;
    }
    startTransition(async () => {
      const res = await updateIssue(issue.id, { title: title.trim() });
      if (res.success) toast.success("Title updated");
      else toast.error("Failed to update title");
    });
  };

  const handleDescriptionBlur = () => {
    if (description === (issue.description ?? "")) return;
    startTransition(async () => {
      const res = await updateIssue(issue.id, {
        description: description.trim() || null,
      });
      if (res.success) toast.success("Description updated");
      else toast.error("Failed to update description");
    });
  };



const handleStatusChange = (val: IssueStatus | null) => {
  if (!val) return;
  setStatus(val);
  startTransition(async () => {
    const res = await updateIssue(issue.id, { status: val });
    if (res.success) toast.success(`Moved to ${val}`);
    else toast.error("Failed to update status");
  });
};

const handlePriorityChange = (val: IssuePriority | null) => {
  if (!val) return;
  setPriority(val);
  startTransition(async () => {
    const res = await updateIssue(issue.id, { priority: val });
    if (res.success) toast.success(`Priority updated to ${val}`);
    else toast.error("Failed to update priority");
  });
};

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this issue?")) return;
    startTransition(async () => {
      const res = await deleteIssue(issue.id);
      if (res.success) {
        toast.success("Issue deleted");
        if (onClose) onClose();
        else router.push("/");
      } else {
        toast.error("Failed to delete issue");
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Top Header: ID & Delete Action */}
      <div className="flex items-center justify-between pb-3 border-b border-border/40 pr-8">
        <span className="font-mono text-xs text-muted-foreground/70 select-all">
          {issue.id}
        </span>
        <Button
          variant="ghost"
          size="sm"
          disabled={isPending}
          onClick={handleDelete}
          className="h-8 px-2.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive gap-1.5 cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Delete</span>
        </Button>
      </div>

      {/* Title */}
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleTitleBlur}
        disabled={isPending}
        className="text-base font-semibold border-none px-0 shadow-none focus-visible:ring-0 bg-transparent"
      />

      {/* Status & Priority Row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-muted-foreground uppercase">
            Status
          </label>
          <Select
            value={status}
            onValueChange={handleStatusChange}
            disabled={isPending}
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
            onValueChange={handlePriorityChange}
            disabled={isPending}
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

      {/* Description */}
      <div className="space-y-1 pt-2">
        <label className="text-[11px] font-medium text-muted-foreground uppercase">
          Description
        </label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={handleDescriptionBlur}
          placeholder="Add detailed issue description..."
          rows={4}
          disabled={isPending}
          className="text-xs resize-none"
        />
      </div>

      {/* Activity History Feed */}
      <div className="pt-4 border-t border-border/40 space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <History className="h-3.5 w-3.5" />
          <span>Activity Log</span>
        </div>

        {activities.length === 0 ? (
          <p className="text-[11px] text-muted-foreground/60 italic">
            No activity logged yet.
          </p>
        ) : (
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {activities.map((act) => {
              const meta = (act.metadata as any) ?? {};
              return (
                <div
                  key={act.id}
                  className="flex items-start justify-between text-xs py-1 border-b border-border/20 last:border-0"
                >
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-3 w-3 shrink-0" />
                    {act.actionType === "created" && (
                      <span>Created issue</span>
                    )}
                    {act.actionType === "status_changed" && (
                      <span className="inline-flex items-center gap-1 text-foreground">
                        Moved from{" "}
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {meta.from}
                        </span>
                        <ArrowRight className="h-2.5 w-2.5" />
                        <span className="font-mono text-[10px] text-red-500 font-semibold">
                          {meta.to}
                        </span>
                      </span>
                    )}
                    {act.actionType === "updated" && (
                      <span>Updated task details</span>
                    )}
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground/60 tabular-nums">
                    {new Date(act.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}