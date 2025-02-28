'use server';

import { UnderwritingDetails } from '@/db/schema/underwritingDetails';
import { dbClient, schema } from '../../../db/dbClient';
import { QuoteFormValues } from "./QuoteForm";
import { redirect } from 'next/navigation';
import logger from '@/logger';
import { Quote } from '@/db/schema/quotes';

const calculatePremium = (underwritingDetails: UnderwritingDetails) => +underwritingDetails.numberCars * 50;
const calculateLimit = (underwritingDetails: UnderwritingDetails) => Math.min(+underwritingDetails.numberCars * 10000, 1e6);
const calculateDeductible = () => 5000;

export async function createQuote(formData: QuoteFormValues) {
    let quote: Quote; // ✅ Declared once, to be used inside try block

    try {
        const [underwritingDetails] = await dbClient.insert(schema.underwritingDetails).values({
            firstName: formData.firstName,
            lastName: formData.lastName,
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            email: formData.email,
            numberCars: formData.numberCars
        }).returning();

        // ✅ Assigning to the existing `quote` variable
        [quote] = await dbClient.insert(schema.quotes).values({
            underwritingDetailsId: underwritingDetails.id, // Ensure this is a valid UUID, not an object
            userId: underwritingDetails.userId, // ✅ Ensure this field is included
            userEmail: underwritingDetails.email, // ✅ Ensure this field is included
            premium: calculatePremium(underwritingDetails),
            limit: calculateLimit(underwritingDetails),
            deductible: calculateDeductible(),
        }).returning();
    } catch (error) {
        logger.error({ event: 'QUOTE:CREATED:ERROR', message: (error as Error).message });
        throw error;
    }

    logger.info({ event: 'QUOTE:CREATED', quoteId: quote.id }); // ✅ Now `quote` is accessible

    return redirect(`/quotes/${quote.id}/payment`);
}
