import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import { patient } from "./core";
import {
  codeSystemEnum,
  movementTypeEnum,
  toothNotationEnum,
  toothSurfaceEnum,
} from "./enums";

// Teeth & Surfaces
export const tooth = pgTable("tooth", {
  id: text("id").primaryKey(),
  name: text("name"),
  position: integer("position").unique(),
  notation: toothNotationEnum("notation").default("UNS"), // 1–32 or ISO/FDI notation (11–48)
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const toothSurface = pgTable("tooth_surface", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  toothId: text("tooth_id").notNull(),
  surface: toothSurfaceEnum("surface").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

// Diagnoses & Procedures
export const diagnosis = pgTable("diagnosis", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  code: text("code").notNull(), // ICD-DA, SNODENT, or internal
  code_system: codeSystemEnum("code_system").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

/**
 * There are 759 procedure code in the CDT code system.
 */
export const procedure = pgTable("procedure", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  code_system: codeSystemEnum("code_system").notNull(), // CDT, ADA, or internal
  code: text("code").notNull(), // CDT, ADA, or internal
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

// Missing Teeth & Movements
export const missingTooth = pgTable("missing_tooth", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  patId: text("pat_id").notNull(),
  toothId: text("tooth_id").notNull(),
  reason: text("reason"),
  dateDetected: timestamp("date_detected"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const toothMovement = pgTable("tooth_movement", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  patId: text("pat_id").notNull(),
  toothId: text("tooth_id").notNull(),
  type: movementTypeEnum("type").notNull(),
  description: text("description"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

// Insert Schemas
export const toothInsertSchema = createInsertSchema(tooth).omit({
  createdAt: true,
  updatedAt: true,
});

export const toothSurfaceInsertSchema = createInsertSchema(toothSurface).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const diagnosisInsertSchema = createInsertSchema(diagnosis).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const procedureInsertSchema = createInsertSchema(procedure).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const missingToothInsertSchema = createInsertSchema(missingTooth).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const toothMovementInsertSchema = createInsertSchema(toothMovement).omit(
  {
    id: true,
    createdAt: true,
    updatedAt: true,
  },
);

// Relations
export const toothRelations = relations(tooth, ({ many }) => ({
  surfaces: many(toothSurface),
  missingTeeth: many(missingTooth),
  toothMovements: many(toothMovement),
}));

export const toothSurfaceRelations = relations(toothSurface, ({ one }) => ({
  tooth: one(tooth, {
    fields: [toothSurface.toothId],
    references: [tooth.id],
  }),
}));

// export const diagnosisRelations = relations(diagnosis, () => ({}));

// export const procedureRelations = relations(procedure, () => ({}));

export const missingToothRelations = relations(missingTooth, ({ one }) => ({
  patient: one(patient, {
    fields: [missingTooth.patId],
    references: [patient.id],
  }),
  tooth: one(tooth, {
    fields: [missingTooth.toothId],
    references: [tooth.id],
  }),
}));

export const toothMovementRelations = relations(toothMovement, ({ one }) => ({
  patient: one(patient, {
    fields: [toothMovement.patId],
    references: [patient.id],
  }),
  tooth: one(tooth, {
    fields: [toothMovement.toothId],
    references: [tooth.id],
  }),
}));
