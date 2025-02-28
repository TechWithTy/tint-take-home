import { relations } from "drizzle-orm/relations";
import { underwritingDetails, quotes, policies, users, refunds } from "./schema";

export const quotesRelations = relations(quotes, ({one, many}) => ({
	underwritingDetail: one(underwritingDetails, {
		fields: [quotes.underwritingDetailsId],
		references: [underwritingDetails.id]
	}),
	policies: many(policies),
}));

export const underwritingDetailsRelations = relations(underwritingDetails, ({many}) => ({
	quotes: many(quotes),
	users: many(users),
}));

export const policiesRelations = relations(policies, ({one, many}) => ({
	quote: one(quotes, {
		fields: [policies.quoteId],
		references: [quotes.id]
	}),
	user: one(users, {
		fields: [policies.userId],
		references: [users.id]
	}),
	refunds: many(refunds),
}));

export const usersRelations = relations(users, ({one, many}) => ({
	policies: many(policies),
	underwritingDetail: one(underwritingDetails, {
		fields: [users.underwritingDetailsId],
		references: [underwritingDetails.id]
	}),
	refunds: many(refunds),
}));

export const refundsRelations = relations(refunds, ({one}) => ({
	user: one(users, {
		fields: [refunds.userId],
		references: [users.id]
	}),
	policy: one(policies, {
		fields: [refunds.policyId],
		references: [policies.id]
	}),
}));