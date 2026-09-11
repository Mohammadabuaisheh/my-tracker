import { notFound } from "next/navigation";
import { getIssueById, getIssueActivities } from "@/db/queries/issues";
import { IssueDetailView } from "@/components/features/issues/issue-detail-view";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function IssuePage({ params }: Props) {
  const { id } = await params;
  const issue = await getIssueById(id);

  if (!issue) {
    notFound();
  }

  const activities = await getIssueActivities(id);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Board</span>
      </Link>

      <div className="rounded-lg border border-border/60 bg-card p-6 shadow-xs">
        <IssueDetailView issue={issue} activities={activities} />
      </div>
    </div>
  );
}