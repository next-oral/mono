import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import {
  check,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import { patient } from "./core";
import {
  codeSystemEnum,
  movementTypeEnum,
  toothNotationEnum,
  toothSurfaceEnum,
  toothTypeEnum,
} from "./enums";

// Tooth Types & Surfaces
export const toothType = pgTable("tooth_type", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: toothTypeEnum("name").unique().notNull(), // "Molar", "Premolar", "Incisor", "Canine"
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const toothSurface = pgTable("tooth_surface", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: toothSurfaceEnum("name").notNull(), // "Buccal", "Lingual", "Mesial", "Distal", "Occlusal"
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

// Junction table: which surfaces are available for each tooth type
export const toothTypeSurface = pgTable(
  "tooth_type_surface_mapping",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    toothTypeId: text("tooth_type_id")
      .notNull()
      .references(() => toothType.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    surfaceId: text("surface_id")
      .notNull()
      .references(() => toothSurface.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => [
    unique("unique_tooth_type_surface").on(table.toothTypeId, table.surfaceId),
  ],
);

// Teeth
export const tooth = pgTable(
  "tooth",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text("name"),
    position: integer("position").unique(),
    toothTypeId: text("tooth_type_id")
      .notNull()
      .references(() => toothType.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    notation: toothNotationEnum("notation").default("UNS"), // 1–32 or ISO/FDI notation (11–48)
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .$defaultFn(() => new Date())
      .notNull(),
  },
  () => [check("position_check", sql`"position" >= 1 AND "position" <= 32`)],
);

// Diagnoses & Procedures
export const diagnosis = pgTable("diagnosis", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  code: text("code").notNull(), // ICD-DA, SNODENT, or internal
  code_system: codeSystemEnum("code_system").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
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
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .$defaultFn(() => new Date())
    .notNull(),
});

// Missing Teeth & Movements
export const missingTooth = pgTable("missing_tooth", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  patId: text("pat_id")
    .notNull()
    .references(() => patient.id),
  toothId: text("tooth_id")
    .notNull()
    .references(() => tooth.id, { onDelete: "cascade", onUpdate: "cascade" }),
  reason: text("reason"),
  dateDetected: timestamp("date_detected", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const toothMovement = pgTable("tooth_movement", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  patId: text("pat_id")
    .notNull()
    .references(() => patient.id),
  toothId: text("tooth_id")
    .notNull()
    .references(() => tooth.id, { onDelete: "cascade", onUpdate: "cascade" }),
  type: movementTypeEnum("type").notNull(),
  description: text("description"),
  startDate: timestamp("start_date", { withTimezone: true }),
  endDate: timestamp("end_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .$defaultFn(() => new Date())
    .notNull(),
});

// Insert Schemas
export const toothTypeInsertSchema = createInsertSchema(toothType).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const surfaceInsertSchema = createInsertSchema(toothSurface).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const toothTypeSurfaceInsertSchema = createInsertSchema(
  toothTypeSurface,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const toothInsertSchema = createInsertSchema(tooth).omit({
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
export const toothTypeRelations = relations(toothType, ({ many }) => ({
  teeth: many(tooth),
  toothTypeSurfaces: many(toothTypeSurface),
}));

export const surfaceRelations = relations(toothSurface, ({ many }) => ({
  toothTypeSurfaces: many(toothTypeSurface),
}));

export const toothTypeSurfaceRelations = relations(
  toothTypeSurface,
  ({ one }) => ({
    toothType: one(toothType, {
      fields: [toothTypeSurface.toothTypeId],
      references: [toothType.id],
    }),
    surface: one(toothSurface, {
      fields: [toothTypeSurface.surfaceId],
      references: [toothSurface.id],
    }),
  }),
);

export const toothRelations = relations(tooth, ({ one, many }) => ({
  toothType: one(toothType, {
    fields: [tooth.toothTypeId],
    references: [toothType.id],
  }),
  missingTeeth: many(missingTooth),
  toothMovements: many(toothMovement),
}));

// Surface definitions
export const surfaces = [
  { name: "Buccal" as const, description: "Cheek side of the tooth" },
  { name: "Lingual" as const, description: "Tongue side of the tooth" },
  { name: "Mesial" as const, description: "Toward the midline of the mouth" },
  {
    name: "Distal" as const,
    description: "Away from the midline of the mouth",
  },
  { name: "Occlusal" as const, description: "Biting surface of the tooth" },
];

// // export const diagnosisRelations = relations(diagnosis, () => ({}));

// // export const procedureRelations = relations(procedure, () => ({}));

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
