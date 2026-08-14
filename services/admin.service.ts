import { api } from "@/lib/api";

export const adminService = {
   getAllUsers: async () => {
      return api("/admin/users");
   },

   updateUserStatus: async (userId: string, activeStatus: "ACTIVE" | "BLOCKED") => {
      return api(`/admin/users/${userId}`, {
         method: "PATCH",
         body: JSON.stringify({ activeStatus }),
      });
   },

   getAllBookings: async () => {
      return api("/admin/bookings");
   },

   getAllCategories: async () => {
      return api("/admin/categories");
   },

   createCategory: async (payload: { name: string; description?: string }) => {
      return api("/admin/categories", {
         method: "POST",
         body: JSON.stringify(payload),
      });
   },
};
