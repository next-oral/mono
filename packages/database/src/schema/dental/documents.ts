import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import { organization, user } from "../auth";
import { appointment, dentist, patient } from "./core";

// Documents & Media
export const file = pgTable("file", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  orgId: text("org_id")
    .notNull()
    .references(() => organization.id),
  patId: text("pat_id"),
  appointmentId: text("appointment_id"),
  uploadedBy: text("uploaded_by").references(() => user.id),
  fileType: text("file_type").default("image/*"),
  storageUrl: text("storage_url").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .$defaultFn(() => new Date())
    .notNull(),
});

// Clinical Notes & Forms
export const clinicalNote = pgTable("clinical_note", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  appointmentId: text("appointment_id")
    .notNull()
    .references(() => appointment.id),
  dentistId: text("dentist_id")
    .notNull()
    .references(() => dentist.id),
  notes: text("notes").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const form = pgTable("form", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  orgId: text("org_id")
    .notNull()
    .references(() => organization.id),
  name: text("name").notNull(),
  schema: jsonb("schema"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const formResponse = pgTable("form_response", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  formId: text("form_id")
    .notNull()
    .references(() => form.id),
  patId: text("pat_id")
    .notNull()
    .references(() => patient.id),
  submittedBy: text("submitted_by").references(() => user.id),
  data: jsonb("data"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .$defaultFn(() => new Date())
    .notNull(),
});

// Insert Schemas
export const fileInsertSchema = createInsertSchema(file).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const clinicalNoteInsertSchema = createInsertSchema(clinicalNote).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const formInsertSchema = createInsertSchema(form).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const formResponseInsertSchema = createInsertSchema(formResponse).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Relations
// export const fileRelations = relations(file, ({ one }) => ({
//   patient: one(patient, {
//     fields: [file.patId],
//     references: [patient.id],
//   }),
//   appointment: one(appointment, {
//     fields: [file.appointmentId],
//     references: [appointment.id],
//   }),
// }));

// export const clinicalNoteRelations = relations(clinicalNote, ({ one }) => ({
//   appointment: one(appointment, {
//     fields: [clinicalNote.appointmentId],
//     references: [appointment.id],
//   }),
//   dentist: one(dentist, {
//     fields: [clinicalNote.dentistId],
//     references: [dentist.id],
//   }),
// }));

// export const formRelations = relations(form, ({ many }) => ({
//   responses: many(formResponse),
// }));

// export const formResponseRelations = relations(formResponse, ({ one }) => ({
//   form: one(form, {
//     fields: [formResponse.formId],
//     references: [form.id],
//   }),
//   patient: one(patient, {
//     fields: [formResponse.patId],
//     references: [patient.id],
//   }),
// }));
