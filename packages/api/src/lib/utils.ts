import { env } from "@repo/auth/env";

export const protocol = env.NODE_ENV === "production" ? "https" : "http";
export const rootDomain =
  env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_ROOT_DOMAIN
    : "localhost:3000";
