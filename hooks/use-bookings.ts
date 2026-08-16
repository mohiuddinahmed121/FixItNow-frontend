"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookingService } from "@/services/booking";

export const useCreateBooking = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: bookingService.createBooking,

      onSuccess: () => {
         queryClient.invalidateQueries({
            queryKey: ["bookings"],
         });
      },
   });
};

export const useMyBookings = () => {
   return useQuery({
      queryKey: ["bookings"],
      queryFn: bookingService.getMyBookings,
   });
};

export const useBooking = (bookingId: string) => {
   return useQuery({
      queryKey: ["booking", bookingId],
      queryFn: () => bookingService.getSingleBooking(bookingId),
      enabled: !!bookingId,
   });
};

export const useCancelBooking = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: bookingService.cancelBooking,

      onSuccess: () => {
         queryClient.invalidateQueries({
            queryKey: ["bookings"],
         });
      },
   });
};
