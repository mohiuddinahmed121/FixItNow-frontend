"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profileService } from "@/services/profile";

export const useMyProfile = () => {
   return useQuery({
      queryKey: ["my-profile"],
      queryFn: profileService.getMe,
   });
};

export const useUpdateMyProfile = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: profileService.updateMe,

      onSuccess: () => {
         queryClient.invalidateQueries({
            queryKey: ["my-profile"],
         });
      },
   });
};

export const useChangePassword = () => {
   return useMutation({
      mutationFn: profileService.changePassword,
   });
};
