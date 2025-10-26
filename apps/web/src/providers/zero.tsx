"use client";

import type { Query, Schema } from "@rocicorp/zero";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Zero } from "@rocicorp/zero";
import { useQuery, ZeroProvider } from "@rocicorp/zero/react";

import { createMutators } from "@repo/zero/mutators";
import { schema } from "@repo/zero/schema";

import Loading from "~/app/(protected)/s/[subdomain]/loading";
import { authClient } from "~/auth/client";

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

const _user = {
  sub: "anon",
  name: "John Doe",
  admin: true,
  iat: 1516239022,
};
export function ZeroQueryProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();

  const zero = useMemo(
    () =>
      new Zero({
        schema,
        userID: session?.user.id ?? "anon",
        server: typeof window !== "undefined" ? window.location.origin : null,
        mutators: createMutators(session),
      }),
    [session],
  );

  // Only show loading for protected routes, not for public pages
  const isProtectedRoute =
    pathname.startsWith("/s/") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/appointments") ||
    pathname.startsWith("/patients") ||
    pathname.startsWith("/settings");

  if (isPending && isProtectedRoute) return <Loading />;

  return (
    <ZeroProvider
      zero={zero}
      init={(z) => {
        z.preload(z.query.patient);
        z.preload(z.query.dentist);
        z.preload(z.query.appointment);
        z.preload(z.query.clinicalNote);
      }}
    >
      <WarnIfOffline isOnline={zero.online}>{children}</WarnIfOffline>
    </ZeroProvider>
  );
}

function WarnIfOffline({
  isOnline,
  children,
}: {
  isOnline: boolean;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (!isOnline && !navigator.onLine) event.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => {
      window.removeEventListener("beforeunload", handler);
    };
  }, [isOnline]);

  return children;
}
