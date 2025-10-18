import type { CustomMutatorDefs, Transaction } from "@rocicorp/zero";

import type { Session } from "@repo/auth";
import type { AddressInsertSchema } from "@repo/database/schema";

import type { Appointment, Schema } from "../schema";

export function createMutators(_session: Session | null) {
  return {
    address: {
      create: async (tx: Transaction<Schema>, addr: AddressInsertSchema) => {
        //! TODO: create id on the client
        const id = "anno";
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
        await tx.mutate.address.update({
          ...addr,
          updatedAt: Date.now(),
        });
      },
    },

    appointment: {
      create: async (
        tx: Transaction<Schema>,
        apt: Omit<Appointment, "updatedAt" | "createdAt">,
      ) => {
        // const id = createId();
        await tx.mutate.appointment.upsert({
          ...apt,
          // id,
          updatedAt: Date.now(),
        });
      },
      update: async (
        tx: Transaction<Schema>,
        apt: Appointment & { id: string; updatedAt: number },
      ) => {
        await tx.mutate.appointment.update(apt);
      },
      delete: async (tx: Transaction<Schema>, apt: { id: string }) => {
        await tx.mutate.appointment.delete({
          id: apt.id,
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
