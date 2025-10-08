"use client";

import type { Query, Schema } from "@rocicorp/zero";
import { useEffect, useRef, useState } from "react";
import { Zero } from "@rocicorp/zero";
import { useQuery, ZeroProvider } from "@rocicorp/zero/react";

import { createMutators } from "@repo/zero/mutators";
import { schema } from "@repo/zero/schema";

import { authClient } from "~/auth/client";
import { env } from "~/env";

//! TODO: this is a for a fake pending state
export function useZeroQuery<
  TSchema extends Schema,
  TTable extends keyof TSchema["tables"] & string,
  TReturn,
>(z: Query<Schema, TTable, TReturn>, timeoutSeconds = 5) {
  const [result, { type }] = useQuery(z);
  const [status, setStatus] = useState<"unknown" | "complete" | "error">(type);

  useEffect(() => {
    // Always sync local status with the incoming status first
    setStatus(type);

    // If still unknown after X seconds, flip to error
    if (type === "unknown") {
      const timeout = setTimeout(() => {
        setStatus((current) => (current === "unknown" ? "error" : current));
      }, timeoutSeconds * 1000);
      return () => clearTimeout(timeout);
    }
  }, [type, timeoutSeconds]);

  return {
    isPending: status === "unknown",
    isError: status === "error",
    data: result,
  };
}

export function ZeroQueryProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();

  const userID = session?.user.id ?? "anon";

  const zero = useRef(
    new Zero({
      schema,
      userID,
      server: env.NEXT_PUBLIC_ZERO_SERVER_URL,
      mutators: createMutators(undefined),
    }),
  );
  if (isPending) return <div>Loading...</div>;

  return (
    <ZeroProvider
      zero={zero.current}
      init={(z) => {
        z.preload(z.query.patient);
      }}
    >
      {children}
    </ZeroProvider>
  );
}
