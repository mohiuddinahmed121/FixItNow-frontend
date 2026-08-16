"use client";

import { useQuery } from "@tanstack/react-query";
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
