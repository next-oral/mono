import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { env } from "~/env";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric chars with hyphens
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
    .replace(/-+/g, "-"); // Replace multiple hyphens with single hyphen
}

export function isSubdomain(hostname: string): boolean {
  const rootDomainFormatted = env.NEXT_PUBLIC_ROOT_DOMAIN.split(":")[0];

  // Handle local development
  if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
    return hostname.includes(".localhost");
  }

  // Handle Vercel preview URLs
  if (hostname.includes("---") && hostname.endsWith(".vercel.app")) {
    return true;
  }

  // Check if it's a subdomain of the root domain
  return (
    hostname !== rootDomainFormatted &&
    hostname !== `www.${rootDomainFormatted}` &&
    hostname.endsWith(`.${rootDomainFormatted}`)
  );
}

export function waitMs(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
