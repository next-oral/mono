import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import { diagnosis, procedure, toothSurface } from ".";
import { user } from "../auth";
import { appointment, dentist, patient } from "./core";
import { tiStatusEnum, tpStatusEnum, treatmentItemPriorityEnum } from "./enums";

// Treatment Plan & Items
export const treatmentPlan = pgTable("treatment_plan", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  patId: text("pat_id")
    .notNull()
    .references(() => patient.id),
  dentistId: text("dentist_id")
    .notNull()
    .references(() => dentist.id), // primary provider
  notes: text("notes"),
  status: tpStatusEnum("status").default("DRAFT"),
  createdBy: text("created_by").references(() => user.id),
  editedBy: text("edited_by").references(() => user.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const treatmentItem = pgTable("treatment_item", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  treatmentPlanId: text("treatment_plan_id")
    .notNull()
    .references(() => treatmentPlan.id),
  appointmentId: text("appointment_id").references(() => appointment.id),
  dentistId: text("dentist_id").references(() => dentist.id),
  toothSurfaceId: text("tooth_surface_id").references(() => toothSurface.id),
  diagnosisId: text("diagnosis_id").references(() => diagnosis.id),
  procedureId: text("procedure_id").references(() => procedure.id),
  status: tiStatusEnum("status"),
  date: timestamp("date", { withTimezone: true }),
  priority: treatmentItemPriorityEnum("priority").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .$defaultFn(() => new Date())
    .notNull(),
});

// Insert Schemas
export const treatmentPlanInsertSchema = createInsertSchema(treatmentPlan).omit(
  {
    id: true,
    createdAt: true,
    updatedAt: true,
  },
);

export const treatmentItemInsertSchema = createInsertSchema(treatmentItem).omit(
  {
    id: true,
    createdAt: true,
    updatedAt: true,
  },
);

// Relations
export const treatmentPlanRelations = relations(treatmentPlan, ({ many }) => ({
  treatmentItems: many(treatmentItem),
}));

export const treatmentItemRelations = relations(treatmentItem, ({ one }) => ({
  treatmentPlan: one(treatmentPlan, {
    fields: [treatmentItem.treatmentPlanId],
    references: [treatmentPlan.id],
  }),
}));
