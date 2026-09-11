"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createIssueFormAction, type FormActionState } from "@/actions/issues";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { CalendarIcon, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface IssueCreateFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const initialState: FormActionState = {
  success: false,
};

export function IssueCreateForm({ onSuccess, onCancel }: IssueCreateFormProps) {
  const [state, formAction, isPending] = useActionState(createIssueFormAction, initialState);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (state.success) {
      toast.success("Issue created");
      onSuccess();
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, onSuccess]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  return (
    <form
      ref={formRef}
      action={formAction}
      onKeyDown={handleKeyDown}
      className="flex flex-col gap-4 pt-2"
    >
      <input
        type="hidden"
        name="dueDate"
        value={date ? date.toISOString() : ""}
      />

      <div className="space-y-1">
        <Input
          id="title"
          name="title"
          placeholder="Issue title..."
          autoFocus
          required
          disabled={isPending}
          className="text-sm font-medium"
        />
      </div>

      <div className="space-y-1">
        <Textarea
          id="description"
          name="description"
          placeholder="Add description (optional)..."
          rows={3}
          disabled={isPending}
          className="resize-none text-xs"
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-muted-foreground uppercase">
            Status
          </label>
          <Select name="status" defaultValue="todo" disabled={isPending}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="backlog" className="text-xs">Backlog</SelectItem>
              <SelectItem value="todo" className="text-xs">To Do</SelectItem>
              <SelectItem value="in-progress" className="text-xs">In Progress</SelectItem>
              <SelectItem value="in-review" className="text-xs">In Review</SelectItem>
              <SelectItem value="done" className="text-xs">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-medium text-muted-foreground uppercase">
            Priority
          </label>
          <Select name="priority" defaultValue="no-priority" disabled={isPending}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no-priority" className="text-xs">No Priority</SelectItem>
              <SelectItem value="low" className="text-xs">Low</SelectItem>
              <SelectItem value="medium" className="text-xs">Medium</SelectItem>
              <SelectItem value="high" className="text-xs">High</SelectItem>
              <SelectItem value="urgent" className="text-xs">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-medium text-muted-foreground uppercase">
            Due Date
          </label>
          <Popover>
            <PopoverTrigger
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "h-8 w-full justify-start text-left text-xs font-normal px-2 cursor-pointer",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-1.5 h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {date ? date.toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "Set date"}
              </span>
              {date && (
                <X
                  className="ml-auto h-3 w-3 hover:text-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDate(undefined);
                  }}
                />
              )}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => setDate(d)}
                autoFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border/40">
        <span className="text-[11px] text-muted-foreground">
          Press <kbd className="rounded border bg-muted px-1 py-0.5 font-mono text-[10px]">⌘</kbd> + <kbd className="rounded border bg-muted px-1 py-0.5 font-mono text-[10px]">Enter</kbd> to save
        </span>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isPending}
            onClick={onCancel}
            className="h-8 px-3 text-xs"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isPending}
            className="h-8 px-3 text-xs font-medium"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Issue"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}