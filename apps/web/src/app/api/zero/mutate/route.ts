import { NextResponse } from "next/server";
import {
  PostgresJSConnection,
  PushProcessor,
  ZQLDatabase,
} from "@rocicorp/zero/pg";
import postgres from "postgres";

import { createMutators } from "@repo/zero/mutators";
import { schema } from "@repo/zero/schema";

import { auth } from "~/auth/server";
import { env } from "~/env";

const pgURL = env.POSTGRES_URL;

const processor = new PushProcessor(
  new ZQLDatabase(new PostgresJSConnection(postgres(pgURL)), schema),
);

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  try {
    const processed = await processor.process(
      createMutators(undefined),
      request,
    );
    return NextResponse.json(processed);
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
