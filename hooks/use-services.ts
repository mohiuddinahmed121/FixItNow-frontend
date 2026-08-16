"use client";

import { useQuery } from "@tanstack/react-query";
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
