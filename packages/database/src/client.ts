import { Redis } from "@upstash/redis";
// import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema";

if (!process.env.POSTGRES_URL) {
  throw new Error("Missing POSTGRES_URL");
}

export const db = drizzle(process.env.POSTGRES_URL, {
  // client: sql,
  schema,
  casing: "snake_case",
});

export const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});
