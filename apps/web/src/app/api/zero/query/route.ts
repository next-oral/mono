import { NextResponse } from "next/server";
import {
  PostgresJSConnection,
  PushProcessor,
  ZQLDatabase,
} from "@rocicorp/zero/pg";
import postgres from "postgres";

import { createMutators } from "@repo/zero/mutators";
import { schema } from "@repo/zero/schema";

import { getSession } from "~/auth/server";
import { env } from "~/env";

const pgURL = env.POSTGRES_URL;

const processor = new PushProcessor(
  new ZQLDatabase(new PostgresJSConnection(postgres(pgURL)), schema),
);

export async function POST(request: Request) {
  const session = await getSession();

  try {
    const processed = await processor.process(createMutators(session), request);

    return NextResponse.json(processed);
  } catch (err) {
    console.error("Error processing query request:", err);
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }
}

export function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": request.headers.get("origin") ?? "*",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
