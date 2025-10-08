// import { neon, neonConfig } from "@neondatabase/serverless";
// import { Redis } from "@upstash/redis";
// import { drizzle } from "drizzle-orm/neon-http";
// import ws from "ws";

// import * as schema from "./schema";

// if (!process.env.POSTGRES_URL) {
//   throw new Error("Missing POSTGRES_URL");
// }

// export const redis = new Redis({
//   url: process.env.KV_REST_API_URL,
//   token: process.env.KV_REST_API_TOKEN,
// });

// let connectionString = process.env.POSTGRES_URL;

// // Configuring Neon for local development
// if (process.env.NODE_ENV === "development") {
//   connectionString = "postgres://postgres:postgres@db.localtest.me:5432/main";
//   neonConfig.fetchEndpoint = (host) => {
//     const [protocol, port] =
//       host === "db.localtest.me" ? ["http", 4444] : ["https", 443];
//     return `${protocol}://${host}:${port}/sql`;
//   };
//   const connectionStringUrl = new URL(connectionString);
//   neonConfig.useSecureWebSocket =
//     connectionStringUrl.hostname !== "db.localtest.me";
//   neonConfig.wsProxy = (host) =>
//     host === "db.localtest.me" ? `${host}:4444/v2` : `${host}/v2`;
// }
// neonConfig.webSocketConstructor = ws;

// const sql = neon(connectionString);
// export const db = drizzle({
//   client: sql,
//   casing: "snake_case",
//   schema,
// });

import { Redis } from "@upstash/redis";
import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema";

if (!process.env.POSTGRES_URL) {
  throw new Error("Missing POSTGRES_URL");
}
export const db = drizzle(process.env.POSTGRES_URL, {
  schema,
  casing: "snake_case",
});

export const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});
