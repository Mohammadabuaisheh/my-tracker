"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { executeSearch } from "@/actions/search";
import type { SearchResult } from "@/db/queries/search";
import {
  Kanban,
  Inbox,
  FolderKanban,
  FileText,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Debounced search query
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      startTransition(async () => {
        const hits = await executeSearch(query);
        setResults(hits);
      });
    }, 120);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectIssue = (id: string) => {
    setOpen(false);
    setQuery("");
    router.push(`/issue/${id}`);
  };

  const handleNavigate = (path: string) => {
    setOpen(false);
    setQuery("");
    router.push(path);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Type a command or search issues..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {isPending && (
          <div className="flex items-center justify-center p-4 text-xs text-muted-foreground gap-2">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Searching...</span>
          </div>
        )}

        {!isPending && query.trim() && results.length === 0 && (
          <CommandEmpty>No matching issues found.</CommandEmpty>
        )}

        {/* FTS Search Hits */}
        {results.length > 0 && (
          <CommandGroup heading="Issues">
            {results.map((issue) => (
              <CommandItem
                key={issue.id}
                value={`${issue.title} ${issue.id}`}
                onSelect={() => handleSelectIssue(issue.id)}
                className="flex items-center justify-between cursor-pointer py-2"
              >
                <div className="flex items-center gap-2 overflow-hidden mr-2">
                  <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate text-xs font-medium text-foreground">
                    {issue.title}
                  </span>
                  {issue.description && (
                    <span className="truncate text-[11px] text-muted-foreground">
                      — {issue.description}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Badge variant="outline" className="text-[10px] uppercase font-mono">
                    {issue.status}
                  </Badge>
                  <span className="font-mono text-[10px] text-muted-foreground/60">
                    {issue.id.slice(0, 6)}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandSeparator />

        {/* Quick Navigation Commands */}
        <CommandGroup heading="Navigation">
          <CommandItem
            onSelect={() => handleNavigate("/")}
            className="cursor-pointer gap-2 text-xs"
          >
            <Kanban className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Go to Active Board</span>
          </CommandItem>
          <CommandItem
            onSelect={() => handleNavigate("/backlog")}
            className="cursor-pointer gap-2 text-xs"
          >
            <Inbox className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Go to Backlog</span>
          </CommandItem>
          <CommandItem
            onSelect={() => handleNavigate("/projects")}
            className="cursor-pointer gap-2 text-xs"
          >
            <FolderKanban className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Go to Projects</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}