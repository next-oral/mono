import type { z } from "zod/v4";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import { organization } from "../auth";
import { aptStatusEnum, aptTypeEnum, colourEnum, patStatusEnum } from "./enums";

// Core Tables
export const patient = pgTable("patient", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  orgId: text("org_id")
    .notNull()
    .references(() => organization.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  middleName: text("middle_name"),
  email: text("email").unique(),
  phone: text("phone"),
  status: patStatusEnum("status").default("ACTIVE"),
  dob: timestamp("dob").notNull(),
  addressId: text("address_id")
    .notNull()
    .references(() => address.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const dentist = pgTable("dentist", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  orgId: text("org_id")
    .notNull()
    .references(() => organization.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").unique(),
  phone: text("phone"),
  specialization: text("specialization"),
  licenseNumber: text("license_number").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const address = pgTable("address", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  street: text("street").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  country: text("country").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const appointment = pgTable("appointment", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  orgId: text("org_id")
    .notNull()
    .references(() => organization.id),
  patId: text("pat_id").notNull(),
  dentistId: text("dentist_id").notNull(),
  status: aptStatusEnum("status").default("PENDING"),
  note: text("note"),
  colour: colourEnum("colour").notNull(),
  description: text("description"),
  type: aptTypeEnum("type"),
  start: timestamp("start", { withTimezone: true }).notNull(),
  end: timestamp("end", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .$defaultFn(() => new Date())
    .notNull(),
});

// Insert Schemas
export const patientInsertSchema = createInsertSchema(patient).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const dentistInsertSchema = createInsertSchema(dentist).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const addressInsertSchema = createInsertSchema(address).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type AddressInsertSchema = z.infer<typeof addressInsertSchema>;

export const appointmentInsertSchema = createInsertSchema(appointment).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type AppointmentInsertSchema = z.infer<typeof appointmentInsertSchema>;

// Relations
export const patientRelations = relations(patient, ({ one, many }) => ({
  address: one(address, {
    fields: [patient.addressId],
    references: [address.id],
  }),
  appointments: many(appointment),
}));

export const dentistRelations = relations(dentist, ({ many }) => ({
  appointments: many(appointment),
}));

export const addressRelations = relations(address, ({ many }) => ({
  patients: many(patient),
}));

export const appointmentRelations = relations(appointment, ({ one }) => ({
  patient: one(patient, {
    fields: [appointment.patId],
    references: [patient.id],
  }),
  dentist: one(dentist, {
    fields: [appointment.dentistId],
    references: [dentist.id],
  }),
}));
