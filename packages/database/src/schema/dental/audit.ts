import { createId } from "@paralleldrive/cuid2";
import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

// Audit Logs
export const auditLog = pgTable("audit_log", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  orgId: text("org_id").notNull(),
  userId: text("user_id"),
  patId: text("pat_id"),
  action: text("action"),
  entity: text("entity"),
  entityId: text("entity_id"),
  changes: jsonb("changes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert Schema
export const auditLogInsertSchema = createInsertSchema(auditLog).omit({
  id: true,
  createdAt: true,
});
