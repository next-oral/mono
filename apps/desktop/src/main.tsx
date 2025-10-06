import { Zero } from "@rocicorp/zero";
import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";

import type { Mutators } from "@repo/zero/mutators";
import type { Schema } from "@repo/zero/schema";

import Loader from "./components/loader";
import { routeTree } from "./routeTree.gen";
import { queryClient, trpc } from "./utils/trpc";

export interface RouterContext {
  zero: Zero<Schema, Mutators>;
}

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPendingComponent: () => <Loader />,
  context: {
    trpc,
    queryClient,
    zero: undefined as unknown as Zero<Schema, Mutators>,
  },
  Wrap: function WrapComponent({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}

const rootElement = document.getElementById("app");

if (!rootElement) {
  throw new Error("Root element not found");
}

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<RouterProvider router={router} />);
}
