import type { CustomMutatorDefs, Transaction } from "@rocicorp/zero";

import type { AddressInsertSchema } from "@repo/database/schema";

import type { AuthData, Schema } from "./schema";

export function createMutators(_authData: AuthData | undefined) {
  console.log("[createMutators]");
  return {
    address: {
      insert: async (tx: Transaction<Schema>, addr: AddressInsertSchema) => {
        const now = Date.now();
        return await tx.mutate.address.insert({
          ...addr,
          id: crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
        });
      },
    },

    patient: {
      insert: async (
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
