import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export const gender = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const splitCamelCaseToWords = (str: string) =>
  str.replace(/(?!^)([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());

export const generateAppleGradient = (color = "#C2D6FF") => {
  return `bg-[${color}] shadow-[inset_0px_-8px_16px_${color}40]`;
};

export const handleClipBoardCopy = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  } catch (error) {
    toast.error("Failed to copy to clipboard - " + (error as Error).message);
  }
};

export const truncateText = (text: string, maxLength?: number): string => {
  // function to truncate texts
  if (!maxLength || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}
