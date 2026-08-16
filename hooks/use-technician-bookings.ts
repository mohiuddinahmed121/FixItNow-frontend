"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { technicianBookingService } from "@/services/technician-booking";

export const useTechnicianBookings = () => {
   return useQuery({
      queryKey: ["technician-bookings"],
      queryFn: technicianBookingService.getMyBookings,
   });
};

export const useUpdateBookingStatus = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: technicianBookingService.updateBookingStatus,

      onSuccess: () => {
         queryClient.invalidateQueries({
            queryKey: ["technician-bookings"],
         });
      },
   });
};
