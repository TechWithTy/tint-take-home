import { boolean, pgTable, serial, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { policies } from "./policies";
import { quotes } from "./quotes";
import { refunds } from "./refunds";
import { underwritingDetails } from "./underwritingDetails";


export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    underwritingDetailsId: uuid("underwriting_details_id").references(() => underwritingDetails.id, { onDelete: "cascade" }), // ✅ Correct link
    name: text("name").notNull(),
    email: text("email").unique().notNull(),
    passwordHash: text("password_hash").notNull(),
    isAdmin: boolean("is_admin").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
// Define relations to policies and quotes
export const usersRelations = relations(users, ({ many }) => ({
    policies: many(policies),
    quotes: many(quotes),
    refunds: many(refunds),

}));
