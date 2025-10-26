import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { env } from "~/env";

function extractSubdomain(request: NextRequest): string | null {
  // const url = request.url;
  const host = request.headers.get("host") ?? "";
  const hostname = host.split(":")[0] ?? "";

  // console.log(host, url);

  // Local development environment
  if (host.includes("localhost") || host.includes("127.0.0.1")) {
    const fullUrlMatch = /https:\/\/([^.]+)\.localhost/.exec(host);
    if (fullUrlMatch?.[1]) return fullUrlMatch[1];

    if (hostname.includes(".localhost")) return hostname.split(".")[0] ?? "";
    console.log("in localhost");

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
  // return NextResponse.next();

  /**
   * Proxy /yjs and /sync to localhost:1234 and localhost:4848 respectively
   * This is needed because the yjs and sync servers are running on localhost
   * and we need to proxy them to the correct ports
   * This is a workaround to avoid Caddyfile issues
   */
  // Proxy /yjs to localhost:1234 and strip the /yjs prefix
  if (request.nextUrl.pathname.startsWith("/yjs/")) {
    const newPath = request.nextUrl.pathname.replace(/^\/yjs/, "");
    const proxyUrl = `http://localhost:1234${newPath}${request.nextUrl.search}`;
    return NextResponse.redirect(proxyUrl, 307);
  }

  // Proxy /sync to localhost:4848 and preserve the /sync prefix
  if (request.nextUrl.pathname.startsWith("/sync/")) {
    const proxyUrl = `http://localhost:4848${request.nextUrl.pathname}${request.nextUrl.search}`;
    return NextResponse.redirect(proxyUrl, 307);
  }

  const subdomain = extractSubdomain(request);
  console.log("subdomain", subdomain);
  console.log("pathname", pathname);
  const url = `${env.NEXT_PUBLIC_PROTOCOL}://${env.NEXT_PUBLIC_ROOT_DOMAIN}`;
  if (subdomain && subdomain !== "nextoral" && pathname === "/login") {
    const newUrl = new URL(url);
    newUrl.pathname = "/";

    console.log("[Redirecting] /login to /");
    return NextResponse.redirect(newUrl);
  }
  // Redirect /admin access on subdomains
  if (subdomain && pathname.startsWith("/admin")) {
    console.log("[Redirecting] /admin to /");
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Rewrite all paths on subdomain to subdomain-specific pages
  if (subdomain && subdomain !== "nextoral") {
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
