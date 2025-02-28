import NextAuth from "next-auth";

declare module "next-auth" {
    interface User {
        id: string;
        name: string;
        email: string;
        isAdmin: boolean;  // ✅ Ensure isAdmin exists in User type
    }

    interface Session {
        user: User;
    }

    interface JWT {
        id: string;
        isAdmin: boolean;  // ✅ Ensure isAdmin exists in JWT type
    }
}
