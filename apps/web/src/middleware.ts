import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { rootDomain } from "./lib/utils";

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
  const rootDomainFormatted = rootDomain.split(":")[0];

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

  const subdomain = extractSubdomain(request);

  // Redirect /admin access on subdomains
  if (subdomain && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Rewrite root path on subdomain to subdomain-specific page
  if (subdomain && pathname === "/") {
    // const cookie = getSessionCookie(request.headers);
    // const header = new Headers(request.headers);
    // header.set("cookie", cookie ?? "");

    // console.log("subdomains", cookie);
    // header.set("x-subdomain", subdomain ?? "");

    const response = NextResponse.rewrite(
      new URL(`/s/${subdomain}`, request.url),
    );

    return response;

    return NextResponse.rewrite(new URL(`/s/${subdomain}`, request.url));
  }

  // 🔐 Example authentication protection for specific paths
  // Uncomment and customize this block if you use auth

  // if (pathname.startsWith("/admin")) {
  //   const { data: session } = await client.getSession({
  //     fetchOptions: {
  //       headers: {
  //         cookie: request.headers.get("cookie") ?? "",
  //       },
  //     },
  //   });

  //   if (!session) {
  //     return NextResponse.redirect(new URL("/sign-in", request.url));
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
