import type {
  PermissionsConfig,
  Row,
  Schema as ZeroSchema,
} from "@rocicorp/zero";
import { ANYONE_CAN, definePermissions } from "@rocicorp/zero";

import { schema as genSchema } from "./schema.gen";

export const schema = {
  ...genSchema,
  enableLegacyMutators: false,
} as const satisfies ZeroSchema;

export type Schema = typeof schema;
export type Form = Row<typeof schema.tables.form>;
export type File = Row<typeof schema.tables.file>;
export type Tooth = Row<typeof schema.tables.tooth>;
export type Dentist = Row<typeof schema.tables.dentist>;
export type Patient = Row<typeof schema.tables.patient>;
export type Address = Row<typeof schema.tables.address>;
export type Appointment = Row<typeof schema.tables.appointment>;
export type ClinicalNote = Row<typeof schema.tables.clinicalNote>;
export type Verification = Row<typeof schema.tables.verification>;
export type FormResponse = Row<typeof schema.tables.formResponse>;
export type MissingTooth = Row<typeof schema.tables.missingTooth>;
export type ToothMovement = Row<typeof schema.tables.toothMovement>;
export type TreatmentPlan = Row<typeof schema.tables.treatmentPlan>;

export type Tables = keyof Schema["tables"];
export type SchemaRow =
  | Form
  | File
  | Tooth
  | Dentist
  | Patient
  | Address
  | Appointment
  | ClinicalNote
  | Verification
  | FormResponse
  | MissingTooth
  | ToothMovement
  | TreatmentPlan;
export interface AuthData {
  // The logged-in user.
  sub: string;
}

export const permissions = definePermissions<{}, Schema>(schema, () => {
  return {
    // Minimal permissive config for development; scope down later
    address: {
      row: { select: ANYONE_CAN, insert: ANYONE_CAN },
    },
    patient: {
      row: { select: ANYONE_CAN, insert: ANYONE_CAN },
    },
    dentist: {
      row: { select: ANYONE_CAN, insert: ANYONE_CAN },
    },
    clinicalNote: {
      row: { select: ANYONE_CAN },
    },
    appointment: {
      row: { select: ANYONE_CAN },
    },
    file: {
      row: { select: ANYONE_CAN },
    },
    missingTooth: {
      row: { select: ANYONE_CAN },
    },
    tooth: {
      row: { select: ANYONE_CAN },
    },
    toothMovement: {
      row: { select: ANYONE_CAN },
    },
    treatmentPlan: {
      row: { select: ANYONE_CAN },
    },
    verification: {
      row: { select: ANYONE_CAN },
    },
    form: {
      row: { select: ANYONE_CAN },
    },
    formResponse: {
      row: { select: ANYONE_CAN },
    },
  } satisfies PermissionsConfig<AuthData, Schema>;
});
