"use server";

import { cookies } from "next/headers";

export const refreshAccessToken = async () => {
   const cookieStore = await cookies();

   const refreshToken = cookieStore.get("refreshToken")?.value;

   if (!refreshToken) {
      return {
         success: false,
         message: "Refresh token not found!",
      };
   }

   const response = await fetch(`${process.env.BACKEND_API_URL}/api/auth/refresh-token`, {
      method: "POST",
      headers: {
         Cookie: `refreshToken=${refreshToken}`,
      },
      cache: "no-store",
   });

   const result = await response.json();

   if (!response.ok || !result.success) {
      return {
         success: false,
         message: result.message || "Failed to refresh access token",
      };
   }

   /*
    * Save the new access token in the frontend's
    * HttpOnly cookie.
    */
   if (result.data?.accessToken) {
      cookieStore.set("accessToken", result.data.accessToken, {
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         sameSite: "lax",
         maxAge: 60 * 60 * 24,
         path: "/",
      });
   }

   return result;
};
