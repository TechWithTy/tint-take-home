"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Policy } from "@/db/schema/policies";


export default function PoliciesList() {
    const [policies, setPolicies] = useState<Policy[]>([]);

    useEffect(() => {
        async function fetchPolicies() {
            try {
                const res = await fetch("/api/policies");
                const data = await res.json();
                setPolicies(Array.isArray(data.policies) ? data.policies : []); // Ensure it's always an array
            } catch (error) {
                console.error("Error fetching policies:", error);
                setPolicies([]); // Fallback to an empty array on error
            }
        }
        fetchPolicies();
    }, []);


    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold text-center mb-6">📜 My Policies</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {policies.length > 0 ? (
                    policies.map((policy) => (
                        <Card key={policy.id} className="hover:shadow-xl transition">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">Policy ID: {policy.id}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700">Quote ID: <span className="font-medium">{policy.quoteId}</span></p>
                                <p className="text-gray-700">User ID: <span className="font-medium">{policy.userId}</span></p>
                                <p className="text-gray-700">Amount: <span className="font-medium">${policy.amount}</span></p>
                                <p className="text-gray-500 text-sm">Issued: {policy.createdAt!.toLocaleDateString()}</p>
                                <Button className="mt-4 w-full" variant="outline">View Details</Button>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No policies found.</p>
                )}
            </div>
        </div>
    );
}
