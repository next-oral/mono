import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const splitCamelCaseToWords = (str: string) =>
  str.replace(/(?!^)([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());

export const generateAppleGradient = (color = "#C2D6FF") => {
  return `bg-[${color}] shadow-[inset_0px_-8px_16px_${color}40]`;
};
