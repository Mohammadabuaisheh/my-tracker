export function formatDueDate(dateInput: Date | string | null | undefined): {
  label: string;
  isOverdue: boolean;
} {
  if (!dateInput) return { label: "", isOverdue: false };

  const target = new Date(dateInput);
  const now = new Date();

  const targetDay = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffMs = targetDay.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  const isOverdue = diffDays < 0;

  if (diffDays === 0) return { label: "Today", isOverdue: false };
  if (diffDays === 1) return { label: "Tomorrow", isOverdue: false };
  if (diffDays === -1) return { label: "Yesterday", isOverdue: true };
  if (diffDays < -1) return { label: `${Math.abs(diffDays)}d overdue`, isOverdue: true };
  if (diffDays < 7) return { label: `In ${diffDays}d`, isOverdue: false };

  return {
    label: target.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    isOverdue,
  };
}