import { createEnv } from "@t3-oss/env-core";
import { z } from "zod/v4";

export const env = createEnv({
  server: {
    DEV_PG_PORT: z.string(),
    POSTGRES_URL: z.string(),
    DEV_PG_PASSWORD: z.string(),
    DEV_PG_ADDRESS: z.string(),
  },
  runtimeEnvStrict: {
    DEV_PG_PORT: process.env.DEV_PG_PORT,
    POSTGRES_URL: process.env.POSTGRES_URL,
    DEV_PG_PASSWORD: process.env.DEV_PG_PASSWORD,
    DEV_PG_ADDRESS: process.env.DEV_PG_ADDRESS,
  },
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
