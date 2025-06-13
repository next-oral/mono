import type { Metadata } from "next";
import { Suspense } from "react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import {
  AppSidebar,
  NotificationPanel,
} from "@repo/design/components/sidebar/app-sidebar";
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

import { auth } from "~/auth/server";
import { env } from "~/env";
import { getQueryClient, trpc } from "~/trpc/server";

export async function GenerateMetadata({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}): Promise<Metadata> {
  const { subdomain } = await params;

  const queryClient = getQueryClient();
  const sub = await queryClient.ensureQueryData(
    trpc.domain.get.queryOptions({ domain: subdomain }),
  );

  if (!sub) {
    return {
      title: env.NEXT_PUBLIC_ROOT_DOMAIN,
    };
  }

  return {
    title: `${subdomain}.${env.NEXT_PUBLIC_ROOT_DOMAIN}`,
    description: `Subdomain page for ${subdomain}.${env.NEXT_PUBLIC_ROOT_DOMAIN}`,
  };
}

export default async function SubdomainLayout({
  params,
  children,
}: {
  params: Promise<{ subdomain: string }>;
  children: React.ReactNode;
}) {
  const { subdomain } = await params;

  const queryClient = getQueryClient();

  const sub = await queryClient.ensureQueryData(
    trpc.domain.get.queryOptions({ domain: subdomain }),
  );

  if (!sub) return notFound();

  return (
    <Suspense fallback={<Loading />}>
      <SubdomainLayoutWithAuth>{children}</SubdomainLayoutWithAuth>
    </Suspense>
  );
}

const Loading = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <span className="loader"></span>
    </div>
  );
};

export async function SubdomainLayoutWithAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const heads = await headers();

  const session = await auth.api.getSession({
    headers: heads,
  });

  if (!session) return null;
  const organization = await auth.api.getFullOrganization({
    headers: heads,
  });

  const teams =
    organization?.teams.filter((team) => organization.id != team.id) ?? [];

  return (
    <SidebarProvider>
      <AppSidebar
        teams={{
          data: teams,
          activeTeam: teams.pop(),
        }}
        user={{
          name: session.user.name,
          email: session.user.email,
          image: session.user.image ?? "",
        }}
      />

      <SidebarInset>
        <div className="flex">
          <div className="relative h-screen w-80 transition-all has-[div[data-notification-panel-state=closed]]:w-0">
            <NotificationPanel />
          </div>

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
