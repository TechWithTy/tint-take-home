"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // or "next/router" for pages router

export default function Navbar() {
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const { update } = useSession();
    useEffect(() => {
        if (status === "loading") {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }
    }, [status]);

    return (
        <nav className="bg-white shadow-md p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl font-bold">MyApp</Link>

                <div>
                    {session ? (
                        <div className="flex items-center gap-4">
                            <span className="text-gray-700">{session.user?.email}</span>
                            <button
                                onClick={() =>
                                    signOut({ callbackUrl: "/login" }).then(() => update())
                                } className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-red-600"
                                disabled={isLoading}
                            >
                                {isLoading ? "Logging out..." : "Logout"}
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => signIn()}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                            disabled={isLoading}
                        >
                            {isLoading ? "Loading..." : "Login"}
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}
