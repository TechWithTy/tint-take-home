import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OpenAI } from "openai";
import { eq } from "drizzle-orm"; // ✅ Import eq from drizzle-orm/sql
import { quotes } from "@/db/schema/quotes";
import { authOptions } from "../auth/[...nextauth]/route";
import { dbClient } from "@/db/dbClient";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
    try {
        // ✅ Get user session from NextAuth
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id; // ✅ Required for inserting/updating quotes
        const userEmail = session.user.email;

        const { businessName, industry, revenue, numEmployees, coverageAmount, deductible, businessLocation } = await req.json();

        // Generate sentiment analysis input
        const userInput = `
            Business Name: ${businessName}
            Industry: ${industry}
            Annual Revenue: $${revenue}
            Number of Employees: ${numEmployees}
            Coverage Amount: $${coverageAmount}
            Deductible: $${deductible}
            Business Location: ${businessLocation}
        `;

        // Analyze sentiment using OpenAI
        const sentimentResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "Analyze the sentiment of this business insurance request: positive, neutral, or negative." },
                { role: "user", content: userInput }
            ],
            temperature: 0.5,
            max_tokens: 10,
        });

        const sentiment = sentimentResponse.choices[0]?.message?.content?.trim() || "neutral";

        // Adjust premium based on sentiment
        let premium = 1000;
        if (sentiment === "positive") premium -= 100;
        if (sentiment === "negative") premium += 200;

        // ✅ Check if the user already has a quote
        const existingQuote = await dbClient
            .select()
            .from(quotes)
            .where(eq(quotes.userId, userId)) // ✅ Use eq() correctly
            .limit(1);

        let updatedQuote;
        if (existingQuote.length > 0) { // ✅ Check if a quote exists
            updatedQuote = await dbClient
                .update(quotes)
                .set({
                    premium,
                    limit: coverageAmount,
                    deductible,
                    updatedAt: new Date(),
                })
                .where(eq(quotes.userId, userId)) // ✅ Use eq() correctly
                .returning();
        } else {
            updatedQuote = await dbClient
                .insert(quotes)
                .values({
                    userId, // ✅ Required field
                    userEmail, // ✅ Ensure userEmail is stored
                    premium,
                    limit: coverageAmount,
                    deductible,
                    underwritingDetailsId: "some-uuid", // Replace with actual underwriting ID
                })
                .returning();
        }

        return NextResponse.json({ quote: updatedQuote, sentiment }, { status: 200 });

    } catch (error) {
        console.error("Error updating user quote:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
