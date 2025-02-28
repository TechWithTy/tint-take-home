import { NextResponse } from "next/server";
import { getServerSession } from "next-auth"; // ✅ Import NextAuth session
import { dbClient } from "@/db/dbClient";
import { policies } from "@/db/schema/policies";
import { refunds } from "@/db/schema/refunds";
import { eq } from "drizzle-orm";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    // ✅ Get admin session
    const session = await getServerSession(authOptions);
    console.log("Admin session:", session?.user);
    if (!session || !session.user?.isAdmin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { userId, policyId, amount, reason } = await req.json();
    if (!userId || !policyId) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // ✅ Check if policy exists and refund was requested
    const [policy] = await dbClient
      .select()
      .from(policies)
      .where(eq(policies.id, policyId))
      .limit(1);

    if (!policy || !policy.requestedRefund) {
      return NextResponse.json({ success: false, error: "Invalid policy or no refund requested" }, { status: 400 });
    }

    // ✅ Insert refund record without adminId
    await dbClient.insert(refunds).values({
      userId,
      policyId,
      amount,
      status: "approved",
      reason,
    });

    // ✅ Update policy status
    await dbClient
      .update(policies)
      .set({ status: "approved", requestedRefund: false })
      .where(eq(policies.id, policyId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("🚨 Error approving refund:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
