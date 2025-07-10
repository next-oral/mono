"use client";

import * as React from "react";
import { useState } from "react";
import Image from "next/image";
import { GalleryVerticalEnd } from "lucide-react";

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

import { CommandSearch } from "./command-search";
import { NavSecondary } from "./nav-secondary";
import { OrgSwitcher } from "./org-switcher";
import { NavItems } from "./sidebar-items";

// This is sample data.
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
          title: "Patients",
          icon: HugeIcons.Patients,
          url: "/patients",
        },
        {
          icon: HugeIcons.Calendar,
          title: "Appointments",
          url: "/appointments",
        },
        {
          title: "Treatments",
          icon: HugeIcons.Stethoscope,
          url: "/treatments",
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
      url: "#",
      icon: HugeIcons.Setting03,
    },
    {
      title: "Help Centre",
      url: "#",
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
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: User }) {
  const { state } = useSidebar();

  const [activeClinic, setActiveClinic] = useState(undefined);
  const [activeTeam, setActiveTeam] = useState(undefined);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="bg-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                  <Image
                    src="/next-oral.svg"
                    width="40"
                    height="40"
                    className="size-10"
                    alt="Next oral"
                  />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Next Oral</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="gap-4">
        <SidebarMenu>
          <SidebarMenuItem className="w-full px-2">
            <SidebarMenuButton asChild>
              <CommandSearch />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <NavItems items={data.navMain} />
        <NavItems items={data.others} />
      </SidebarContent>
      <SidebarFooter className={cn({ "p-0": state === "collapsed" })}>
        <NavSecondary items={data.navSecondary} />

        <OrgSwitcher
          user={user}
          organizations={sampleOrganizations}
          clinics={sampleClinics}
          activeClinic={activeClinic}
          setActiveClinic={setActiveClinic as (arg0: unknown) => void}
          // @ts-expect-error - TODO: fix this
          activeTeam={activeTeam}
          setActiveTeam={setActiveTeam}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
