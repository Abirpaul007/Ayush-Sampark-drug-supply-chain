// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes: Record<string, string[]> = {
  "/admin": ["ADMIN"],
  "/hospital": ["HOSPITAL_STAFF"],
  "/pharmacy": ["PHARMACY_STAFF"],
  "/vendor": ["VENDOR"],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const path = request.nextUrl.pathname;

  // 1️⃣ Protect dashboard routes
  const matchedProtectedRoute = Object.keys(protectedRoutes).find((route) =>
    path.startsWith(route)
  );

  if (matchedProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    const allowedRoles = protectedRoutes[matchedProtectedRoute];
    if (
      !token.role || !allowedRoles.includes(token.role) ||
      token.applicationStatus !== "APPROVED"
    ) {
      return NextResponse.redirect(new URL("/application-status", request.url));
    }
  }

  if(path === "/profile"){
    if(!token){
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  // 2️⃣ /apply-verification: only for users who haven't applied
  if (path === "/apply-verification") {
    if (!token) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    if (token.applicationStatus === "APPROVED") {
      const role = token.role?.toLowerCase() || "";
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
    }

    if (token.applicationStatus === "PENDING" || token.applicationStatus === "REJECTED") {
      return NextResponse.redirect(new URL("/application-status", request.url));
    }
  }

  // 3️⃣ /application-status: only for users who have applied
  if (path === "/application-status") {
    if (!token) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    if (token.applicationStatus ==="PENDING" || token.applicationStatus === "REJECTED") {
      return NextResponse.redirect(new URL("/apply-verification", request.url));
    }else if(token.applicationStatus ==="APPROVED"){
      const role = token.role?.toLowerCase() || "";
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
    }
  }

  // 4️⃣ Prevent /sign-in if already logged in
  if (path === "/sign-in" && token) {
    const redirectPath =
      token.applicationStatus === "APPROVED"
        ? `/dashboard/${token.role?.toLowerCase()}`
        : token.applicationStatus
        ? "/application-status"
        : "/apply-verification";
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // 5️⃣ OTP verification cookie route
  const verifyOtpMatch = path.match(/^\/verify-otp\/([^/]+)$/);
 if (verifyOtpMatch) {
    const justRegistered = request.cookies.get("just-registered")?.value;

    const emailInPath = verifyOtpMatch[1];
    const decodedemailInPath = decodeURIComponent(emailInPath);

    if (!justRegistered || justRegistered !== decodedemailInPath) {
      return NextResponse.redirect(new URL("/register", request.url));
    }

    const response = NextResponse.next();
    // response.cookies.delete("just-registered");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/hospital/:path*",
    "/pharmacy/:path*",
    "/vendor/:path*",
    "/apply-verification/:path*",
    // "/application-status/:path*",
    "/verify-otp/:path*",
    "/sign-in",
    "/profile",
  ],
};