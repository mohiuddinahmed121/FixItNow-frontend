"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { paymentService } from "@/services/payment";

export const useMyPayments = () => {
   return useQuery({
      queryKey: ["payments"],
      queryFn: paymentService.getMyPayments,
   });
};

export const usePayment = (paymentId: string) => {
   return useQuery({
      queryKey: ["payment", paymentId],
      queryFn: () => paymentService.getSinglePayment(paymentId),
      enabled: !!paymentId,
   });
};

export const useCreatePayment = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: paymentService.createPayment,

      onSuccess: (data) => {
         queryClient.invalidateQueries({
            queryKey: ["payments"],
         });

         queryClient.invalidateQueries({
            queryKey: ["bookings"],
         });

         if (data.data.checkoutUrl) {
            window.location.href = data.data.checkoutUrl;
         }
      },
   });
};
