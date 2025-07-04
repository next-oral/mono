import { Redis } from "@upstash/redis";
import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

import * as schema from "./schema";

export const db = drizzle({
  client: sql,
  schema,
  casing: "snake_case",
});

export const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});
