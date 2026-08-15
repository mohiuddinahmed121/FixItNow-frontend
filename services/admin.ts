"use server";

import { cookies } from "next/headers";

const BACKEND_API_URL = process.env.BACKEND_API_URL;

const getAccessToken = async () => {
   const cookieStore = await cookies();

   return cookieStore.get("accessToken")?.value || null;
};

const adminFetch = async (endpoint: string, options: RequestInit = {}) => {
   const accessToken = await getAccessToken();

   if (!accessToken) {
      return {
         success: false,
         message: "Authentication required",
         data: null,
      };
   }

   const response = await fetch(`${BACKEND_API_URL}/api${endpoint}`, {
      ...options,
      headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${accessToken}`,
         ...(options.headers || {}),
      },
      cache: "no-store",
   });

   const result = await response.json();

   return result;
};

export const getAdminUsers = async () => {
   return adminFetch("/admin/users");
};

export const updateAdminUserStatus = async (userId: string, activeStatus: "ACTIVE" | "BLOCKED") => {
   return adminFetch(`/admin/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify({
         activeStatus,
      }),
   });
};

export const getAdminBookings = async () => {
   return adminFetch("/admin/bookings");
};

export const getAdminCategories = async () => {
   return adminFetch("/admin/categories");
};

export const createAdminCategory = async (payload: { name: string; description?: string }) => {
   return adminFetch("/admin/categories", {
      method: "POST",
      body: JSON.stringify(payload),
   });
};
