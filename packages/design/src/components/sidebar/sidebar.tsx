"use client";

import type { AnchorHTMLAttributes } from "react";
import * as React from "react";
import { useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@repo/design/components/ui/sidebar";
import { HugeIcons } from "@repo/design/icons";
import { cn } from "@repo/design/lib/utils";

import type { Clinic } from "./org-switcher";
import { Separator } from "../ui/separator";
import { CommandSearch } from "./command-search";
// import { NavSecondary } from "./nav-secondary";
import { OrgSwitcher } from "./org-switcher";
import { NavItems, SidebarItem } from "./sidebar-items";

const data = {
  navMain: [
    {
      title: "Clinic",
      isActive: true,
      items: [
        {
          isActive: true,
          icon: HugeIcons.Dashboard,
          title: "Dashboard",
          url: "/",
        },
        {
          title: "Chart",
          icon: HugeIcons.Chart,
          url: "/chart",
        },
        {
          title: "Patients",
          icon: HugeIcons.Patients,
          url: "/patients",
        },
        {
          title: "Treatments",
          icon: HugeIcons.Stethoscope,
          url: "/treatments",
        },
        {
          icon: HugeIcons.Calendar,
          title: "Appointments",
          url: "/appointments",
        },
      ],
    },
  ],
  others: [
    {
      title: "Others",
      url: "#",
      isActive: true,
      items: [
        {
          icon: HugeIcons.Analytics,
          title: "Analytics",
          url: "/analytics",
        },
        {
          icon: HugeIcons.UserGroup,
          title: "Staff",
          url: "/staff",
        },
      ],
    },
  ],

  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: HugeIcons.Setting03,
    },
    {
      title: "Help Centre",
      url: "/help",
      icon: HugeIcons.CustomerSupport,
    },
  ],
};

const sampleOrganizations = [
  { id: "1", name: "Golden Trust HQ", clinicCount: 3 },
  { id: "2", name: "St Stephens Int'l", clinicCount: 6 },
  { id: "3", name: "Liberty Lane", clinicCount: 2 },
];

const sampleClinics = [
  { id: "c1", name: "Golden Trust NG", organizationId: "1" },
  { id: "c2", name: "Golden Trust US", organizationId: "1" },
  { id: "c3", name: "Golden Trust UK", organizationId: "1" },
  { id: "c4", name: "St Stephens Main", organizationId: "2" },
  { id: "c5", name: "St Stephens East", organizationId: "2" },
];

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

export function AppSidebar({
  user,
  Link,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: User;
  Link: AnchorHTMLAttributes<HTMLAnchorElement>;
}) {
  const { state } = useSidebar();

  const [activeClinic, setActiveClinic] = useState<Clinic | undefined>(
    undefined,
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="bg-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"></div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Next Oral</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="gap-4">
        <SidebarMenu className="pl-2">
          <SidebarMenuItem className="w-full pr-2">
            <SidebarMenuButton asChild>
              <CommandSearch />
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarItem
            item={{
              title: "Notifications",
              url: "/notifications",
              icon: HugeIcons.Notifications,
            }}
            isActive={false}
          />
        </SidebarMenu>
        <NavItems items={data.navMain} Link={Link as any} />
        <Separator className="" />
        <NavItems items={data.others} Link={Link as any} />
      </SidebarContent>
      <SidebarFooter className={cn("p-0", { "p-0": state === "collapsed" })}>
        <div className="p-2">
          <OrgSwitcher
            user={user}
            clinics={sampleClinics}
            activeClinic={activeClinic}
            setActiveClinic={setActiveClinic}
            organizations={sampleOrganizations}
          />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
