import { dbClient } from "@/db/dbClient";
import { schema } from "@/db/dbClient";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { dynamicMockQuotes } from "@/app/_data/quote/dynamicMockQuotes";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // 🔹 Lookup user ID from email
        const user = await dbClient
            .select({ id: schema.users.id })
            .from(schema.users)
            .where(eq(schema.users.email, session.user.email))
            .limit(1);

        if (!user.length) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const userId = user[0].id;

        // 🔹 Fetch quotes associated with the user's policies
        const quotes = await dbClient
            .select()
            .from(schema.quotes)
            .where(
                eq(schema.quotes.id, schema.policies.quoteId) // Match policies to quotes
            )

        return NextResponse.json(quotes.length > 0 ? quotes : dynamicMockQuotes);
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: "Failed to fetch quotes" }, { status: 500 });
    }
}
