import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { dbClient } from "@/db/dbClient";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        // ✅ Check if email is already registered
        const existingUser = await dbClient.select().from(users).where(eq(users.email, email)).limit(1);
        if (existingUser.length) {
            return NextResponse.json({ error: "Email already in use" }, { status: 400 });
        }

        // ✅ Hash the password securely before storing
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // ✅ Insert user into the database
        const [newUser] = await dbClient.insert(users).values({
            name,
            email,
            passwordHash, // ✅ Store the hashed password
        }).returning();

        return NextResponse.json({ success: true, user: newUser });
    } catch (error) {
        console.error("🚨 Registration Error:", error);
        return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
    }
}
