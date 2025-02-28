import { pgTable, uuid, text, numeric, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { policies } from "./policies";

export const refunds = pgTable("refunds", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  policyId: uuid("policy_id").references(() => policies.id, { onDelete: "cascade" }).notNull(),
  status: text("status").default("pending").notNull(), // ["pending", "approved", "rejected", "processed"]
  amount: numeric("amount").notNull(),
  reason: text("reason").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
