import { JwtPayload } from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { jwtUtils } from "./utils/jwt";

const AUTH_ROUTES = ["/login", "/register"];

const PUBLIC_ROUTES = ["/", "/services"];

export async function proxy(request: NextRequest) {
   const pathname = request.nextUrl.pathname;

   let accessToken = request.cookies.get("accessToken")?.value;
   const refreshToken = request.cookies.get("refreshToken")?.value;

   let decodedAccessToken = accessToken
      ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string)
      : null;

   const decodedRefreshToken = refreshToken
      ? jwtUtils.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET as string)
      : null;

   const response = NextResponse.next();

   if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
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

            accessToken = newAccessToken;

            decodedAccessToken = jwtUtils.verifyToken(
               newAccessToken,
               process.env.JWT_ACCESS_SECRET as string,
            );

            response.cookies.set("accessToken", newAccessToken, {
               httpOnly: true,
               secure: process.env.NODE_ENV === "production",
               sameSite: "lax",
               maxAge: 60 * 60,
               path: "/",
            });
         }
      } catch {
         decodedAccessToken = null;
      }
   }

   if (!decodedAccessToken?.success) {
      response.cookies.delete("accessToken");

      accessToken = undefined;
   }

   let userRole: string | null = null;

   if (decodedAccessToken?.success && decodedAccessToken.data) {
      userRole = (decodedAccessToken.data as JwtPayload).role as string;
   }

   if (accessToken && AUTH_ROUTES.includes(pathname)) {
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

   const isPublicRoute = PUBLIC_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
   );

   const isAuthRoute = AUTH_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
   );

   if (!accessToken && !isPublicRoute && !isAuthRoute) {
      const loginUrl = new URL("/login", request.url);

      loginUrl.searchParams.set("redirectTo", pathname);

      return NextResponse.redirect(loginUrl);
   }

   if (pathname.startsWith("/dashboard") && userRole !== "CUSTOMER") {
      return NextResponse.redirect(new URL("/not-found", request.url));
   }

   if (pathname.startsWith("/technician-dashboard") && userRole !== "TECHNICIAN") {
      return NextResponse.redirect(new URL("/not-found", request.url));
   }

   if (pathname.startsWith("/admin-dashboard") && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/not-found", request.url));
   }

   return response;
}

export const config = {
   matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)"],
};
