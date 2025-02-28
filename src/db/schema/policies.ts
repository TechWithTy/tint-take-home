import { pgTable, uuid, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { quotes } from "./quotes";
import { users } from "./users"; // ✅ Link to users instead of underwritingDetails

export const policies = pgTable("policies", {
  id: uuid("id").primaryKey().defaultRandom(),
  quoteId: uuid("quote_id").references(() => quotes.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(), // ✅ Fix user link
  amount: integer("amount").notNull(),
  requestedRefund: boolean("requested_refund").default(false).notNull(), // ✅ Track refund requests
  status: text("status").default("pending").notNull(), // ✅ Add status field
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export type Policy = typeof policies.$inferSelect;
