"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NavLinks } from "./nav-links";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex md:hidden items-center justify-between border-b border-border/60 px-4 h-12 bg-background/95 backdrop-blur-xs">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-8 w-8 p-0 cursor-pointer")}
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-4 w-4" />
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-4">
          <VisuallyHidden>
            <SheetTitle>Navigation Menu</SheetTitle>
          </VisuallyHidden>
          <div className="font-semibold text-sm tracking-tight mb-4 px-2">
            My Tracker
          </div>
          <NavLinks onClick={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <span className="font-semibold text-xs tracking-tight">My Tracker</span>
      <div className="w-8" />
    </header>
  );
}