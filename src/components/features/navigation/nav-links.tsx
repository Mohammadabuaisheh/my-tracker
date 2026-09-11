"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, ListTodo, FolderKanban } from "lucide-react";
import { cn } from "@/lib/utils";

const routes = [
  {
    label: "Active",
    href: "/",
    icon: LayoutGrid,
  },
  {
    label: "Backlog",
    href: "/backlog",
    icon: ListTodo,
  },
  {
    label: "Projects",
    href: "/projects",
    icon: FolderKanban,
  },
];

export function NavLinks({ className, onClick }: { className?: string, onClick?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex flex-col gap-1", className)}>
      {routes.map((route) => {
        const isActive = pathname === route.href;
        const Icon = route.icon;

        return (
          <Link
            key={route.href}
            href={route.href}
            onClick={onClick}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive 
                ? "bg-secondary text-secondary-foreground" 
                : "text-muted-foreground hover:bg-secondary/50 hover:text-primary"
            )}
          >
            <Icon className="h-4 w-4" />
            {route.label}
          </Link>
        );
      })}
    </nav>
  );
}