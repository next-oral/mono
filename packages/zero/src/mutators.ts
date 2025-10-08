import type { CustomMutatorDefs, Transaction } from "@rocicorp/zero";
import { createId } from "@paralleldrive/cuid2";

import type {
  AddressInsertSchema,
  AppointmentInsertSchema,
} from "@repo/database/schema";

import type { AuthData, Schema } from "./schema";

export function createMutators(_authData: AuthData | undefined) {
  return {
    address: {
      create: async (tx: Transaction<Schema>, addr: AddressInsertSchema) => {
        const id = createId();
        return await tx.mutate.address.insert({
          ...addr,
          id,
          updatedAt: Date.now(),
        });
      },
      update: async (
        tx: Transaction<Schema>,
        addr: AddressInsertSchema & { id: string },
      ) => {
        console.log("addr", addr);
        await tx.mutate.address.update({
          ...addr,
          updatedAt: Date.now(),
        });
      },
    },

    appointment: {
      create: async (tx: Transaction<Schema>, apt: AppointmentInsertSchema) => {
        const id = createId();
        return await tx.mutate.appointment.insert({
          ...apt,
          id,
          start: new Date(apt.start).getTime(),
          end: new Date(apt.end).getTime(),
          updatedAt: Date.now(),
        });
      },
      update: async (
        tx: Transaction<Schema>,
        apt: AppointmentInsertSchema & { id: string; updatedAt: number },
      ) => {
        await tx.mutate.appointment.update({
          ...apt,
          start: new Date(apt.start).getTime(),
          end: new Date(apt.end).getTime(),
        });
      },
    },
    patient: {
      create: async (
        tx: Transaction<Schema>,
        pat: {
          id: string;
          orgId: string;
          firstName: string;
          lastName: string;
          middleName?: string;
          email?: string;
          phone?: string;
          status?: "ACTIVE" | "INACTIVE" | null | undefined;
          dob: number;
          addressId: string;
          createdAt?: number;
        },
      ) => {
        const now = Date.now();
        return await tx.mutate.patient.insert({
          ...pat,
          updatedAt: now,
        });
      },

      update: async (
        tx: Transaction<Schema>,
        pat: {
          id: string;
          firstName?: string;
          lastName?: string;
          middleName?: string;
          email?: string;
          phone?: string;
          status?: "ACTIVE" | "INACTIVE" | null | undefined;
          dob?: number;
        },
      ) => {
        const now = Date.now();
        await tx.mutate.patient.update({
          ...pat,
          updatedAt: now,
        });
      },
    },
  } as const satisfies CustomMutatorDefs;
}

export type Mutators = ReturnType<typeof createMutators>;
