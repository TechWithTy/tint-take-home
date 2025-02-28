"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formSchema } from "../../../../types/zod/newQuote";

type FormData = z.infer<typeof formSchema>;

interface InsuranceFormModalProps {
    open: boolean;
    onClose: () => void;
}

const InsuranceForm: React.FC<InsuranceFormModalProps> = ({ open, onClose }) => {
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
    });

    const onSubmit = async (data: FormData) => {
        try {
            const response = await fetch("/api/insurance-quote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error("Network response was not ok");

            const result = await response.json();
            console.log("Quote Result:", result);
            onClose();
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="z-[9999] bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto text-center">
                <DialogHeader>
                    <DialogTitle>Insurance Quote Form</DialogTitle>
                    <DialogDescription>
                        Fill out the form below for a custom insurance quote.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {[
                            { id: "firstName", label: "First Name", type: "text" },
                            { id: "lastName", label: "Last Name", type: "text" },
                            { id: "email", label: "Email", type: "email" },
                            { id: "numberCars", label: "Number of Cars", type: "number" },
                            { id: "addressLine1", label: "Address Line 1", type: "text" },
                            { id: "addressLine2", label: "Address Line 2 (Optional)", type: "text" },
                            { id: "city", label: "City", type: "text" },
                            { id: "state", label: "State (e.g., IL)", type: "text" },
                            { id: "zip", label: "ZIP Code", type: "text" },
                        ].map(({ id, label, type }) => (
                            <FormField
                                key={id}
                                control={form.control}
                                name={id as keyof FormData}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{label}</FormLabel>
                                        <FormControl>
                                            <Input
                                                id={id}
                                                type={type}
                                                inputMode={type === "number" ? "numeric" : undefined}
                                                pattern={type === "number" ? "[0-9]*" : undefined}
                                                placeholder={label}
                                                {...field}
                                                onChange={(e) =>
                                                    type === "number"
                                                        ? field.onChange(Number(e.target.value) || "")
                                                        : field.onChange(e.target.value)
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}

                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={!form.formState.isValid || form.formState.isSubmitting}
                                className={`w-full text-white ${form.formState.isValid
                                    ? "bg-blue-600 hover:bg-blue-700"
                                    : "bg-gray-400 cursor-not-allowed"
                                    }`}
                            >
                                {form.formState.isSubmitting ? "Submitting..." : "Submit"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default InsuranceForm;
