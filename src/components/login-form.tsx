"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");


  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      email: email.trim(),
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      // Redirect based on admin status
      if (email === "admin@example.com") {
        router.push("/policies");
      } else {
        router.push("/payment");
      }
    }
  }

  return (
    <div className={cn("flex flex-col items-center justify-center min-h-screen text-white", className)} {...props}>
      <Card className="bg-gray-800 border border-gray-700 shadow-lg w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-white text-center text-2xl">Login</CardTitle>
          <CardDescription className="text-gray-400 text-center">
            DEMO:
            <br />
            <span className="text-sm text-gray-500">
              Admin: admin@example.com <br />
              User: user@example.com <br />
              <small>both</small> Password : password
            </span>
          </CardDescription>

        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => {
                    const newValue = e.target.value.replace(/\s/g, ""); // Prevent spaces
                    if (newValue !== e.target.value) return; // Ignore space key presses
                    setEmail(newValue);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === " ") e.preventDefault(); // Block space key
                  }}
                  className="bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                />

              </div>
              <div className="grid gap-3">
                {/* <div className="flex items-center">
                  <Label htmlFor="password" className="text-gray-300">Password</Label>
                  <a href="#" className="ml-auto text-sm text-blue-400 hover:text-blue-300 transition">
                    Forgot password?
                  </a>
                </div> */}
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 transition duration-300 cursor-pointer"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
                {/* <Button
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:border-blue-500 hover:text-white transition duration-300 cursor-pointer"
                  onClick={() => router.push("/signup")}
                >
                  Sign Up
                </Button> */}
              </div>
            </div>
            {/* <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/signup" className="text-blue-400 hover:text-blue-300 transition">
                Sign up
              </a>
            </div> */}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
