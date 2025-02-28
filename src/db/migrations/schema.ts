import { pgTable, uuid, text, integer, timestamp, foreignKey, boolean, unique, numeric } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const underwritingDetails = pgTable("underwriting_details", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	email: text().notNull(),
	numberCars: integer("number_cars").notNull(),
	addressLine1: text("address_line_1").notNull(),
	addressLine2: text("address_line_2"),
	city: text().notNull(),
	state: text().notNull(),
	zip: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	userId: uuid("user_id").defaultRandom(),
});

export const quotes = pgTable("quotes", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	premium: integer(),
	limit: integer(),
	deductible: integer(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	underwritingDetailsId: uuid("underwriting_details_id").notNull(),
	userId: uuid("user_id").notNull(),
	userEmail: text("user_email").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.underwritingDetailsId],
			foreignColumns: [underwritingDetails.id],
			name: "quotes_underwriting_details_id_underwriting_details_id_fk"
		}).onDelete("cascade"),
]);

export const policies = pgTable("policies", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	quoteId: uuid("quote_id").notNull(),
	userId: uuid("user_id").notNull(),
	amount: integer().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	requestedRefund: boolean("requested_refund").default(false).notNull(),
	status: text().default('pending').notNull(),
}, (table) => [
	foreignKey({
			columns: [table.quoteId],
			foreignColumns: [quotes.id],
			name: "policies_quote_id_quotes_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "policies_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const users = pgTable("users", {
	name: text().notNull(),
	email: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	id: uuid().defaultRandom().primaryKey().notNull(),
	passwordHash: text("password_hash").notNull(),
	isAdmin: boolean("is_admin").default(false).notNull(),
	underwritingDetailsId: uuid("underwriting_details_id"),
}, (table) => [
	foreignKey({
			columns: [table.underwritingDetailsId],
			foreignColumns: [underwritingDetails.id],
			name: "users_underwriting_details_id_underwriting_details_id_fk"
		}).onDelete("cascade"),
	unique("users_email_unique").on(table.email),
]);

export const refunds = pgTable("refunds", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	policyId: uuid("policy_id").notNull(),
	status: text().default('pending').notNull(),
	amount: numeric().notNull(),
	reason: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "refunds_user_id_users_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.policyId],
			foreignColumns: [policies.id],
			name: "refunds_policy_id_policies_id_fk"
		}).onDelete("cascade"),
]);
