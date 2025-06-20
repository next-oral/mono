import { authRouter } from "./router/auth";
import { domainRouter } from "./router/domain";
import { organizationRouter } from "./router/organization";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  domain: domainRouter,
  organization: organizationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
