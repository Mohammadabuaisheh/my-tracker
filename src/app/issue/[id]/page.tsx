import { notFound } from "next/navigation";
import Link from "next/link";
import { getIssueById } from "@/db/queries/issues";
import { IssueDetailView } from "@/components/features/issues/issue-detail-view";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function StandaloneIssuePage({ params }: Props) {
  const { id } = await params;
  const issue = await getIssueById(id);

  if (!issue) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-4">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "h-8 px-2 text-xs -ml-2 gap-1.5 inline-flex"
        )}
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to issues
      </Link>

      <div className="rounded-lg border border-border/80 bg-card p-6 shadow-xs">
        <IssueDetailView issue={issue as any} isModal={false} />
      </div>
    </div>
  );
}