import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { env } from "~/env";

function extractSubdomain(request: NextRequest): string | null {
  const url = request.url;
  const host = request.headers.get("host") ?? "";
  const hostname = host.split(":")[0] ?? "";

  // Local development environment
  if (url.includes("localhost") || url.includes("127.0.0.1")) {
    const fullUrlMatch = /https:\/\/([^.]+)\.localhost/.exec(url);
    if (fullUrlMatch?.[1]) return fullUrlMatch[1];

    if (hostname.includes(".localhost")) return hostname.split(".")[0] ?? "";

    return null;
  }

  // Production environment
  const rootDomainFormatted = env.NEXT_PUBLIC_ROOT_DOMAIN.split(":")[0];

  // Handle Vercel preview URLs like tenant---branch-name.vercel.app
  if (hostname.includes("---") && hostname.endsWith(".vercel.app")) {
    const parts = hostname.split("---");
    return parts.length > 0 ? (parts[0] ?? null) : null;
  }

  const isSubdomain =
    hostname !== rootDomainFormatted &&
    hostname !== `www.${rootDomainFormatted}` &&
    hostname.endsWith(`.${rootDomainFormatted}`);

  return isSubdomain ? hostname.replace(`.${rootDomainFormatted}`, "") : null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  return NextResponse.next();
  const subdomain = extractSubdomain(request);

  if (subdomain && pathname === "/login") {
    const url = new URL(request.url);
    url.pathname = "/";

    console.log("[Redirecting] /login to /");
    return NextResponse.redirect(url);
  }
  // Redirect /admin access on subdomains
  if (subdomain && pathname.startsWith("/admin")) {
    console.log("[Redirecting] /admin to /");
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Rewrite all paths on subdomain to subdomain-specific pages
  if (subdomain) {
    console.log(`[Rewriting] ${pathname} to /s/${subdomain}${pathname}`);
    return NextResponse.rewrite(
      new URL(`/s/${subdomain}${pathname}`, request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
