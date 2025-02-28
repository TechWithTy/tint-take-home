import { faker } from "@faker-js/faker"; // ✅ Import Faker.js
import { formSchema } from "../../../../types/zod/newQuote";
import { z } from "zod";

type FormData = z.infer<typeof formSchema>;
export const mockOpenAiApiCall = (data: FormData) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: faker.string.uuid(), // ✅ Generate a fake UUID
                userId: faker.string.uuid(), // ✅ Fake user ID
                userEmail: faker.internet.email(), // ✅ Fake email
                premium: faker.number.int({ min: 100, max: 5000 }), // ✅ Random premium
                limit: faker.number.int({ min: 10000, max: 1000000 }), // ✅ Random limit
                deductible: faker.number.int({ min: 500, max: 5000 }), // ✅ Random deductible
                underwritingDetailsId: faker.string.uuid(), // ✅ Fake underwriting details ID
                createdAt: faker.date.past().toISOString(), // ✅ Fake created date
                updatedAt: faker.date.recent().toISOString(), // ✅ Fake updated date
            });
        }, 1000); // Simulated network delay
    });
};
