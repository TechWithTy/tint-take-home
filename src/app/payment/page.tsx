"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { Quote } from "@/db/schema/quotes";
import { QuoteCard } from "../components/quote/quoteCard";
import { dynamicMockQuotes } from "../_data/quote/dynamicMockQuotes";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import InsuranceFormModal from "../components/quote/newQuoteModal";

export default function QuotesPage() {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ deductible: "", limit: "" });
    const [sortBy, setSortBy] = useState<keyof Quote | "">("");
    const [currentPage, setCurrentPage] = useState(1);
    const [open, setOpen] = useState(false);
    const quotesPerPage = 5;
    const router = useRouter();

    // Load quotes dynamically
    // Load quotes dynamically
    useEffect(() => {
        async function fetchQuotes() {
            setLoading(true);
            try {
                const res = await fetch("/api/quotes"); // Fetch quotes from the database
                const data = await res.json();

                if (data.length > 0) {
                    setQuotes(data); // Use database quotes if available
                } else {
                    setQuotes(dynamicMockQuotes); // Use mock data if no quotes exist
                }
            } catch (error) {
                console.error("Error fetching quotes:", error);
                setQuotes(dynamicMockQuotes); // Fallback in case of an error
            } finally {
                setLoading(false);
            }
        }

        fetchQuotes();
    }, []);


    // Apply filters
    const filteredQuotes = useMemo(() => {
        return quotes.filter((quote) => {
            return (
                (filter.deductible ? quote.deductible !== null && quote.deductible <= Number(filter.deductible) : true) &&
                (filter.limit ? quote.limit !== null && quote.limit <= Number(filter.limit) : true)
            );
        });
    }, [quotes, filter]);



    // Apply sorting
    const sortedQuotes = useMemo(() => {
        return [...filteredQuotes].sort((a, b) => {
            if (!sortBy) return 0;

            const valueA = a[sortBy as keyof Quote];
            const valueB = b[sortBy as keyof Quote];

            if (typeof valueA === "number" && typeof valueB === "number") {
                return valueA - valueB;
            }

            return 0;
        });
    }, [filteredQuotes, sortBy]);

    // Paginate results
    const totalPages = Math.ceil(sortedQuotes.length / quotesPerPage);
    const paginatedQuotes = useMemo(() => {
        const startIndex = (currentPage - 1) * quotesPerPage;
        return sortedQuotes.slice(startIndex, startIndex + quotesPerPage);
    }, [currentPage, sortedQuotes]);

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center">Insurance Quotes</h1>
            <div className="container mx-auto p-6">

                {/* Centered Get Invoice Button */}
                <div className="flex justify-center my-6">
                    <Button className="cursor-pointer" onClick={() => setOpen(true)} variant="default">
                        Get Insurance Quote
                    </Button>
                    {open && <InsuranceFormModal open={open} onClose={() => setOpen(false)} />}

                </div>
            </div>

            {/* Filters & Sorting */}
            <div className="mb-4 flex gap-4">

                <Input
                    type="number"
                    placeholder="Filter by Deductible"
                    value={filter.deductible}
                    onChange={(e) => setFilter((prev) => ({ ...prev, deductible: e.target.value }))}
                    className="dark:bg-gray-900 dark:text-white"
                />
                <Input
                    type="number"
                    placeholder="Filter by Limit"
                    value={filter.limit}
                    onChange={(e) => setFilter((prev) => ({ ...prev, limit: e.target.value }))}
                    className="dark:bg-gray-900 dark:text-white"
                />
                <Select onValueChange={(value) => setSortBy(value as keyof Quote)}>
                    <SelectTrigger className="dark:bg-gray-900 dark:text-white">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:text-white">
                        <SelectItem value="deductible">Deductible</SelectItem>
                        <SelectItem value="limit">Limit</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Loading State */}
            {loading ? (
                <p className="text-center">Loading quotes...</p>
            ) : sortedQuotes.length === 0 ? (
                <p>No quotes available.</p>
            ) : (
                <div className="grid gap-4">
                    {paginatedQuotes.map((quote) => (
                        <QuoteCard key={quote.id} quote={quote} />
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            <div className="flex justify-center mt-4 gap-2">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="p-2 border rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="p-2 border rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
