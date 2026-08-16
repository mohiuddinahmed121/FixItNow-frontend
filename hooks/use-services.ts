"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { serviceService } from "@/services/service";

export const useServices = () => {
   return useQuery({
      queryKey: ["services"],
      queryFn: serviceService.getAllServices,
   });
};

export const useService = (serviceId: string) => {
   return useQuery({
      queryKey: ["service", serviceId],
      queryFn: () => serviceService.getSingleService(serviceId),
      enabled: !!serviceId,
   });
};

export const useCreateService = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: serviceService.createService,

      onSuccess: () => {
         queryClient.invalidateQueries({
            queryKey: ["services"],
         });
      },
   });
};
