import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const splitCamelCaseToWords = (str: string) =>
  str.replace(/(?!^)([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());

export const handleClipBoardCopy = (text: string) => {
  void navigator.clipboard.writeText(text);
  toast.success("Copied to clipboard");
};

export const truncateText = (text: string, maxLength?: number): string => {
  // function to truncate texts
  if (!maxLength || text.length <= maxLength) return text
  return text.substring(0, maxLength) + "..."
}