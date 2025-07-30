"use client";

import { useQuery } from "@tanstack/react-query";

import { AppSidebar } from "@repo/design/components/sidebar/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@repo/design/components/ui/breadcrumb";
import { Separator } from "@repo/design/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@repo/design/components/ui/sidebar";
import { Button } from "@repo/design/src/components/ui/button";
import { Plus } from "@repo/design/src/icons";

import { authClient } from "~/auth/client";
import { useTRPC } from "~/trpc/react";

export function SubdomainLayoutWithAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = authClient.useSession();

  const trpc = useTRPC();

  const { data: organizations } = useQuery(
    trpc.organization.getAll.queryOptions(),
  );

  if (!session?.session) {
    return <div>No session...</div>;
  }

  const [team, ...teams] = organizations?.map((org) => org.teams) ?? [[]];

  return (
    <SidebarProvider>
      <AppSidebar
        teams={{
          data: team ?? [],
          activeTeam: teams.pop()?.pop(),
        }}
        // @ts-expect-error - TODO: fix this
        organizations={organizations ?? []}
        user={{
          name: session.user.name,
          email: session.user.email,
          image: session.user.image ?? "",
        }}
      />

      <SidebarInset>
        <div className="flex">
          {/* <div className="relative h-screen w-80 transition-all has-[div[data-notification-panel-state=closed]]:w-0">
              <NotificationPanel />
            </div> */}

          <div className="flex-1">
            <header className="bg-background/50 sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 border-b px-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 px-0">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
              <Button size="icon" className="ml-auto size-8">
                <Plus />
              </Button>
            </header>
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
