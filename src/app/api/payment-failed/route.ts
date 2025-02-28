import { NextResponse } from "next/server";
import axios from "axios";

const DATADOG_API_KEY = process.env.DATADOG_API_KEY; // Ensure this is set in .env

export async function POST(req: Request) {
    try {
        const { userId, quoteId, amount } = await req.json();

        console.log(`🚨 Payment failed for user ${userId} on quote ${quoteId}. Amount: $${amount}`);

        // ✅ Send alert to Datadog
        const datadogEvent = {
            title: "Payment Failed Alert",
            text: `🚨 Payment failed for user **${userId}** on quote **${quoteId}**. Amount: **$${amount}**`,
            alert_type: "error",
            source_type_name: "custom",
        };

        await axios.post(`https://api.datadoghq.com/api/v1/events?api_key=${DATADOG_API_KEY}`, datadogEvent, {
            headers: { "Content-Type": "application/json" },
        });

        return NextResponse.json({ success: true, message: "Datadog alert sent." });
    } catch (error) {
        console.error("🚨 Error sending alert:", error);
        return NextResponse.json({ error: "Failed to send Datadog alert" }, { status: 500 });
    }
}
