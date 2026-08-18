"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type RegisterState = {
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

export const registerAction = async (prevState: RegisterState, formData: FormData) => {
   const name = formData.get("name");
   const email = formData.get("email");
   const password = formData.get("password");
   const role = formData.get("role");

   const payload = {
      name,
      email,
      password,
      role,
   };

   const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
   });

   const result = await res.json();

   if (!result.success) {
      return result;
   }

   const cookieStore = await cookies();

   cookieStore.set("accessToken", result.data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60,
      path: "/",
   });

   const setCookie =
      typeof res.headers.getSetCookie === "function"
         ? res.headers.getSetCookie().find((cookie) => cookie.startsWith("refreshToken="))
         : res.headers.get("set-cookie");

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
