import { notFound } from "next/navigation";
import { getIssueById } from "@/db/queries/issues";
import { IssueDetailModal } from "./modal";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function InterceptedIssuePage({ params }: Props) {
  const { id } = await params;
  const issue = await getIssueById(id);

  if (!issue) {
    notFound();
  }

  return <IssueDetailModal issue={issue as any} />;
}