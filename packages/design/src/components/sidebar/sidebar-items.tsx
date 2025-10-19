"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/design/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@repo/design/components/ui/sidebar";
import { cn } from "@repo/design/lib/utils";

interface NavItem {
  icon?: LucideIcon;
  title: string;
  url?: string;
  isActive?: boolean;
  items?: NavItem[];
}

interface NavItemsProps {
  items: NavItem[];
  Link: React.ReactElement<React.HTMLAttributes<HTMLAnchorElement>>;
}

export const NavItems = ({ items, Link }: NavItemsProps) => {
  const pathname = usePathname();

  const isActiveRoute = (url: string) =>
    url === "/" ? pathname === "/" : pathname.startsWith(url);
  const { state } = useSidebar();

  return items.map((item) => (
    <Collapsible
      key={item.title}
      open={state === "collapsed" ? true : undefined}
      defaultOpen={item.isActive}
      className="group/collapsible"
    >
      <SidebarGroup className="p-0">
        <SidebarGroupLabel
          asChild
          className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
        >
          <CollapsibleTrigger className="hover:bg-transparent hover:no-underline">
            {item.title}
            <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu className="pl-2">
              {item.items?.map((subItem) => {
                const isActive = isActiveRoute(subItem.url ?? "");
                return (
                  <SidebarItem
                    key={subItem.title}
                    item={subItem}
                    isActive={isActive}
                  />
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  ));
};

export const SidebarItem = ({
  item,
  isActive,
}: {
  item: NavItem;
  isActive: boolean;
}) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <SidebarMenuItem className="flex-1">
        <SidebarMenuButton
          asChild
          tooltip={item.title}
          isActive={isActive}
          className={cn({
            "**:text-primary": isActive,
          })}
        >
          <Link href={item.url ?? ""}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <span
        className={cn("border-primary h-4 rounded-l-lg border-r-4 opacity-0", {
          "opacity-100": isActive,
        })}
      />
    </div>
  );
};
