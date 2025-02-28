import logger from "@/logger";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const time = Date.now();

    logger.info({ event: "REQUEST", url: request.url });

    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    // Restrict /payments route to non-admin users only
    if (request.nextUrl.pathname.startsWith("/payments")) {
        if (token?.isAdmin) {
            logger.warn({ event: "BLOCKED", user: token.email, reason: "Admin tried to access /payments" });
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    const response = NextResponse.next();

    logger.info({
        event: "RESPONSE",
        responseCode: response.status,
        durationMs: Date.now() - time
    });

    return response;
}

// Apply middleware to all routes except Next.js assets
export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|robots.txt|images|$).*)",
    ],
};
