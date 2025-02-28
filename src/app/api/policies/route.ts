import { NextResponse } from "next/server";
import { dbClient } from "@/db/dbClient";
import { policies } from "@/db/schema/policies";

export async function GET() {
    try {
        const policyList = await dbClient.select().from(policies);
        return NextResponse.json({ policies: policyList });
    } catch (error) {
        console.error("❌ Failed to fetch policies:", error);
        return NextResponse.json({ error: "Failed to load policies" }, { status: 500 });
    }
}
