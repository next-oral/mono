"use client";

import * as React from "react";
import { useState } from "react";

import type { Clinic } from "@repo/design/components/sidebar/org-switcher";
import { NavMain } from "@repo/design/components/sidebar/nav-main";
import { OrgSwitcher } from "@repo/design/components/sidebar/org-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@repo/design/components/ui/sidebar";
import { Ellipsis, GalleryVerticalEnd, HugeIcons, X } from "@repo/design/icons";
import { cn } from "@repo/design/lib/utils";

import type { Activity } from "./activity-item";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { ActivityItem } from "./activity-item";
import { NavHeader } from "./nav-header";
import { NavSecondary } from "./nav-secondary";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
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
        {
          title: "Payments",
          icon: HugeIcons.Patients,
          url: "/payments",
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

export interface User {
  name: string;
  email: string;
  image: string;
}

export interface Team {
  id: string;
  name: string;
  createdAt: Date;
  organizationId: string;
  updatedAt?: Date | undefined | null;
}

export interface Organization {
  id: string;
  name: string;
  createdAt: Date;
  slug: string;
  metadata?: Record<string, unknown>;
  logo?: string | null | undefined;
}

const sampleUser = {
  id: "1",
  name: "Matt Derek",
  email: "matt@example.com",
  image: "/placeholder.svg?height=32&width=32",
};

const sampleOrganizations = [
  { id: "1", name: "Golden Trust HQ", clinicCount: 3 },
  { id: "2", name: "St Stephens Int'l", clinicCount: 6 },
  { id: "3", name: "Liberty Lane", clinicCount: 2 },
];

const sampleClinics: Clinic[] = [
  { id: "c1", name: "Golden Trust NG", organizationId: "1" },
  { id: "c2", name: "Golden Trust US", organizationId: "1" },
  { id: "c3", name: "Golden Trust UK", organizationId: "1" },
  { id: "c4", name: "St Stephens Main", organizationId: "2" },
  { id: "c5", name: "St Stephens East", organizationId: "2" },
];

export function AppSidebar({
  teams,
  organizations,
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  teams: {
    data: Team[];
    activeTeam?: Team;
    setActiveTeam?: (team: Team) => void;
  };
  organizations: Organization[];
  user: User;
}) {
  const { state } = useSidebar();

  const [activeClinic, setActiveClinic] = useState(undefined);
  const [activeTeam, setActiveTeam] = useState(undefined);

  // const toggleNotifications = () => setShowNotifications((prev) => !prev);

  if (!teams.data.length) return null;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Next Oral</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavHeader showInbox setShowInbox={() => null} />
        <Separator className={cn({ hidden: state === "expanded" })} />
        <NavMain label="Clinic" items={data.navMain} />
        <Separator className={cn({ hidden: state === "expanded" })} />
        <NavMain label="Others" items={data.others} />
      </SidebarContent>

      <SidebarFooter className={cn({ "p-0": state === "collapsed" })}>
        <NavSecondary items={data.navSecondary} />

        <OrgSwitcher
          user={sampleUser}
          organizations={sampleOrganizations}
          clinics={sampleClinics}
          activeClinic={activeClinic}
          setActiveClinic={setActiveClinic}
          activeTeam={activeTeam}
          setActiveTeam={setActiveTeam}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

const activities: Activity[] = [
  {
    id: "1",
    type: "appointment",
    title: "Upcoming Appointment",
    time: Date.now() - 3 * 60 * 1000, // 3 mins ago
    name: "Philips MacPhearson",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    timeStart: "11:35 AM",
    timeEnd: "01:32 PM",
  },
  {
    id: "2",
    type: "new_patient",
    title: "New Patient Added",
    time: Date.now() - 2 * 60 * 60 * 1000, // 2 hrs ago
    name: "Marcus Lee",
    avatar: undefined,
    email: "marcus.lee@email.com",
  },
  {
    id: "3",
    type: "treatment_completed",
    title: "Treatment completed",
    time: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2d ago
    name: "Jessica Matthews",
    avatar: undefined,
    details:
      "Jessica Matthews' periodontal treatment completed\nLast visit recorded: 05 May 25",
  },
  {
    id: "4",
    type: "status_change",
    title: "Appointment status change",
    time: Date.now() - 7 * 24 * 60 * 60 * 1000, // 1w ago
    name: "Joyce Kwame-Afriye",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    timeStart: "11:35 AM",
    timeEnd: "01:32 PM",
    status: "Confirmed",
    badge: "confirmed",
  },
  {
    id: "5",
    type: "status_change",
    title: "Appointment status change",
    time: Date.now() - 7 * 24 * 60 * 60 * 1000, // 1w ago
    name: "Joyce Kwame-Afriye",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    timeStart: "11:35 AM",
    timeEnd: "01:32 PM",
    status: "Completed",
    badge: "completed",
  },
  {
    id: "6",
    type: "new_patient",
    title: "New Patient Added",
    time: Date.now() - 7 * 24 * 60 * 60 * 1000, // 1w ago
    name: "Marcus Lee",
    avatar: undefined,
  },
  {
    id: "7",
    type: "appointment",
    title: "Upcoming Appointment",
    time: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1d ago
    name: "Sarah Johnson",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    timeStart: "09:00 AM",
    timeEnd: "10:30 AM",
  },
  {
    id: "8",
    type: "treatment_completed",
    title: "Treatment completed",
    time: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3d ago
    name: "Michael Chen",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    details:
      "Michael Chen's root canal treatment completed\nLast visit recorded: 03 May 25",
  },
  {
    id: "9",
    type: "status_change",
    title: "Appointment status change",
    time: Date.now() - 4 * 24 * 60 * 60 * 1000, // 4d ago
    name: "Emma Wilson",
    avatar: "https://randomuser.me/api/portraits/women/6.jpg",
    timeStart: "02:15 PM",
    timeEnd: "03:45 PM",
    status: "Cancelled",
    badge: "cancelled",
  },
  {
    id: "10",
    type: "new_patient",
    title: "New Patient Added",
    time: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5d ago
    name: "David Kim",
    avatar: undefined,
    email: "david.kim@email.com",
  },
  {
    id: "11",
    type: "appointment",
    title: "Upcoming Appointment",
    time: Date.now() - 6 * 24 * 60 * 60 * 1000, // 6d ago
    name: "Lisa Anderson",
    avatar: "https://randomuser.me/api/portraits/women/7.jpg",
    timeStart: "10:45 AM",
    timeEnd: "12:15 PM",
  },
  {
    id: "12",
    type: "treatment_completed",
    title: "Treatment completed",
    time: Date.now() - 8 * 24 * 60 * 60 * 1000, // 8d ago
    name: "Robert Taylor",
    avatar: "https://randomuser.me/api/portraits/men/8.jpg",
    details:
      "Robert Taylor's dental cleaning completed\nLast visit recorded: 01 May 25",
  },
];

export const NotificationPanel = () => {
  const [state, setState] = useState("open");
  // const { state } = useNotificationPanelState();

  // console.log(state);

  return (
    <div
      data-notification-panel-state={state}
      className="group fixed top-0 hidden h-screen w-80 flex-col border-r transition-[width] duration-200 ease-linear data-[notification-panel-state=closed]:w-0 md:flex"
    >
      <div className="relative gap-3.5 group-data-[notification-panel-state=closed]:hidden">
        <div className="bg-background/50 sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 border-b px-2 backdrop-blur-sm group-data-[notification-panel-state=closed]:hidden">
          <div className="text-foreground flex w-full items-center gap-2 text-base font-medium">
            <Badge className="rounded-sm bg-slate-950 p-1 font-bold text-white">
              {activities.length}
            </Badge>
            <span> Notifications</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setState("closed")}
              variant="ghost"
              size="icon"
              className="size-7"
            >
              <Ellipsis />
              <span className="sr-only">More</span>
            </Button>
            <Button variant="ghost" size="icon" className="size-7">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </div>
        <div className="border-b p-2 backdrop-blur-sm">
          <SidebarInput
            placeholder="Search"
            className="border-slate-200 bg-slate-50"
          />
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="px-0">
          {activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      </div>
    </div>
  );
};
