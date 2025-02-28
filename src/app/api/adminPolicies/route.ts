import { NextResponse } from "next/server";
import { getServerSession } from "next-auth"; // ✅ Import NextAuth session
import { dbClient } from "@/db/dbClient";
import { policies } from "@/db/schema/policies";
import { eq } from "drizzle-orm";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: Request) {
    try {
        // ✅ Get admin session
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // ✅ Fetch only policies with `requestedRefund = true`
        const policyList = await dbClient
            .select()
            .from(policies)
            .where(eq(policies.requestedRefund, true));

        return NextResponse.json({ policies: policyList });
    } catch (error) {
        console.error("❌ Failed to fetch policies:", error);
        return NextResponse.json({ error: "Failed to load policies" }, { status: 500 });
    }
}
