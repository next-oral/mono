"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/design/components/ui/accordion";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from "@repo/design/components/ui/sidebar";

export function NavMain({
  items,
}: {
  label: string;
  items: {
    isActive?: boolean;
    title: string;
    icon?: LucideIcon;
    items?: {
      isActive?: boolean;
      icon?: LucideIcon;
      title: string;
      url: string;
    }[];
  }[];
}) {
  const { state } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarMenu>
        <Accordion
          type="single"
          collapsible
          defaultValue={items[0]?.title ?? ""}
          className="w-full"
        >
          {items.map((item) => (
            <AccordionItem value={item.title} key={item.title}>
              <AccordionTrigger
                showChevron={state === "expanded"}
                data-slot="collapsible-trigger"
                className="hover:bg-sidebar-accent items-center justify-center p-0 hover:no-underline"
              >
                <SidebarMenuButton
                  className="m-0 p-0 group-data-[collapsible=icon]:hidden hover:bg-transparent"
                  tooltip={item.title}
                  asChild
                >
                  <div>
                    {item.icon ? <item.icon /> : null}
                    <SidebarGroupLabel className="p-0">
                      {item.title}
                    </SidebarGroupLabel>
                  </div>
                </SidebarMenuButton>
              </AccordionTrigger>
              <AccordionContent className="p-0">
                <SidebarMenuSub className="mx-1 border-none p-0 group-data-[collapsible=icon]:mx-0">
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem
                      data-active={subItem.isActive}
                      key={subItem.title}
                    >
                      <SidebarMenuButton tooltip={subItem.title} asChild>
                        <Link href={subItem.url}>
                          {subItem.icon && (
                            <subItem.icon className="stroke-2" />
                          )}
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </SidebarMenu>
    </SidebarGroup>
  );
}
