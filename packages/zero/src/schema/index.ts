import type { PermissionsConfig } from "@rocicorp/zero";
import { ANYONE_CAN, definePermissions } from "@rocicorp/zero";

import type {
  Address,
  Appointment,
  ClinicalNote,
  Dentist,
  Form,
  FormResponse,
  MissingTooth,
  Patient,
  Tooth,
  ToothMovement,
  TreatmentPlan,
  Verification,
} from "./schema.gen";
import { schema } from "./schema.gen";

export * from "./schema.gen";

// export const schema = {
//   ...genSchema,
//   enableLegacyMutators: false,
// } as const satisfies ZeroSchema;

export type Schema = typeof schema;

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
  role: string;
  orgId: string;
}

export const permissions = definePermissions<Record<string, unknown>, Schema>(
  schema,
  () => {
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
        row: { select: ANYONE_CAN, delete: ANYONE_CAN },
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
  },
);
