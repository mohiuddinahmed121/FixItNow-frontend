"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "@/services/review";

export const useCreateReview = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: reviewService.createReview,

      onSuccess: () => {
         queryClient.invalidateQueries({
            queryKey: ["bookings"],
         });

         queryClient.invalidateQueries({
            queryKey: ["reviews"],
         });
      },
   });
};

export const useTechnicianReviews = (technicianProfileId: string) => {
   return useQuery({
      queryKey: ["reviews", technicianProfileId],

      queryFn: () => reviewService.getTechnicianReviews(technicianProfileId),

      enabled: !!technicianProfileId,
   });
};
