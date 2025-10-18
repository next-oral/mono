// import type { Query } from "@rocicorp/zero";

// import type { Schema } from "../schema";

// /**
//  * Adds an organization filter to a Zero query using the provided field name.
//  * Common field names are `orgId` (domain tables) and `organizationId` (auth/team tables).
//  */
// export function scopeToOrg<TTable extends keyof Schema["tables"], TReturn>(
//   q: Query<Schema, TTable, TReturn>,
//   orgId: string,
//   options?: { field?: "orgId" | "organizationId" },
// ) {
//   const field = options?.field ?? "orgId";
//   return q.where(field, "=", orgId);
// }

// /**
//  * Convenience helper for tables that use `orgId`.
//  */
// export function withOrgId<TTable extends keyof Schema["tables"], TReturn>(
//   q: Query<Schema, TTable, TReturn>,
//   orgId: string,
// ) {
//   return scopeToOrg(q, orgId, { field: "orgId" });
// }

// /**
//  * Convenience helper for tables that use `organizationId`.
//  */
// export function withOrganizationId<
//   TTable extends keyof Schema["tables"] & string,
//   TReturn,
// >(q: Query<Schema, TTable, TReturn>, orgId: string) {
//   return scopeToOrg(q, orgId, { field: "organizationId" });
// }


