import Stripe from "stripe";
import { NextResponse } from "next/server";
import { dbClient } from "@/db/dbClient";
import { policies } from "@/db/schema/policies";
import axios from "axios"; // Required for sending alerts to Datadog

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-02-24.acacia",
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
// const DATADOG_API_KEY = process.env.DATADOG_API_KEY; // Ensure you have the Datadog API key

if (!BASE_URL) { // add datadog api key: ||  !DATADOG_API_KEY
  console.error("🚨 Missing environment variables data dog and base url");
  throw new Error("Missing required environment variables. Check your .env file.");
}

// Send an alert to Datadog in case of a payment failure
// async function sendDatadogAlert(message: string) {
//   try {
//     const response = await axios.post(
//       "https://api.datadoghq.com/api/v1/events",
//       {
//         title: "Payment Failure Alert",
//         text: message,
//         tags: ["payment", "failure", "stripe"],
//         alert_type: "error",
//       },
//       {
//         headers: {
//           "DD-API-KEY": DATADOG_API_KEY,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     console.log("Datadog alert sent:", response.data);
//   } catch (error) {
//     console.error("🚨 Error sending Datadog alert:", error);
//   }
// }

export async function POST(req: Request) {
  try {
    const { quoteId, userId, amount } = await req.json();

    if (!quoteId || !userId || !amount) {
      console.error("❌ Missing required parameters:", { quoteId, userId, amount });
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Insurance Premium" },
            unit_amount: amount * 100, // Convert dollars to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${BASE_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/payment-failed`,
      metadata: {
        quoteId: quoteId.toString(),
        userId: userId.toString(),
        amount: amount.toString(),
      },
    });

    console.log("✅ Checkout session created with URL:", session.url);

    // Simulate webhook handling for payment failure detection
    // (In a real implementation, this would be in your webhook endpoint)
    if (session.payment_status === 'unpaid') {
      const failureMessage = `Payment failed for user ${userId} on quote ${quoteId}. Amount: $${amount}`;
      console.log(failureMessage);
      // Send alert to Datadog
      // await sendDatadogAlert(failureMessage);
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("🚨 Checkout API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
