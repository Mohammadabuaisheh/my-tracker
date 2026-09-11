// Inside src/app/@modal/(.)issue/[id]/page.tsx
import { notFound } from "next/navigation";
import { getIssueById, getIssueActivities } from "@/db/queries/issues";
import { IssueDetailModal } from "./modal";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function InterceptedIssuePage({ params }: Props) {
  const { id } = await params;
  const issue = await getIssueById(id);

  if (!issue) notFound();

  const activities = await getIssueActivities(id);

  return <IssueDetailModal issue={issue} activities={activities} />;
}