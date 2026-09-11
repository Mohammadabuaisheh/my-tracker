import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { OptimisticIssue } from "@/hooks/use-optimistic-issues";

const priorityVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  urgent: "destructive",
  high: "default",
  medium: "secondary",
  low: "outline",
  "no-priority": "outline",
};

export function IssueList({ issues }: { issues: OptimisticIssue[] }) {
  return (
    <div className="rounded-md border mt-4">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[100px] text-xs font-semibold uppercase">ID</TableHead>
            <TableHead className="text-xs font-semibold uppercase">Title</TableHead>
            <TableHead className="w-[120px] text-xs font-semibold uppercase">Status</TableHead>
            <TableHead className="w-[100px] text-xs font-semibold uppercase">Priority</TableHead>
            <TableHead className="w-[120px] text-right text-xs font-semibold uppercase">Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issues.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-32 text-center text-xs text-muted-foreground">
                No issues found. Adjust active filters or create a new issue to get started.
              </TableCell>
            </TableRow>
          ) : (
            issues.map((issue) => (
              <TableRow key={issue.id} className="cursor-pointer group">
                <TableCell className="font-mono text-xs text-muted-foreground tabular-nums">
                  {issue.id.slice(0, 8)}
                </TableCell>
                <TableCell className="font-medium text-sm">
                  <Link href={`/issue/${issue.id}`} scroll={false} className="hover:underline">
                    <span className="group-hover:text-primary transition-colors">
                      {issue.title}
                    </span>
                  </Link>
                  {issue.description && (
                    <p className="text-xs text-muted-foreground truncate max-w-md font-normal">
                      {issue.description}
                    </p>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize text-xs font-normal">
                    {issue.status.replace("-", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={priorityVariants[issue.priority] ?? "outline"}
                    className="capitalize text-xs font-normal"
                  >
                    {issue.priority.replace("-", " ")}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-xs text-muted-foreground tabular-nums">
                  {new Date(issue.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}