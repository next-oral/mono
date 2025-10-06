import { env } from "@/env";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import {
  createTRPCClient,
  httpBatchStreamLink,
  loggerLink,
} from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { toast } from "sonner";
import SuperJSON from "superjson";

import type { AppRouter } from "@repo/api";

// import { env } from "@repo/auth/env";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      toast.error(error.message, {
        action: {
          label: "retry",
          onClick: () => {
            queryClient.invalidateQueries();
          },
        },
      });
    },
  }),
});

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    loggerLink({
      enabled: (op) =>
        import.meta.env.NODE_ENV === "development" ||
        (op.direction === "down" && op.result instanceof Error),
    }),
    httpBatchStreamLink({
      transformer: SuperJSON,
      url: `${env.VITE_SERVER_URL}/api/trpc`,
      headers() {
        const headers = new Headers();
        headers.set("x-trpc-source", "nextjs-react");
        return headers;
      },
    }),
  ],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});
