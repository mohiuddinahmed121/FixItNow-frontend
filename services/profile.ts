import { api } from "@/lib/api";

export interface ProfileUser {
   id: string;
   name: string;
   email: string;
   phone: string | null;
   role: "CUSTOMER" | "TECHNICIAN" | "ADMIN";
   activeStatus: "ACTIVE" | "BLOCKED";
   createdAt: string;
   updatedAt: string;
}

export interface ProfileResponse {
   success: boolean;
   statusCode: number;
   message: string;
   data: ProfileUser;
}

export interface UpdateProfilePayload {
   name?: string;
   phone?: string | null;
}

export interface ChangePasswordPayload {
   currentPassword: string;
   newPassword: string;
}

export interface MessageResponse {
   success: boolean;
   statusCode: number;
   message: string;
}

export const profileService = {
   getMe: async () => {
      return api<ProfileResponse>("/auth/me", {
         method: "GET",
      });
   },

   updateMe: async (payload: UpdateProfilePayload) => {
      return api<ProfileResponse>("/auth/me", {
         method: "PATCH",
         body: JSON.stringify(payload),
      });
   },

   changePassword: async (payload: ChangePasswordPayload) => {
      return api<MessageResponse>("/auth/change-password", {
         method: "PATCH",
         body: JSON.stringify(payload),
      });
   },
};
