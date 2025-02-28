"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { Shield, Check, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { Quote } from "@/db/schema/quotes";

interface QuoteCardProps {
    quote: Quote;
}

export function QuoteCard({ quote }: QuoteCardProps) {
    const [loading, setLoading] = useState(false);

    const handlePurchase = async () => {
        setLoading(true);

        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    quoteId: quote.id,
                    userId: quote.userId,
                    amount: quote.premium, // Ensure amount is sent correctly
                }),
            });

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url; // ✅ Redirect to Stripe Checkout
            } else {
                console.error("Error: No checkout URL returned");
                setLoading(false);
            }
        } catch (error) {
            console.error("🚨 Error during checkout:", error);
            setLoading(false);
        }
    };

    const formattedDate = quote.createdAt
        ? new Date(quote.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
          })
        : "N/A";

    return (
        <Card className="w-full transition-all duration-200 border-muted-foreground/20 shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary/10 p-2 rounded-full">
                            <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-xl">Insurance Quote</CardTitle>
                    </div>
                </div>
                <CardDescription>
                    Quote ID: {quote.id.substring(0, 8)}... • Created {formattedDate}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 gap-4 my-4">
                    <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground mb-1">Premium</span>
                        <span className="text-2xl font-bold">{formatCurrency(quote.premium || 0)}</span>
                    </div>
                    <div className="flex flex-col">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="text-sm text-muted-foreground mb-1 flex items-center gap-1 cursor-help">Limit</span>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="w-[200px] text-xs">The maximum amount the insurance company will pay for covered losses</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <span className="text-2xl font-bold">{formatCurrency(quote.limit || 0)}</span>
                    </div>
                    <div className="flex flex-col">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="text-sm text-muted-foreground mb-1 flex items-center gap-1 cursor-help">
                                        Deductible
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="w-[200px] text-xs">The amount you pay out of pocket before insurance coverage kicks in</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <span className="text-2xl font-bold">{formatCurrency(quote.deductible || 0)}</span>
                    </div>
                </div>

                <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Comprehensive coverage included</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">24/7 customer support</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Fast claims processing</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-center">
                <Button
                    className="gap-1 cursor-pointer bg-green-600 hover:bg-green-700 text-white"
                    onClick={handlePurchase}
                    disabled={loading}
                >
                    {loading ? "Processing..." : "Purchase Quote"}
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}
