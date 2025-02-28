import { Quote } from '@/db/schema/quotes';
import { faker } from '@faker-js/faker';
import { uuid } from 'drizzle-orm/pg-core';
import { v4 as uuidv4 } from 'uuid';


export const dynamicMockQuotes: Quote[] = Array.from({ length: 100 }, () => ({
    id: uuidv4(),
    userId: uuidv4(),
    userEmail: faker.internet.email(),

    premium: faker.number.int({ min: 100, max: 5000 }), // Random premium between 100 and 5000
    limit: faker.number.int({ min: 5000, max: 50000 }), // Random limit between 5000 and 50000
    deductible: faker.number.int({ min: 500, max: 5000 }), // Random deductible between 500 and 5000
    underwritingDetailsId: uuidv4(),
    createdAt: faker.date.past(), // Random past date
    updatedAt: faker.date.recent(), // Random recent date
}));
