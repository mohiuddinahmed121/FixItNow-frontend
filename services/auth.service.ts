import { api } from "@/lib/api";
import type { AuthResponse, LoginPayload, MeResponse, RegisterPayload } from "@/types/auth";

export const authService = {
   register: async (payload: RegisterPayload) => {
      return api<AuthResponse>("/auth/register", {
         method: "POST",
         body: JSON.stringify(payload),
      });
   },

   login: async (payload: LoginPayload) => {
      return api<AuthResponse>("/auth/login", {
         method: "POST",
         body: JSON.stringify(payload),
      });
   },

   refreshToken: async () => {
      return api<{
         success: boolean;
         statusCode: number;
         message: string;
         data: {
            accessToken: string;
         };
      }>("/auth/refresh-token", {
         method: "POST",
      });
   },

   getMe: async (token: string) => {
      return api<MeResponse>("/auth/me", {
         method: "GET",
         token,
      });
   },
};
