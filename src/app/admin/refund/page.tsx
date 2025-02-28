"use client";

import { useState } from "react";

export default function RefundPage() {
    const [paymentId, setPaymentId] = useState("");

    async function handleRefund() {
        await fetch("/api/refund", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentIntentId: paymentId }),
        });
        alert("Refund successful!");
    }

    return (
        <div className="p-6">
            <input
                type="text"
                placeholder="Enter Payment ID"
                value={paymentId}
                onChange={(e) => setPaymentId(e.target.value)}
                className="border p-2 rounded"
            />
            <button onClick={handleRefund} className="ml-2 bg-red-500 text-white px-4 py-2 rounded">
                Process Refund
            </button>
        </div>
    );
}
