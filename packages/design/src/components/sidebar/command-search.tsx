"use client";

import * as React from "react";
import {
  Calculator,
  Calendar,
  CornerDownLeftIcon,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@repo/design/components/ui/command";
import { useIsMac } from "@repo/design/hooks/use-is-mac";
import { cn } from "@repo/design/lib/utils";

import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export function CommandSearch() {
  const [open, setOpen] = React.useState(false);

  const isMac = useIsMac();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button
        variant="secondary"
        className={cn(
          "bg-surface text-surface-foreground/60 dark:bg-card relative h-8 w-full justify-start border pl-2.5 font-normal shadow-none sm:pr-12",
        )}
        onClick={() => setOpen(true)}
      >
        <span className="inline-flex">Search...</span>
        <div className="absolute top-1.5 right-1.5 hidden gap-1 sm:flex">
          <CommandMenuKbd>{isMac ? "⌘" : "Ctrl"}</CommandMenuKbd>
          <CommandMenuKbd className="aspect-square">K</CommandMenuKbd>
        </div>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList className="no-scrollbar mb-10 flex-1 overflow-y-auto">
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <Calendar className="mr-2 size-4" />
              <span>Calendar</span>
            </CommandItem>
            <CommandItem>
              <Smile className="mr-2 size-4" />
              <span>Search Emoji</span>
            </CommandItem>
            <CommandItem>
              <Calculator className="mr-2 size-4" />
              <span>Calculator</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <User className="mr-2 size-4" />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <CreditCard className="mr-2 size-4" />
              <span>Billing</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Settings className="mr-2 size-4" />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
        <div className="text-muted-foreground absolute inset-x-0 bottom-0 z-20 flex h-10 items-center gap-2 rounded-b-xl border-t border-t-neutral-100 bg-neutral-50 px-4 text-xs font-medium dark:border-t-neutral-700 dark:bg-neutral-800">
          <div className="flex items-center gap-2">
            <CommandMenuKbd>
              <CornerDownLeftIcon />
            </CommandMenuKbd>{" "}
            Go to Page
          </div>

          <>
            <Separator orientation="vertical" className="!h-4" />
            <div className="flex items-center gap-1">
              <CommandMenuKbd>{isMac ? "⌘" : "Ctrl"}</CommandMenuKbd>
              <CommandMenuKbd>C</CommandMenuKbd>
              Go to Page
            </div>
          </>
        </div>
      </CommandDialog>
    </>
  );
}

function CommandMenuKbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "bg-background text-muted-foreground pointer-events-none flex h-5 items-center justify-center gap-1 rounded border px-1 font-sans text-[0.7rem] font-medium select-none [&_svg:not([class*='size-'])]:size-3",
        className,
      )}
      {...props}
    />
  );
}
