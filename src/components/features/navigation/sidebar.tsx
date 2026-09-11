import { NavLinks } from "./nav-links";
import { IssueCreateDialog } from "@/components/features/issues/issue-create-dialog";

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-60 border-r border-border/60 bg-muted/20 p-3 h-full gap-4">
      <div className="flex items-center justify-between px-2 py-1">
        <span className="font-semibold text-sm tracking-tight text-foreground">
          My Tracker
        </span>
      </div>

      <IssueCreateDialog />

      <nav className="flex-1">
        <NavLinks />
      </nav>
    </aside>
  );
}