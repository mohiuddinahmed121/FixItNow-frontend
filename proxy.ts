import { JwtPayload } from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { jwtUtils } from "./utils/jwt";

const AUTH_ROUTES = ["/login", "/register"];

const PUBLIC_ROUTES = ["/", "/services"];

export async function proxy(request: NextRequest) {
   const pathname = request.nextUrl.pathname;

   /*
    * IMPORTANT:
    * API routes must NEVER go through authentication
    * redirects or role-based authorization.
    *
    * /api/* is handled by:
    * app/api/[...path]/route.ts
    */
   if (pathname.startsWith("/api/")) {
      return NextResponse.next();
   }

   let accessToken = request.cookies.get("accessToken")?.value;
   const refreshToken = request.cookies.get("refreshToken")?.value;

   /*
    * Decode access token
    */
   let decodedAccessToken = accessToken
      ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string)
      : null;

   /*
    * Decode refresh token
    */
   const decodedRefreshToken = refreshToken
      ? jwtUtils.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET as string)
      : null;

   /*
    * Response object.
    *
    * If a new access token is generated,
    * we set it on this response.
    */
   const response = NextResponse.next();

   /*
    * ACCESS TOKEN EXPIRED
    * +
    * REFRESH TOKEN STILL VALID
    *
    * Generate a new access token.
    */
   if (!decodedAccessToken?.success && decodedRefreshToken?.success && refreshToken) {
      try {
         const refreshResponse = await fetch(
            `${process.env.BACKEND_API_URL}/api/auth/refresh-token`,
            {
               method: "POST",
               headers: {
                  Cookie: `refreshToken=${refreshToken}`,
               },
               cache: "no-store",
            },
         );

         const result = await refreshResponse.json();

         if (refreshResponse.ok && result.success && result.data?.accessToken) {
            const newAccessToken = result.data.accessToken;

            /*
             * Update local variable so the rest of
             * this proxy request uses the new token.
             */
            accessToken = newAccessToken;

            /*
             * Decode new access token
             */
            decodedAccessToken = jwtUtils.verifyToken(
               newAccessToken,
               process.env.JWT_ACCESS_SECRET as string,
            );

            /*
             * Save new access token in browser cookie.
             */
            response.cookies.set("accessToken", newAccessToken, {
               httpOnly: true,
               secure: process.env.NODE_ENV === "production",
               sameSite: "lax",
               maxAge: 60 * 60,
               path: "/",
            });
         }
      } catch (error) {
         console.error("Access token refresh failed:", error);

         decodedAccessToken = null;
      }
   }

   /*
    * ACCESS TOKEN INVALID / EXPIRED
    * +
    * REFRESH FAILED / EXPIRED
    *
    * Remove invalid access token.
    */
   if (!decodedAccessToken?.success) {
      response.cookies.delete("accessToken");

      accessToken = undefined;
   }

   /*
    * Get user role from access token
    */
   let userRole: string | null = null;

   if (decodedAccessToken?.success && decodedAccessToken.data) {
      userRole = (decodedAccessToken.data as JwtPayload).role as string;
   }

   /*
    * Logged-in user trying to access
    * Login / Register
    */
   if (accessToken && decodedAccessToken?.success && AUTH_ROUTES.includes(pathname)) {
      if (userRole === "CUSTOMER") {
         return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      if (userRole === "TECHNICIAN") {
         return NextResponse.redirect(new URL("/technician-dashboard", request.url));
      }

      if (userRole === "ADMIN") {
         return NextResponse.redirect(new URL("/admin-dashboard", request.url));
      }

      return NextResponse.redirect(new URL("/", request.url));
   }

   /*
    * Check public routes
    */
   const isPublicRoute = PUBLIC_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
   );

   /*
    * Check authentication routes
    */
   const isAuthRoute = AUTH_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
   );

   /*
    * Protected route
    *
    * If user has no valid access token
    * and route is not public/auth,
    * redirect to login.
    */
   if (!accessToken && !isPublicRoute && !isAuthRoute) {
      const loginUrl = new URL("/login", request.url);

      loginUrl.searchParams.set("redirectTo", pathname);

      return NextResponse.redirect(loginUrl);
   }

   /*
    * CUSTOMER authorization
    */
   if (pathname.startsWith("/dashboard") && userRole !== "CUSTOMER") {
      return NextResponse.redirect(new URL("/not-found", request.url));
   }

   /*
    * TECHNICIAN authorization
    */
   if (pathname.startsWith("/technician-dashboard") && userRole !== "TECHNICIAN") {
      return NextResponse.redirect(new URL("/not-found", request.url));
   }

   /*
    * ADMIN authorization
    */
   if (pathname.startsWith("/admin-dashboard") && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/not-found", request.url));
   }

   /*
    * Continue request
    */
   return response;
}

/*
 * Run proxy for normal application pages.
 *
 * API routes are still matched here, but the first
 * condition inside proxy() immediately bypasses them.
 */
export const config = {
   matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)"],
};
