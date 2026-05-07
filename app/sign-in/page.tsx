"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { Button } from "@/app/ui/button";
import { Input } from "@/app/ui/input";
import { Card, CardContent } from "@/app/ui/card";
import { Navbar } from "@/app/ui/Navbar";
import { LockClosedIcon, EnvelopeIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (result?.ok) {
      let session = await getSession();
      const maxRetries = 10;
      let retries = 0;
      while (!session && retries < maxRetries) {
        await new Promise((r) => setTimeout(r, 200));
        session = await getSession();
        retries++;
      }

      if (!session) {
        setError("Session load failed.");
        setIsLoading(false);
        return;
      }
       try {
  await fetch('/api/verification/update-activity', { method: 'POST' });
} catch (err) {
  console.warn('Failed to update user activity timestamp:', err);
}
      try {
        const res = await fetch("/api/verification/status");
        const data = await res.json();

        if (res.status === 404 || !data.hasApplied) {
          // Not applied
          router.push("/apply-verification");
        } else if (res.ok && data.applicationStatus === "APPROVED") {
          const role = session.user?.role?.toLowerCase() || "";
          router.push(`/dashboard/${role}`);
        } else {
          // PENDING or REJECTED
          router.push("/application-status");
        }
      } catch (err) {
        console.error("Verification check error:", err);
        setError("Something went wrong. Try again.");
      }
    } else {
      setError(result?.error || "Invalid credentials");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex items-center justify-center min-h-screen py-24 px-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-gray-200 mb-6">
              <LockClosedIcon className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">Welcome Back</span>
            </div>
            
            <h1 className="text-4xl font-light text-gray-900 mb-4">
              <span className="font-black">Sign In</span>
              <br />
              <span className="text-gray-500 text-2xl">to Your Account</span>
            </h1>
            
            <p className="text-gray-600">
              Enter your credentials to access the Ayush Samparkh platform
            </p>
          </div>

          {/* Login Form */}
          <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl overflow-hidden">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="pl-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="pl-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      placeholder="••••••••••••"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-gray-900 text-white hover:bg-gray-800 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRightIcon className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
              
              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600">
                  Don&apos;t have an account?{" "}
                  <Link 
                    href="/register" 
                    className="font-semibold text-gray-900 hover:text-gray-700 transition-colors"
                  >
                    Create Account
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
