"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { IssueDetailView } from "@/components/features/issues/issue-detail-view";
import type { OptimisticIssue } from "@/hooks/use-optimistic-issues";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export function IssueDetailModal({ issue }: { issue: OptimisticIssue }) {
  const router = useRouter();

  return (
    <Dialog open onOpenChange={(isOpen) => !isOpen && router.back()}>
      <DialogContent className="sm:max-w-[640px] p-6 max-h-[85vh] overflow-y-auto">
        <VisuallyHidden>
          <DialogTitle>Issue Details</DialogTitle>
        </VisuallyHidden>
        <IssueDetailView issue={issue} isModal />
      </DialogContent>
    </Dialog>
  );
}