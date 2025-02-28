import { z } from "zod";

export const formSchema = z.object({
    firstName: z.string().min(1, "First Name is required").regex(/^[a-zA-Z]+$/, "Only letters allowed."),
    lastName: z.string().min(1, "Last Name is required").regex(/^[a-zA-Z]+$/, "Only letters allowed."),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    numberCars: z.number().min(1, "Must have at least 1 car"),
    addressLine1: z.string().min(1, "Address is required"),
    addressLine2: z.string().optional(), // Optional field
    city: z.string().min(1, "City is required").regex(/^[a-zA-Z\s]+$/, "Only letters and spaces allowed."),
    state: z.string().min(2, "State is required").max(2, "Use state abbreviation").regex(/^[A-Z]{2}$/, "Use uppercase two-letter state code."),
    zip: z.string().min(5, "ZIP Code must be 5 digits").max(5, "ZIP Code must be 5 digits").regex(/^\d{5}$/, "ZIP Code must be numeric."),
});
