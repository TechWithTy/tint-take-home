import { mockAdminUser, mockNonAdminUser } from "@/app/_data/mockUser";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        let user = null;

        switch (true) {
          case credentials.email === "admin@example.com" && credentials.password === "password":
            user = { ...mockAdminUser, isAdmin: true }; // ✅ Ensure isAdmin is included
            break;

          case credentials.email === "user@example.com" && credentials.password === "password":
            user = { ...mockNonAdminUser, isAdmin: false }; // ✅ Ensure non-admin users have isAdmin: false
            break;

          default:
            return null;
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin ?? false; // ✅ Ensure isAdmin is always a boolean
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string || "", // ✅ Ensure id is always a string
        name: session.user.name,
        email: session.user.email,
        isAdmin: token.isAdmin as boolean ?? false, // ✅ Ensure isAdmin is always a boolean
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
