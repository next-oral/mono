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
  patId: text("pat_id").notNull(),
  dentistId: text("dentist_id").notNull(), // primary provider
  notes: text("notes"),
  status: tpStatusEnum("status").default("DRAFT"),
  createdBy: text("created_by").references(() => user.id),
  editedBy: text("edited_by").references(() => user.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const treatmentItem = pgTable("treatment_item", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  treatmentPlanId: text("treatment_plan_id").notNull(),
  appointmentId: text("appointment_id"),
  dentistId: text("dentist_id"),
  toothSurfaceId: text("tooth_surface_id"),
  diagnosisId: text("diagnosis_id"),
  procedureId: text("procedure_id"),
  status: tiStatusEnum("status"),
  date: timestamp("date"),
  priority: treatmentItemPriorityEnum("priority").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
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
export const treatmentPlanRelations = relations(
  treatmentPlan,
  ({ one, many }) => ({
    patient: one(patient, {
      fields: [treatmentPlan.patId],
      references: [patient.id],
    }),
    dentist: one(dentist, {
      fields: [treatmentPlan.dentistId],
      references: [dentist.id],
    }),
    treatmentItems: many(treatmentItem),
  }),
);

export const treatmentItemRelations = relations(treatmentItem, ({ one }) => ({
  treatmentPlan: one(treatmentPlan, {
    fields: [treatmentItem.treatmentPlanId],
    references: [treatmentPlan.id],
  }),
  appointment: one(appointment, {
    fields: [treatmentItem.appointmentId],
    references: [appointment.id],
  }),
  dentist: one(dentist, {
    fields: [treatmentItem.dentistId],
    references: [dentist.id],
  }),
  toothSurface: one(toothSurface, {
    fields: [treatmentItem.toothSurfaceId],
    references: [toothSurface.id],
  }),
  diagnosis: one(diagnosis, {
    fields: [treatmentItem.diagnosisId],
    references: [diagnosis.id],
  }),
  procedure: one(procedure, {
    fields: [treatmentItem.procedureId],
    references: [procedure.id],
  }),
}));
