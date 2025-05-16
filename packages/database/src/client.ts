import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { Redis } from "@upstash/redis";

import * as schema from "./schema";

export const db = drizzle({
  client: sql,
  schema,
  casing: "snake_case",
});


export const redis = new Redis({
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  url: process.env.KV_REST_API_URL,
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  token: process.env.KV_REST_API_TOKEN
});