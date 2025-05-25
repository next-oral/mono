import "server-only";

import { cache } from "react";
import { headers } from "next/headers";

import { initAuth } from "@repo/auth";

import { env } from "~/env";

const baseUrl = env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
  : env.VERCEL_URL
    ? `https://${env.VERCEL_URL}`
    : "http://localhost:3000";

export const auth = initAuth({
  baseUrl,
  secret: env.AUTH_SECRET,
  google: {
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
  },
  microsoft: {
    clientId: env.MICROSOFT_CLIENT_ID,
    clientSecret: env.MICROSOFT_CLIENT_SECRET,
    tenantId: "common",
  },
});

export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);
