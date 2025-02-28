import { v4 as uuidv4 } from "uuid";
import { Quote } from "@/db/schema/quotes";
import { uuid } from "drizzle-orm/pg-core";
import { faker } from "@faker-js/faker";

export const mockQuotes: Quote[] = [
    {
        id: uuidv4(),
        userId: uuidv4(),
        userEmail: faker.internet.email(),
        premium: 500,
        limit: 10000,
        deductible: 1000,
        underwritingDetailsId: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: uuidv4(),
        userId: uuidv4(),
        userEmail: faker.internet.email(),

        premium: 750,
        limit: 15000,
        deductible: 2000,
        underwritingDetailsId: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: uuidv4(),
        userId: uuidv4(),
        userEmail: faker.internet.email(),

        premium: 1200,
        limit: 20000,
        deductible: 3000,
        underwritingDetailsId: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

export default mockQuotes;
