"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type LoginState = {
   success: boolean;
   statusCode: number;
   message: string;
   data?: {
      accessToken: string;
      user: {
         id: string;
         name: string;
         email: string;
         role: "CUSTOMER" | "TECHNICIAN" | "ADMIN";
      };
   };
} | null;

export const loginAction = async (
   redirectTo: string,
   prevState: LoginState,
   formData: FormData,
) => {
   const email = formData.get("email");
   const password = formData.get("password");

   const payload = {
      email,
      password,
   };

   const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
   });

   const result = await res.json();

   if (!result.success) {
      return result;
   }

   const cookieStore = await cookies();

   // Access token
   cookieStore.set("accessToken", result.data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60, // 1 hour
      path: "/",
   });

   /*
    * Backend sets refreshToken as an HTTP-only cookie.
    * Since this request is made from the Next.js server,
    * we need to forward that Set-Cookie value to the
    * browser-side Next.js cookie.
    */
   const setCookie = res.headers.get("set-cookie");

   if (setCookie) {
      const refreshTokenMatch = setCookie.match(/refreshToken=([^;]+)/);

      if (refreshTokenMatch) {
         cookieStore.set("refreshToken", refreshTokenMatch[1], {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
         });
      }
   }

   // Redirect if redirectTo exists
   if (
      redirectTo &&
      typeof redirectTo === "string" &&
      redirectTo.startsWith("/") &&
      !redirectTo.startsWith("//")
   ) {
      redirect(redirectTo);
   }

   // Role-based redirect
   if (result.data.user.role === "ADMIN") {
      redirect("/admin-dashboard");
   }

   if (result.data.user.role === "TECHNICIAN") {
      redirect("/technician-dashboard");
   }

   if (result.data.user.role === "CUSTOMER") {
      redirect("/dashboard");
   }

   return result;
};
