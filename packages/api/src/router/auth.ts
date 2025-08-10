import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";

import { waitlist, waitlistInsertSchema } from "@repo/database/schema";
import { actions } from "@repo/email";

import { protectedProcedure, publicProcedure } from "../trpc";

export const authRouter = {
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  joinWaitlist: publicProcedure
    .input(waitlistInsertSchema)
    .mutation(async ({ ctx, input }) => {
      const [entry] = await ctx.db.insert(waitlist).values(input).returning();
      if (!entry) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to join waitlist",
        });
      }

      void actions.waitlist({
        email: entry.email,
        name: `${entry.firstName} ${entry.lastName}`,
      });

      return {
        message:
          "Thank you for joining the waitlist! We'll be in touch soon." as const,
      };
    }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can see this secret message!";
  }),
} satisfies TRPCRouterRecord;
