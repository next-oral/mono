import { authRouter } from "./router/auth";
import { domainRouter } from "./router/domain";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  domain: domainRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
