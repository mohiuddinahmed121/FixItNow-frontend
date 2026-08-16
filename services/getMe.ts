"use server";

import { cookies } from "next/headers";
import { getNewAccessToken } from "./refreshtoken";

export const getMe = async () => {
   const cookieStore = await cookies();

   let accessToken = cookieStore.get("accessToken")?.value || null;
   const refreshToken = cookieStore.get("refreshToken")?.value || null;

   if (!accessToken && !refreshToken) {
      return {
         success: false,
         message: "User not logged in!",
      };
   }

   // 1. Try current access token
   if (accessToken) {
      const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/me`, {
         headers: {
            Authorization: `Bearer ${accessToken}`,
         },
         cache: "no-store",
      });

      const result = await res.json();

      if (res.ok && result.success) {
         return result;
      }
   }

   // 2. Access token expired → use refresh token
   if (refreshToken) {
      const refreshResult = await getNewAccessToken();

      if (refreshResult.success && refreshResult.data?.accessToken) {
         accessToken = refreshResult.data.accessToken;

         const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/me`, {
            headers: {
               Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
         });

         const result = await res.json();

         if (res.ok && result.success) {
            return result;
         }
      }
   }

   return {
      success: false,
      message: "User session expired. Please login again.",
   };
};
