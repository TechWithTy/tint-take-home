"use client";

import {  useSession } from "next-auth/react";
import PoliciesList from "../components/policies/policiesList";
import AdminPoliciesList from "../components/policies/adminPoliciesList";

export default function PoliciesPage() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <p className="text-center text-gray-500">Loading...</p>;
    }

    const userEmail = session?.user?.email;

    return (

        <div className="min-h-screen bg-gray-100 py-10">
            {userEmail === "admin@example.com" ? <AdminPoliciesList /> : <PoliciesList />}
        </div>

    );
}
