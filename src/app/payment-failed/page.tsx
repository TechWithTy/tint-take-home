"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function PaymentFailed() {
    const router = useRouter();

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
                <Alert variant="destructive">
                    <AlertTitle>🚨 Payment Failed</AlertTitle>
                    <AlertDescription>
                        Oops! Something went wrong with your payment. Please try again or contact support.
                    </AlertDescription>
                </Alert>

                <div className="mt-6 space-y-4">
                   
                    <Button className="w-full" variant="outline" onClick={() => router.push("/")}>
                        Go Home
                    </Button>
                </div>
            </div>
        </div>
    );
}
