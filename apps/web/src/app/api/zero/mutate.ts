import { NextResponse } from "next/server";
import {
  PostgresJSConnection,
  PushProcessor,
  ZQLDatabase,
} from "@rocicorp/zero/pg";
import postgres from "postgres";

// import { must } from "@repo/validators";
import { createMutators } from "@repo/zero/mutators";
import { schema } from "@repo/zero/schema";

import { env } from "~/env";

const pgURL = env.POSTGRES_URL;

const processor = new PushProcessor(
  new ZQLDatabase(new PostgresJSConnection(postgres(pgURL)), schema),
);

export async function POST(request: Request) {
  const { userID } = getUserIDFromDummyAuth(request);

  try {
    const processed = await processor.process(
      createMutators({ sub: userID ?? "demo-user" }),
      request,
    );
    return NextResponse.json(processed);
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

function getUserIDFromDummyAuth(request: Request): { userID?: string } {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return { userID: "demo-user" };
  const prefix = "Bearer ";
  if (!authHeader.startsWith(prefix)) return { userID: "demo-user" };
  const token = authHeader.slice(prefix.length).trim();
  if (!token) return { userID: "demo-user" };
  if (token === "dummy-token") return { userID: "demo-user" };
  // For now accept any token and map to demo user; tighten later
  return { userID: "demo-user" };
}
