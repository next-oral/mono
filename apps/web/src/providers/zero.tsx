"use client";

import { useEffect, useState } from "react";
import { Zero } from "@rocicorp/zero";
import { ZeroProvider } from "@rocicorp/zero/react";

import { createMutators, Mutators } from "@repo/zero/mutators";
import { Schema, schema } from "@repo/zero/schema";

import { authClient } from "~/auth/client";
import { env } from "~/env";

//! TODO: this is a for a fake pending state
export function useZeroQueryStatus(
  type: "unknown" | "complete",
  timeoutSeconds = 5,
) {
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
  };
}

export function ZeroQueryProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = authClient.useSession();

  const userID = session?.user.id ?? "anon";

  const zero = new Zero({
    schema,
    userID,
    server: env.NEXT_PUBLIC_ZERO_SERVER_URL,
    mutators: createMutators({ sub: userID }),
  });

  return (
    <ZeroProvider
      zero={zero}
      init={(z) => {
        z.preload(z.query.patient);
      }}
    >
      {children}
    </ZeroProvider>
  );
}
