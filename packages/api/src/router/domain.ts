import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { protocol, rootDomain } from "../lib/utils";
import { protectedProcedure, publicProcedure } from "../trpc";

export interface Subdomain {
  emoji: string;
  createdAt: number;
}

export const domainRouter = {
  getDomainConfig: publicProcedure.query(() => ({
    protocol,
    root: rootDomain,
  })),
  getDomain: protectedProcedure
    .input(
      z.object({
        domain: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const sanitizedSubdomain = input.domain
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "");

      const data = await ctx.redis.get<Subdomain>(
        `subdomain:${sanitizedSubdomain}`,
      );

      return data;
    }),

  create: publicProcedure
    .input(
      z.object({
        subdomain: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { subdomain } = input;

      if (!subdomain) {
        throw new Error("Subdomain and icon are required");
      }

      const sanitizedSubdomain = subdomain
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "");

      if (sanitizedSubdomain !== subdomain) {
        throw new Error(
          "Subdomain can only have lowercase letters, numbers, and hyphens. Please try again.",
        );
      }

      const subdomainAlreadyExists = await ctx.redis.get<Subdomain>(
        `subdomain:${sanitizedSubdomain}`,
      );
      if (subdomainAlreadyExists) {
        throw new Error("This subdomain is already taken");
      }

      await ctx.redis.set(`subdomain:${sanitizedSubdomain}`, {
        createdAt: Date.now(),
      });

      return {
        success: true,
        redirectUrl: `${protocol}://${sanitizedSubdomain}.${rootDomain}`,
      };
    }),

  deleteSubdomain: protectedProcedure
    .input(
      z.object({
        subdomain: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { subdomain } = input;
      await ctx.redis.del(`subdomain:${subdomain}`);
      return { success: true, message: "Domain deleted successfully" };
    }),

  getAllSubdomains: protectedProcedure.query(async ({ ctx }) => {
    const keys = await ctx.redis.keys("subdomain:*");
    if (!keys.length) {
      return [];
    }
    const values = await ctx.redis.mget<Subdomain[]>(...keys);

    return keys.map((key, index) => {
      const subdomain = key.replace("subdomain:", "");
      const data = values[index];

      return {
        subdomain,
        createdAt: data?.createdAt ?? Date.now(),
      };
    });
  }),
} satisfies TRPCRouterRecord;
