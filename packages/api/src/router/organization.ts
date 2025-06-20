import type { TRPCRouterRecord } from "@trpc/server";

import { protectedProcedure } from "../trpc";

export const organizationRouter = {
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.organization.findMany({
      with: {
        teams: true,
      },
    });
  }),
} satisfies TRPCRouterRecord;
