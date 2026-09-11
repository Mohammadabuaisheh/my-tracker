"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { IssueDetailView } from "@/components/features/issues/issue-detail-view";
import type { Issue, Activity } from "@/db/schema";

interface IssueDetailModalProps {
  issue: Issue;
  activities?: Activity[];
}

export function IssueDetailModal({ issue, activities = [] }: IssueDetailModalProps) {
  const router = useRouter();

  return (
    <Dialog open onOpenChange={(open) => !open && router.back()}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogTitle className="sr-only">Issue Details</DialogTitle>
        <IssueDetailView
          issue={issue}
          activities={activities}
          onClose={() => router.back()}
        />
      </DialogContent>
    </Dialog>
  );
}