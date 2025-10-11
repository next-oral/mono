// import type { ServerTransaction } from "@rocicorp/zero";
// import type { CustomMutatorDefs } from "@rocicorp/zero/pg"; // Note: from /pg

// // import { eq } from "drizzle-orm";

// // import type { DrizzleTransaction } from "@repo/database/client"; // My Drizzle transaction type
// // import { Order } from "@repo/database/schema"; // My Drizzle schema

// import type { DrizzleTransaction } from "../drizzle";
// import type { AuthData, Schema } from "../schema";
// import { createMutators } from "./index"; // Client mutators

// export function createServerMutators(
//   authData: AuthData,
//   _asyncTasks: (() => Promise<void>)[] = [], // For out-of-transaction async work
// ) {
//   const clientMutators = createMutators(authData); // Standard client mutators
//   return {
//     ...clientMutators,
//     // Example of a server-specific mutator or overriding a client one
//     reverseOrderNameCasing: {
//       update: async (
//         tx, // This `tx` is now strongly typed!
//         { id, fullName }: { id: string; fullName: string },
//       ) => {
//         const apt =
//           await tx.dbTransaction.wrappedTransaction.query.appointment.findFirst();
//         // You can still call the client-side optimistic version if you want
//         // await clientMutators.reverseOrderNameCasing.update(tx, {
//         //   id,
//         //   fullName,
//         // });
//         // And now, the magic: access your ORM's transaction directly!
//         // tx.dbTransaction is the DBTransaction<DrizzleTransaction>
//         // tx.dbTransaction.wrappedTransaction is our DrizzleTransaction
//         // await tx.dbTransaction.wrappedTransaction
//         //   .update(patient)
//         //   .set({ fullName })
//         //   .where(eq(Order.id, id));
//       },
//     },
//   } as const satisfies CustomMutatorDefs<
//     ServerTransaction<Schema, DrizzleTransaction> // Here's the custom tx type!
//   >;
// }
