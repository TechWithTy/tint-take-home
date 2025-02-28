import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { dbClient } from "@/db/dbClient";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        // ✅ Check if the user exists
        const [user] = await dbClient.select().from(users).where(eq(users.email, email)).limit(1);
        if (!user) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        // ✅ Compare entered password with stored hashed password
        const passwordMatch = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatch) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        return NextResponse.json({ success: true, message: "Login successful", userId: user.id });
    } catch (error) {
        console.error("🚨 Login Error:", error);
        return NextResponse.json({ error: "Failed to login" }, { status: 500 });
    }
}
