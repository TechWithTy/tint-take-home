"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generateLocalMockPolicies } from "@/app/_data/policies";

type Policy = ReturnType<typeof generateLocalMockPolicies>[0]; // ✅ Infers type from mock data

export default function AdminPoliciesList() {
    const [policies, setPolicies] = useState<Policy[]>(generateLocalMockPolicies(5)); // ✅ Set default to mock data

    useEffect(() => {
        async function fetchPolicies() {
            try {
                const res = await fetch("/api/adminPolicies");
                const data = await res.json();

                if (data.policies && data.policies.length > 0) {
                    setPolicies(
                        data.policies
                            .filter((policy: any) => policy.requestedRefund) // ✅ Only show policies with refund requests
                            .map((policy: any) => ({
                                ...policy,
                                createdAt: policy.createdAt ? new Date(policy.createdAt) : new Date(),
                                updatedAt: policy.updatedAt ? new Date(policy.updatedAt) : new Date(),
                            }))
                    ); // ✅ Convert timestamps properly
                }
            } catch (error) {
                console.error("❌ Error fetching policies:", error);
            }
        }

        fetchPolicies();
    }, []);

    async function approveRefund(policy: Policy) {
        try {
            const res = await fetch("/api/refunds/approveRefund", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    policyId: policy.id,
                    amount: policy.amount,
                    reason: "Admin approved refund",
                }),
            });
            const data = await res.json();
            if (data.success) {
                setPolicies((prev) => prev.filter((p) => p.id !== policy.id)); // ✅ Remove approved refund from list
            } else {
                console.error("Refund approval failed:", data.error);
            }
        } catch (error) {
            console.error("❌ Error approving refund:", error);
        }
    }

    async function denyRefund(policyId: string) {
        try {
            const res = await fetch("/api/refunds/denyRefund", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ policyId }),
            });

            const data = await res.json();
            if (data.success) {
                setPolicies((prev) => prev.filter((p) => p.id !== policyId)); // ✅ Remove denied refund from list
            } else {
                console.error("Refund denial failed:", data.error);
            }
        } catch (error) {
            console.error("❌ Error denying refund:", error);
        }
    }

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold text-center mb-6">🔧 Admin: Refund Requests</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {policies.length > 0 ? (
                    policies.map((policy) => (
                        <Card key={policy.id} className="hover:shadow-xl transition border-red-500">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">
                                    Policy ID: {policy.id}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700">
                                    Quote ID: <span className="font-medium">{policy.quoteId}</span>
                                </p>
                                <p className="text-gray-700">
                                    User ID: <span className="font-medium">{policy.userId}</span>
                                </p>
                                <p className="text-gray-700">
                                    Amount: <span className="font-medium">${policy.amount}</span>
                                </p>
                                <p className="text-gray-500 text-sm">
                                    Issued: {policy.createdAt!.toLocaleDateString()}
                                </p>

                                <div className="mt-4">
                                    <p className="text-red-600 font-semibold">Refund Requested!</p>
                                    <div className="flex gap-2 mt-2">
                                        <Button
                                            onClick={() => approveRefund(policy)}
                                            variant="outline"
                                            disabled={policy.status === "approved"}
                                            className="cursor-pointer"
                                        >
                                            ✅ Approve
                                        </Button>
                                        <Button
                                            onClick={() => denyRefund(policy.id)}
                                            variant="destructive"
                                            disabled={policy.status === "denied"}
                                            className="cursor-pointer"

                                        >
                                            ❌ Deny
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No refund requests found.</p>
                )}
            </div>
        </div>
    );
}
