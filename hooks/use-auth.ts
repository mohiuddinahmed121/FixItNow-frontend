"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { authService } from "@/services/auth.service";
import type { LoginPayload, RegisterPayload } from "@/types/auth";

const ACCESS_TOKEN_KEY = "fixitnow_access_token";
const REFRESH_TOKEN_KEY = "fixitnow_refresh_token";

export const useLogin = () => {
   return useMutation({
      mutationFn: (payload: LoginPayload) => authService.login(payload),

      onSuccess: (response) => {
         localStorage.setItem(ACCESS_TOKEN_KEY, response.data.accessToken);
      },
   });
};

export const useRegister = () => {
   return useMutation({
      mutationFn: (payload: RegisterPayload) => authService.register(payload),

      onSuccess: (response) => {
         localStorage.setItem(ACCESS_TOKEN_KEY, response.data.accessToken);
      },
   });
};

export const useCurrentUser = () => {
   return useQuery({
      queryKey: ["auth", "me"],

      queryFn: async () => {
         const token = localStorage.getItem(ACCESS_TOKEN_KEY);

         if (!token) {
            throw new Error("No access token found");
         }

         const response = await authService.getMe(token);

         return response.data;
      },

      enabled: typeof window !== "undefined" && !!localStorage.getItem(ACCESS_TOKEN_KEY),

      retry: false,
   });
};

export const useRefreshToken = () => {
   return useMutation({
      mutationFn: () => authService.refreshToken(),

      onSuccess: (response) => {
         localStorage.setItem(ACCESS_TOKEN_KEY, response.data.accessToken);
      },
   });
};
