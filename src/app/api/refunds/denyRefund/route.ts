import { NextResponse } from "next/server";
import { dbClient } from "@/db/dbClient";
import { policies } from "@/db/schema/policies";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
    try {
        const { policyId } = await req.json();

        // ✅ Ensure Policy Exists
        const policy = await dbClient
            .select()
            .from(policies)
            .where(eq(policies.id, policyId))
            .limit(1);

        if (!policy.length) {
            return NextResponse.json({ error: "Policy not found" }, { status: 404 });
        }

        // ✅ Mark Refund as Denied
        await dbClient
            .update(policies)
            .set({ status: "denied", requestedRefund: false })
            .where(eq(policies.id, policyId));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("🚨 Refund Denial Error:", error);
        return NextResponse.json({ error: "Failed to deny refund" }, { status: 500 });
    }
}
