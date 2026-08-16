"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { technicianService } from "@/services/technician";

export const useMyTechnicianProfile = () => {
   return useQuery({
      queryKey: ["technician-profile"],
      queryFn: technicianService.getMyProfile,
   });
};

export const useUpdateTechnicianProfile = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: technicianService.updateProfile,

      onSuccess: () => {
         queryClient.invalidateQueries({
            queryKey: ["technician-profile"],
         });

         queryClient.invalidateQueries({
            queryKey: ["services"],
         });
      },
   });
};
