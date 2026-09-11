"use client";

import { useQueryState } from "nuqs";
import { issueFiltersParsers } from "@/lib/search-params";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";

export function ViewSwitcher() {
  const [view, setView] = useQueryState(
    "view",
    issueFiltersParsers.view.withOptions({ shallow: false })
  );

  return (
    <div className="flex items-center rounded-md border border-border/80 bg-muted/30 p-0.5">
      <Button
        variant={view === "board" ? "secondary" : "ghost"}
        size="sm"
        className="h-7 px-2.5 text-xs"
        onClick={() => setView("board")}
        aria-label="Board view"
      >
        <LayoutGrid className="mr-1.5 h-3.5 w-3.5" />
        Board
      </Button>
      <Button
        variant={view === "list" ? "secondary" : "ghost"}
        size="sm"
        className="h-7 px-2.5 text-xs"
        onClick={() => setView("list")}
        aria-label="List view"
      >
        <List className="mr-1.5 h-3.5 w-3.5" />
        List
      </Button>
    </div>
  );
}