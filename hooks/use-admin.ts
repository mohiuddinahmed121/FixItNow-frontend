"use client";

import { useQuery } from "@tanstack/react-query";

import { getAdminBookings, getAdminUsers } from "@/services/admin";
import type { AdminBooking, AdminUser } from "@/types/admin";

// The admin server actions answer with { success, message, data }, so failures become real errors here.
export const useAdminUsers = () => {
   return useQuery({
      queryKey: ["admin", "users"],
      queryFn: async (): Promise<AdminUser[]> => {
         const result = await getAdminUsers();

         if (!result.success) throw new Error(result.message || "Failed to load users.");

         return result.data ?? [];
      },
   });
};

export const useAdminBookings = () => {
   return useQuery({
      queryKey: ["admin", "bookings"],
      queryFn: async (): Promise<AdminBooking[]> => {
         const result = await getAdminBookings();

         if (!result.success) throw new Error(result.message || "Failed to load bookings.");

         return result.data ?? [];
      },
   });
};
