import type { Metadata } from "next";
import { Suspense } from "react";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AppSidebar } from "@repo/design/components/sidebar/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/design/components/ui/breadcrumb";
import { Separator } from "@repo/design/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@repo/design/components/ui/sidebar";

import { auth } from "~/auth/server";
import { getQueryClient, trpc } from "~/trpc/server";

export async function GenerateMetadata({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}): Promise<Metadata> {
  const { subdomain } = await params;

  const queryClient = getQueryClient();
  const domain = await queryClient.ensureQueryData(
    trpc.domain.getDomainConfig.queryOptions(),
  );
  const sub = await queryClient.ensureQueryData(
    trpc.domain.get.queryOptions({ domain: subdomain }),
  );

  if (!sub) {
    return {
      title: domain.root,
    };
  }

  console.log("subdomain", subdomain, domain);

  return {
    title: `${subdomain}.${domain.root}`,
    description: `Subdomain page for ${subdomain}.${domain.root}`,
  };
}

export default async function SubdomainPage({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;

  const queryClient = getQueryClient();

  const domain = await queryClient.ensureQueryData(
    trpc.domain.getDomainConfig.queryOptions(),
  );
  const sub = await queryClient.ensureQueryData(
    trpc.domain.get.queryOptions({ domain: subdomain }),
  );

  console.log(domain);

  if (!sub) return notFound();

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="absolute top-4 right-4">
        <Link
          href={`${domain.protocol}://${domain.root}`}
          className="text-sm text-gray-500 transition-colors hover:text-gray-700"
        >
          {domain.root}
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <div className="mb-6 text-9xl">{}</div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Welcome to {subdomain}.{domain.root}
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            This is your custom subdomain page
          </p>
        </div>
      </div>

      <Suspense fallback={<Loading />}>
        <PageWithAuth />
      </Suspense>
    </div>
  );
}

const Loading = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      {/* <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-b-2 border-gray-900" /> */}
      <span className="loader"></span>
    </div>
  );
};

// export default function Page() {
//   return (
//     <Suspense fallback={<Loading />}>
//       <PageWithAuth />
//     </Suspense>
//   );
// }

export async function PageWithAuth() {
  // const session = await getSession();

  const heads = await headers();

  const session = await auth.api.getSession({
    headers: heads,
  });
  console.log("session", session);
  if (!session) return null;

  // const queryClient = getQueryClient();

  const organization = await auth.api.getFullOrganization({
    headers: heads,
  });

  const teams =
    organization?.teams.filter((team) => organization.id != team.id) ?? [];

  return (
    <SidebarProvider>
      <AppSidebar
        teams={teams}
        user={{
          name: session.user.name,
          email: session.user.email,
          image: session.user.image ?? "",
        }}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
