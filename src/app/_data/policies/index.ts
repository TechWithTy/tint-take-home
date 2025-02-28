import { faker } from "@faker-js/faker";
import { Policy, policies } from "@/db/schema/policies";
import { quotes } from "@/db/schema/quotes";
import { users } from "@/db/schema/users";
import { dbClient } from "@/db/dbClient";


export function generateLocalMockPolicies(count = 5): Policy[] {
    const statuses = ["pending", "approved", "denied"];

    return Array.from({ length: count }, () => ({
        id: faker.string.uuid(),
        quoteId: faker.string.uuid(),
        userId: faker.string.uuid(),
        amount: faker.number.int({ min: 100, max: 5000 }),
        requestedRefund: faker.datatype.boolean(),
        status: faker.helpers.arrayElement(statuses), // ✅ Random status
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
    }));
}
