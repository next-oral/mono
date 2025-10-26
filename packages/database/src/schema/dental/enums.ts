import { pgEnum } from "drizzle-orm/pg-core";

// Patient Status
export const patStatusEnum = pgEnum("pat_status", ["ACTIVE", "INACTIVE"]);

export const genderEnum = pgEnum("gender", ["MALE", "FEMALE", "OTHER"]);
// Appointment Status
export const aptStatusEnum = pgEnum("apt_status", [
  "PENDING",
  "CONFIRMED",
  "CANCELED",
  "COMPLETED",
  "NO_SHOW",
  "MISSED",
]);

// Appointment Type
export const aptTypeEnum = pgEnum("apt_type", [
  "NEW_PATIENT",
  "CHECK_UP",
  "URGENT",
  "OTHER",
]);

// Treatment Plan Status
export const tpStatusEnum = pgEnum("tp_status", [
  "DRAFT",
  "APPROVED",
  "IN_PROGRESS",
  "COMPLETED",
]);

// Treatment Item Status
export const tiStatusEnum = pgEnum("ti_status", [
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELED",
  "REFERRED",
]);

// Tooth Surface Types (avoid conflict with table name 'tooth_surface')
export const toothSurfaceEnum = pgEnum("tooth_surface_type", [
  "Buccal",
  "Lingual",
  "Mesial",
  "Distal",
  "Occlusal",
  // "Facial",
  // "Incisal",
  // "Labial",
]);

export const toothTypeEnum = pgEnum("tooth_type_enum", [
  "Molar",
  "Premolar",
  "Incisor",
  "Canine",
]);
// Tooth Movement Types
export const movementTypeEnum = pgEnum("movement_type", [
  "ROTATION",
  "SHIFT",
  "EXTRUSION",
  "INTRUSION",
  "OTHER",
]);

/**
 * Tooth Notation
 * FDI: FDI (ISO 3950) - 11–48
 * UNS: UNS (1 - 32)
 */
export const toothNotationEnum = pgEnum("tooth_notation", ["FDI", "UNS"]);

export const codeSystemEnum = pgEnum("code_system", [
  "CDT",
  "ADA",
  "ICD-DA",
  "SNODENT",
  "INTERNAL",
]);

export const treatmentItemPriorityEnum = pgEnum("treatment_item_priority", [
  "LOW",
  "MEDIUM",
  "HIGH",
]);

export const colourEnum = pgEnum("colour", [
  "sky",
  "pink",
  "orange",
  "purple",
  "green",
  "blue",
  "red",
  "yellow",
  "rose",
  "lime",
  "indigo",
  "teal",
]);

export type Colour = (typeof colourEnum.enumValues)[number];
