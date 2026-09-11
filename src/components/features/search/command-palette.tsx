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
import {
  LayoutGrid,
  ListTodo,
  FolderKanban,
  Plus,
  CircleDot,
} from "lucide-react";
import type { OptimisticIssue } from "@/hooks/use-optimistic-issues";

export function CommandPalette({
  issues = [],
}: {
  issues?: OptimisticIssue[];
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [, startTransition] = useTransition();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    startTransition(() => {
      command();
    });
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search issues..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Quick Actions */}
        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() =>
              runCommand(() => {
                window.dispatchEvent(new KeyboardEvent("keydown", { key: "c" }));
              })
            }
            className="text-xs cursor-pointer"
          >
            <Plus className="mr-2 h-4 w-4" />
            <span>Create new issue</span>
            <kbd className="ml-auto font-mono text-[10px] text-muted-foreground rounded bg-muted px-1.5 py-0.5">
              C
            </kbd>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Navigation */}
        <CommandGroup heading="Navigation">
          <CommandItem
            onSelect={() => runCommand(() => router.push("/"))}
            className="text-xs cursor-pointer"
          >
            <LayoutGrid className="mr-2 h-4 w-4" />
            <span>Active Issues</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/backlog"))}
            className="text-xs cursor-pointer"
          >
            <ListTodo className="mr-2 h-4 w-4" />
            <span>Backlog</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/projects"))}
            className="text-xs cursor-pointer"
          >
            <FolderKanban className="mr-2 h-4 w-4" />
            <span>Projects</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Issues List Search */}
        {issues.length > 0 && (
          <CommandGroup heading="Issues">
            {issues.map((issue) => (
              <CommandItem
                key={issue.id}
                value={`${issue.title} ${issue.id} ${issue.description || ""}`}
                onSelect={() =>
                  runCommand(() => {
                    router.push(`/issue/${issue.id}`);
                  })
                }
                className="text-xs cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-2 truncate">
                  <CircleDot className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate">{issue.title}</span>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground tabular-nums shrink-0 ml-2">
                  {issue.id.slice(0, 8)}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}