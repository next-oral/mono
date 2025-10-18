import type { trpc } from "@/utils/trpc";
import type { Zero } from "@rocicorp/zero";
import type { QueryClient } from "@tanstack/react-query";
import Header from "@/components/header";
import Loader from "@/components/loader";
import { ThemeProvider } from "@/components/theme-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { CookiesProvider } from "react-cookie";

import { Toaster } from "@repo/design/components/ui/sonner";

import "@repo/design/globals.css";

import { ZeroInit } from "@/components/zero-init";

import type { Mutators } from "@repo/zero/mutators";
import type { Schema } from "@repo/zero/schema";

export interface RouterAppContext {
  trpc: typeof trpc;
  queryClient: QueryClient;
  zero: Zero<Schema, Mutators>;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
  head: () => ({
    meta: [
      {
        title: "Next Oral Desktop",
      },
      {
        name: "description",
        content: "Next Oral Desktop is a desktop application",
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
  }),
});

function RootComponent() {
  const isFetching = useRouterState({
    select: (s) => s.isLoading,
  });

  return (
    <CookiesProvider>
      <ZeroInit>
        <HeadContent />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
          storageKey="vite-ui-theme"
        >
          <div className="grid h-svh grid-rows-[auto_1fr]">
            <Header />
            {isFetching ? <Loader /> : <Outlet />}
          </div>
          <Toaster richColors />
          <Outlet />
        </ThemeProvider>
        <TanStackRouterDevtools position="bottom-left" />
        <ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
      </ZeroInit>
    </CookiesProvider>
  );
}
