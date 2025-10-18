// import { trpc } from "@/utils/trpc";
// import { useQuery } from "@tanstack/react-query";

// const TITLE_TEXT = `
//  ██████╗ ███████╗████████╗████████╗███████╗██████╗
//  ██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗
//  ██████╔╝█████╗     ██║      ██║   █████╗  ██████╔╝
//  ██╔══██╗██╔══╝     ██║      ██║   ██╔══╝  ██╔══██╗
//  ██████╔╝███████╗   ██║      ██║   ███████╗██║  ██║
//  ╚═════╝ ╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝

//  ████████╗    ███████╗████████╗ █████╗  ██████╗██╗  ██╗
//  ╚══██╔══╝    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
//     ██║       ███████╗   ██║   ███████║██║     █████╔╝
//     ██║       ╚════██║   ██║   ██╔══██║██║     ██╔═██╗
//     ██║       ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
//     ╚═╝       ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
//  `;

// function HomeComponent() {
//   const healthCheck = useQuery(trpc.healthCheck.queryOptions());

//   return (
//     <div className="container mx-auto max-w-3xl px-4 py-2">
//       <pre className="overflow-x-auto font-mono text-sm">{TITLE_TEXT}</pre>
//       <div className="grid gap-6">
//         <section className="rounded-lg border p-4">
//           <h2 className="mb-2 font-medium">API Status</h2>
//           <div className="flex items-center gap-2">
//             <div
//               className={`h-2 w-2 rounded-full ${healthCheck.data ? "bg-green-500" : "bg-red-500"}`}
//             />
//             <span className="text-muted-foreground text-sm">
//               {healthCheck.isLoading
//                 ? "Checking..."
//                 : healthCheck.data
//                   ? "Connected"
//                   : "Disconnected"}
//             </span>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";

import { AppSidebar } from "@repo/design/components/sidebar/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@repo/design/components/ui/breadcrumb";
import { Button } from "@repo/design/components/ui/button";
import { Separator } from "@repo/design/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@repo/design/components/ui/sidebar";
import { Plus } from "@repo/design/icons";

export const Route = createFileRoute("/dashboard")({
  component: SubdomainLayoutWithAuth,
});

const Loading = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <span className="loader"></span>
    </div>
  );
};

export function SubdomainLayoutWithAuth() {
  const { data: session, isPending } = authClient.useSession();

  useQuery({
    queryKey: ["organizations"],
    queryFn: () => authClient.organization.list(),
    enabled: !!session,
  });

  // const organization = await auth.api.getFullOrganization({
  //   headers: heads,
  // });

  // const teams = organization?.teams ?? [];

  if (isPending) return <Loading />;
  if (!session) return <div>No session...</div>;

  return (
    <SidebarProvider>
      {/* <AppSidebar
        teams={{
          data: teams,
          activeTeam: teams.pop(),
        }}
        organizations={a}
        user={{
          name: session.user.name,
          email: session.user.email,
          image: session.user.image ?? "",
        }}
      /> */}

      <AppSidebar user={session.user} Link={Link} />

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
            <div className="py-5">
              <Outlet />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
