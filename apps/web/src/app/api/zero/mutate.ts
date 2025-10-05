import { NextResponse } from "next/server";
import {
  PostgresJSConnection,
  PushProcessor,
  ZQLDatabase,
} from "@rocicorp/zero/pg";
import postgres from "postgres";

import { must } from "@repo/validators";
import { createMutators } from "@repo/zero/mutators";
import { schema } from "@repo/zero/schema";

import { env } from "~/env";

const pgURL = env.POSTGRES_URL;

const processor = new PushProcessor(
  new ZQLDatabase(new PostgresJSConnection(postgres(pgURL)), schema),
);

export async function POST(request: Request) {
  const result = await getUserID(request);
  if (!result.ok) return result.response;

  const userID = result.userID;

  try {
    const processed = await processor.process(
      createMutators(userID ? { sub: userID } : undefined),
      request,
    );
    return NextResponse.json(processed);
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

type GetUserIDResult =
  | { ok: true; userID?: string }
  | { ok: false; response: NextResponse };

async function getUserID(request: Request): Promise<GetUserIDResult> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return { ok: true, userID: undefined };
  }

  const prefix = "Bearer ";
  if (!authHeader.startsWith(prefix)) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Missing or invalid authorization header" },
        { status: 401 },
      ),
    };
  }

  const token = authHeader.slice(prefix.length);
  //   const set = await auth.api.getJwks();
  //   const jwks = jose.createLocalJWKSet(set);

  try {
    // must(undefined, "Empty sub in token");
    // const { payload } = await jose.jwtVerify(token, jwks);
    return { ok: true, userID: must(undefined, "Empty sub in token") };
  } catch (err) {
    console.info("Could not verify token: " + (err.message ?? String(err)));
    return {
      ok: false,
      response: NextResponse.json({ error: "Invalid token" }, { status: 401 }),
    };
  }
}
