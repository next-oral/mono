import * as React from "react";
import { Separator } from "@radix-ui/react-separator";
import {
  ArrowDown,
  ArrowUp,
  Calculator,
  Calendar,
  CornerDownLeft,
  CreditCard,
  Search,
  Settings,
  Smile,
  User,
} from "lucide-react";

import {
  SidebarGroup,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@repo/design/components/ui/sidebar";
import { HugeIcons } from "@repo/design/icons";
import { cn } from "@repo/design/lib/utils";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "../ui/command";

export function NavHeader({
  showInbox,
  setShowInbox,
}: {
  showInbox: boolean;
  setShowInbox: (show: boolean) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const { state, isMobile } = useSidebar();

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
      <SidebarGroup className="space-y-2">
        <SidebarMenuItem onClick={() => setOpen(true)} className="list-none">
          <SidebarMenuButton
            tooltip="Search"
            className={cn("gap-2 border", {
              "border-none": state === "collapsed",
            })}
          >
            <Search className="size-4" />
            {(state === "expanded" || isMobile) && (
              <>
                <span>Search</span>
                <kbd className="bg-muted pointer-events-none absolute top-[0.3rem] right-[0.3rem] hidden h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </>
            )}
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem className="list-none">
          <SidebarMenuButton
            tooltip="Notifications"
            className="gap-2"
            onClick={() => setShowInbox(!showInbox)}
          >
            <HugeIcons.Notifications className="size-4" />
            <span>Notifications</span>
            <span className="bg-destructive ml-auto aspect-square size-1.5 rounded-full" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarGroup>
      <Separator className={cn({ hidden: state === "expanded" })} />
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <Calendar />
              <span>Calendar</span>
            </CommandItem>
            <CommandItem>
              <Smile />
              <span>Search Emoji</span>
            </CommandItem>
            <CommandItem>
              <Calculator />
              <span>Calculator</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <User />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <CreditCard />
              <span>Billing</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Settings />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
        <div className="flex w-full items-center justify-between bg-slate-100 p-2 **:text-[10px]">
          <div
            className="inline-flex w-full items-center justify-start gap-1 p-0 text-slate-500"
            onClick={() => setOpen(false)}
          >
            <kbd className="pointer-events-none h-5 items-center gap-1 rounded-sm border bg-white px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex">
              <span>Esc</span>
            </kbd>
            <span>To close</span>
          </div>
          <div className="flex w-full gap-2">
            <div
              className="flex w-full items-center justify-center gap-1 p-0 *:text-slate-500"
              onClick={() => setOpen(false)}
            >
              <kbd className="pointer-events-none h-5 items-center gap-1 rounded-sm border bg-white px-1.5 font-mono font-medium opacity-100 select-none sm:flex">
                <span className="text-xs">
                  <ArrowUp className="size-3" />
                </span>
              </kbd>
              <kbd className="pointer-events-none h-5 items-center gap-1 rounded-sm border bg-white px-1.5 font-mono font-medium opacity-100 select-none sm:flex">
                <span className="text-xs">
                  <ArrowDown className="size-3" />
                </span>
              </kbd>
              <span>To navigate</span>
            </div>
            <div
              className="flex w-full items-center justify-center gap-1 bg-slate-100 text-sm"
              onClick={() => setOpen(false)}
            >
              <kbd className="pointer-events-none h-5 items-center gap-1 rounded-sm border bg-white px-1.5 font-mono font-medium opacity-100 select-none sm:flex">
                <CornerDownLeft className="size-3 text-slate-500" />
              </kbd>
              <span className="text-slate-500">To select</span>
            </div>
          </div>
        </div>
      </CommandDialog>
    </>
  );
}
