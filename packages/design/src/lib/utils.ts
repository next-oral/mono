import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const splitCamelCaseToWords = (str: string) =>
  str.replace(/(?!^)([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
