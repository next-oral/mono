"use client";

import { useState } from "react";
import {
  Check,
  ChevronRight,
  ChevronsUpDown,
  LogOut,
  Plus,
  UserPlus,
} from "lucide-react";

import { cn } from "@repo/design/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export interface Organization {
  id: string;
  name: string;
  clinicCount: number;
}

export interface Clinic {
  id: string;
  name: string;
  organizationId: string;
}

interface OrgSwitcherProps {
  user: User;
  organizations: Organization[];
  clinics: Clinic[];
  activeClinic?: Clinic;
  setActiveClinic: (clinic: Clinic) => void;
}

export function OrgSwitcher({
  user,
  organizations,
  clinics,
  activeClinic,
  setActiveClinic,
}: OrgSwitcherProps) {
  const { isMobile } = useSidebar();
  const [showSubmenu, setShowSubmenu] = useState<string | null>(null);

  const handleClinicChange = (clinic: Clinic) => {
    setActiveClinic(clinic);

    setTimeout(() => {
      setShowSubmenu(null);
    }, 600);
  };

  const handleOrgHover = (orgId: string) => {
    setShowSubmenu(orgId);
  };

  const getDisplayText = () => {
    if (!activeClinic) return { name: "Select team", subtitle: "" };

    const clinicCount = clinics.filter(
      (c) => c.organizationId === activeClinic.id,
    ).length;
    return {
      name: activeClinic.name,
      subtitle: `${clinicCount} ${clinicCount === 1 ? "clinic" : "clinics"}`,
    };
  };

  const { name, subtitle } = getDisplayText();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-8">
                <AvatarImage src={activeClinic?.name ?? ""} />
                <AvatarFallback className="capitalize">
                  {activeClinic?.name.charAt(0) ?? "T"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {subtitle}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 overflow-visible rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Organizations
            </DropdownMenuLabel>
            {organizations.map((org) => {
              const orgClinics = clinics.filter(
                (c) => c.organizationId === org.id,
              );
              const isHovered = showSubmenu === org.id;
              const shouldShowSubmenu = showSubmenu === org.id;

              return (
                <div key={org.id} className="relative">
                  <DropdownMenuItem
                    onClick={() =>
                      handleClinicChange({
                        id: org.id,
                        name: org.name,
                        organizationId: org.id,
                      })
                    }
                    onMouseEnter={() => handleOrgHover(org.id)}
                    className={cn("cursor-pointer gap-2 p-2", {
                      "bg-sidebar-accent": isHovered,
                    })}
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Avatar className="size-6">
                      <AvatarFallback className="text-xs capitalize">
                        {org.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="flex-1">{org.name}</span>
                    <div className="text-muted-foreground flex items-center gap-1 text-xs">
                      {orgClinics.length}
                      <ChevronRight className="size-3" />
                    </div>
                  </DropdownMenuItem>

                  {shouldShowSubmenu && (
                    <div className="absolute top-0 left-full z-50 ml-2">
                      <div className="bg-popover animate-in slide-in-from-left-1 min-w-48 rounded-lg border p-1 shadow-lg duration-150">
                        <div className="text-muted-foreground mb-1 border-b p-2 text-xs font-medium">
                          {org.name}
                        </div>
                        {orgClinics.length > 0 ? (
                          <div className="space-y-0.5">
                            {orgClinics.map((clinic) => {
                              const isClinicActive =
                                activeClinic?.id === clinic.id;

                              return (
                                <Button
                                  key={clinic.id}
                                  onClick={() =>
                                    handleClinicChange({
                                      id: clinic.id,
                                      name: clinic.name,
                                      organizationId: org.id,
                                    })
                                  }
                                  variant="ghost"
                                  className={cn(
                                    "hover:bg-sidebar-accent flex w-full items-center gap-2 rounded-md p-2 text-sm font-normal transition-colors",
                                    {
                                      "bg-sidebar-accent": isClinicActive,
                                    },
                                  )}
                                >
                                  <Avatar className="size-5">
                                    <AvatarFallback className="text-xs capitalize">
                                      {clinic.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="flex-1 text-left">
                                    {clinic.name}
                                  </span>
                                  {isClinicActive && (
                                    <Badge className="ml-2 aspect-square size-5 rounded-full">
                                      <Check className="size-3" />
                                    </Badge>
                                  )}
                                </Button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-muted-foreground p-2 text-center text-xs">
                            No clinics yet
                          </div>
                        )}

                        {/* Add clinic option */}
                        <div className="mt-1 border-t pt-1">
                          <Button variant="ghost" className="w-full">
                            <Plus className="size-4" />
                            <span className="flex-1 text-left">Add clinic</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <DropdownMenuSeparator />

            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Account
            </DropdownMenuLabel>
            <DropdownMenuItem className="gap-2 p-2">
              <Avatar className="size-6">
                <AvatarImage src={user.image ?? "/placeholder.svg"} />
                <AvatarFallback className="text-xs capitalize">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="flex-1">{user.name}</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="gap-2">
              <UserPlus className="size-4" />
              Invite members
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Plus className="size-4" />
              Create or join clinic
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem className="gap-2">
              <LogOut className="size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
