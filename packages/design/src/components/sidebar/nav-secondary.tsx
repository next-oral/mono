import type { LucideIcon } from "lucide-react";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/design/components/ui/sidebar";
import { cn } from "@repo/design/lib/utils";

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname();

  const isActiveRoute = (url: string) =>
    url === "/" ? pathname === "/" : pathname.startsWith(url);

  return (
    <SidebarGroup className="p-0 pl-2" {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = isActiveRoute(item.url);
            return (
              <div
                key={item.title}
                className="flex items-center justify-between gap-2"
              >
                <SidebarMenuItem className="flex-1 p-0">
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={cn({
                      "**:text-primary": isActive,
                    })}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <span
                  className={cn(
                    "border-primary h-4 rounded-l-lg border-r-4 opacity-0",
                    {
                      "opacity-100": isActive,
                    },
                  )}
                />
              </div>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
