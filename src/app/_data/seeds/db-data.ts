import { dbClient } from "@/db/dbClient";
import { users } from "@/db/schema/users";
import { quotes } from "@/db/schema/quotes";
import { policies } from "@/db/schema/policies";
import { underwritingDetails } from "@/db/schema/underwritingDetails";
import { v4 as uuidv4 } from "uuid";
import { insuranceInputs } from "@/db/schema/insuranceInput";

async function seedDatabase() {
    console.log("🌱 Seeding Database...");

    // ✅ Insert mock users
    const [user] = await dbClient
        .insert(users)
        .values({
            id: uuidv4(),
            name: "John Doe",
            email: "john.doe@example.com",
        })
        .returning();

    console.log("✅ Inserted User:", user);

    // ✅ Insert underwriting details
    const [underwritingDetail] = await dbClient
        .insert(underwritingDetails)
        .values({
            id: uuidv4(),
            firstName: "John",
            lastName: "Doe",
            email: user.email,
            numberCars: 2,
            addressLine1: "123 Main St",
            city: "New York",
            state: "NY",
            zip: "10001",
        })
        .returning();

    console.log("✅ Inserted Underwriting Detail:", underwritingDetail);

    // ✅ Insert a quote
    const [quote] = await dbClient
        .insert(quotes)
        .values({
            id: uuidv4(),
            userId: user.id,
            userEmail: user.email,
            premium: 1000,
            limit: 500000,
            deductible: 2000,
            underwritingDetailsId: underwritingDetail.id,
        })
        .returning();

    console.log("✅ Inserted Quote:", quote);

    // ✅ Insert a policy
    const [policy] = await dbClient
        .insert(policies)
        .values({
            id: uuidv4(),
            quoteId: quote.id,
            userId: user.id,
            amount: 5000,
        })
        .returning();

    console.log("✅ Inserted Policy:", policy);

    // // ✅ Insert insurance inputs
    // const [insurance] = await dbClient
    //     .insert(insuranceInputs)
    //     .values({
    //         userId: user.id,
    //         businessName: "Acme Corp",
    //         industry: "Tech",
    //         revenue: 1000000,
    //         numEmployees: 50,
    //         coverageAmount: 500000,
    //         deductible: 10000,
    //         businessLocation: "New York",
    //         riskProfile: "Medium",
    //         previousClaims: [],
    //         saasBusiness: true,
    //         hasCyberSecurityMeasures: true,
    //         additionalCoverage: ["IP Protection", "Cybersecurity"],
    //         duration: 12,
    //         paymentPreference: "Yearly",
    //     })
    //     .returning();

    // console.log("✅ Inserted Insurance Input:", insurance);

    console.log("🎉 Seeding Complete!");
}

seedDatabase()
    .catch((err) => console.error("🚨 Seeding Failed:", err))
    .finally(() => process.exit());
