"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDueDate } from "@/lib/dates";
import {
  Calendar,
  AlertCircle,
  ArrowUp,
  ArrowRight,
  ArrowDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { IssuePriority, IssueStatus } from "@/types/issue";

interface IssueItem {
  id: string;
  title: string;
  description?: string | null;
  status: IssueStatus;
  priority: IssuePriority;
  dueDate?: Date | string | null;
  createdAt: Date | string;
}

interface IssueListProps {
  issues?: IssueItem[];
}

const priorityConfig = {
  urgent: { icon: AlertCircle, color: "text-red-500", label: "Urgent" },
  high: { icon: ArrowUp, color: "text-orange-500", label: "High" },
  medium: { icon: ArrowRight, color: "text-yellow-500", label: "Medium" },
  low: { icon: ArrowDown, color: "text-blue-500", label: "Low" },
  "no-priority": { icon: null, color: "text-muted-foreground", label: "None" },
};

const statusLabels: Record<IssueStatus, string> = {
  backlog: "Backlog",
  todo: "To Do",
  "in-progress": "In Progress",
  "in-review": "In Review",
  done: "Done",
};

export function IssueList({ issues = [] }: IssueListProps) {
  const router = useRouter();

  return (
    <div className="rounded-md border border-border/60 overflow-hidden bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border/40">
            <TableHead className="w-[100px] text-xs font-mono">ID</TableHead>
            <TableHead className="text-xs">Title</TableHead>
            <TableHead className="w-[120px] text-xs">Status</TableHead>
            <TableHead className="w-[110px] text-xs">Priority</TableHead>
            <TableHead className="w-[140px] text-xs">Due Date</TableHead>
            <TableHead className="w-[110px] text-right text-xs">Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issues.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={6}
                className="h-32 text-center text-xs text-muted-foreground"
              >
                No issues found
              </TableCell>
            </TableRow>
          ) : (
            issues.map((issue) => {
              const priority = priorityConfig[issue.priority] ?? priorityConfig["no-priority"];
              const PriorityIcon = priority.icon;
              const dueDateInfo = issue.dueDate ? formatDueDate(issue.dueDate) : null;

              return (
                <TableRow
                  key={issue.id}
                  onClick={() => router.push(`/issue/${issue.id}`, { scroll: false })}
                  className="group cursor-pointer hover:bg-muted/40 transition-colors border-border/40"
                >
                  <TableCell className="font-mono text-[11px] text-muted-foreground">
                    {issue.id.slice(0, 8)}
                  </TableCell>

                  <TableCell className="max-w-[320px]">
                    <Link
                      href={`/issue/${issue.id}`}
                      scroll={false}
                      onClick={(e) => e.stopPropagation()}
                      className="font-medium text-xs text-foreground group-hover:text-primary transition-colors hover:underline block truncate"
                    >
                      {issue.title}
                    </Link>
                    {issue.description && (
                      <span className="block truncate text-[11px] text-muted-foreground">
                        {issue.description}
                      </span>
                    )}
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className="text-[10px] capitalize font-normal">
                      {statusLabels[issue.status] ?? issue.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      {PriorityIcon && (
                        <PriorityIcon className={cn("h-3.5 w-3.5 shrink-0", priority.color)} />
                      )}
                      <span className="capitalize">{priority.label}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    {dueDateInfo ? (
                      <div
                        className={cn(
                          "flex items-center gap-1 text-[11px] font-mono",
                          dueDateInfo.isOverdue
                            ? "text-destructive font-semibold"
                            : "text-muted-foreground"
                        )}
                      >
                        <Calendar className="h-3 w-3 shrink-0" />
                        <span>{dueDateInfo.label}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground/40 text-xs">—</span>
                    )}
                  </TableCell>

                  <TableCell className="text-right text-[11px] text-muted-foreground tabular-nums">
                    {new Date(issue.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}