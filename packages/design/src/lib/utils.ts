import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { getHours, getMinutes } from "date-fns";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export const gender = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];

export const DAYS_OF_WEEK = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export const userRoles = [
  { label: "Staff", value: "staff" as const, tooltip: "staff" },
  {
    label: "Administrator",
    value: "administrator" as const,
    tooltip:
      "Full system access: Manage users, configure settings, view reports, access all features",
  },
  {
    label: "Doctor",
    value: "doctor" as const,
    tooltip:
      "Edit treatment plans View appointment schedules Chat with patients Access medical records Add new users",
  },
];

export const dentalSpecialists = [
  { label: "Cosmetic Dentist", value: "cosmetic_dentist" },
  {
    label: "Dental Public Health Specialist",
    value: "dental_public_health_specialist",
  },
  { label: "Endodontist", value: "endodontist" },
  {
    label: "Oral and Maxillofacial Pathologist",
    value: "oral_and_maxillofacial_pathologist",
  },
  {
    label: "Oral and Maxillofacial Radiologist",
    value: "oral_and_maxillofacial_radiologist",
  },
  {
    label: "Oral and Maxillofacial Surgeon",
    value: "oral_and_maxillofacial_surgeon",
  },
  { label: "Orthodontist", value: "orthodontist" },
  { label: "Pediatric Dentist", value: "pediatric_dentist" },
  { label: "Periodontist", value: "periodontist" },
  { label: "Prosthodontist", value: "prosthodontist" },
];

export const dentalTreatmentServices = [
  { label: "Bonding", value: "bonding" },
  { label: "Braces", value: "braces" },
  { label: "Crowns", value: "crowns" },
  { label: "Dental Cleanings", value: "dental_cleanings" },
  { label: "Dental Fillings", value: "dental_fillings" },
  { label: "Dental Implants", value: "dental_implants" },
  { label: "Dentures", value: "dentures" },
  { label: "Fluoride Treatments", value: "fluoride_treatments" },
  { label: "Gum Grafts", value: "gum_grafts" },
  { label: "Oral Cancer Screenings", value: "oral_cancer_screenings" },
  { label: "Orthodontic Treatments", value: "orthodontic_treatments" },
  { label: "Periodontal Therapy", value: "periodontal_therapy" },
  { label: "Root Canal Therapy", value: "root_canal_therapy" },
  { label: "Scaling and Root Planing", value: "scaling_and_root_planing" },
  { label: "Sealants", value: "sealants" },
  { label: "Smile Makeovers", value: "smile_makeovers" },
  { label: "Teeth Whitening", value: "teeth_whitening" },
  { label: "Tooth Extractions", value: "tooth_extractions" },
  { label: "Veneers", value: "veneers" },
  { label: "Wisdom Teeth Removal", value: "wisdom_teeth_removal" },
];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const splitCamelCaseToWords = (str: string) =>
  str.replace(/(?!^)([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());

export function toCamelCase(input: string): string {
  if (!input || typeof input !== "string") return "";

  // Replace all hyphens and underscores with a single space, then trim
  const normalized = input.replace(/[-_]+/g, " ").trim();

  // Split into words and handle case conversion
  const words = normalized.split(" ");
  if (words.length <= 1) return words.join("").toLowerCase();

  // Convert to camelCase: first word lowercase, rest capitalized
  return words
    .map((word, index) => {
      if (index === 0) return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");
}

export const generateAppleGradient = (color = "#C2D6FF") => {
  return `bg-[${color}] shadow-[inset_0px_-8px_16px_${color}40]`;
};

export const handleClipBoardCopy = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
    return true;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    toast.error("Failed to copy to clipboard - " + errorMessage);
    return false;
  }
};

export const truncateText = (text: string, maxLength = 10): string => {
  // function to truncate texts
  if (!maxLength || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// this function is to cut out some characters from the file name leaving the remaining string and the file extension
export const truncateFileName = (fileName: string, maxLength: number) => {
  if (fileName.length <= maxLength) return fileName;
  const lastDotIndex = fileName.lastIndexOf(".");
  if (lastDotIndex === -1) {
    // No extension found
    return fileName.slice(0, maxLength - 3) + "...";
  }
  const extension = fileName.split(".").pop();
  const nameWithoutExtension = fileName.slice(0, lastDotIndex);
  const truncatedName = nameWithoutExtension.slice(0, maxLength - 3);
  return `${truncatedName}...${extension}`;
};

/**
 * Parses a time string (e.g., "9:30 AM") into total minutes since midnight.
 * NOTE: This relies on the JS Date object's ability to parse the time string
 * correctly within a standard date context.
 */
export function parseTimeToMinutes(timeStr: string): number {
  // 1. Parse the string into a Date object.
  // We prepend a dummy date ("2000/01/01") to ensure the time is parsed
  // relative to a known day, preventing issues with the current date/time.
  const date = new Date(`2000/01/01 ${timeStr}`);

  // 2. Validate if the parsing was successful.
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid time format: ${timeStr}`);
  }

  // 3. Use date-fns functions to get the components.
  const hours = getHours(date);
  const minutes = getMinutes(date);

  // 4. Calculate total minutes.
  return hours * 60 + minutes;
}
