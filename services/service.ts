import { api } from "@/lib/api";

export interface Service {
   id: string;
   title: string;
   description: string;
   price: number;
   category: {
      id: string;
      name: string;
   };
   technicianProfile: {
      id: string;
      user: {
         id: string;
         name: string;
         email: string;
         role: "CUSTOMER" | "TECHNICIAN" | "ADMIN";
         activeStatus: string;
      };
   };
}

interface ServicesResponse {
   success: boolean;
   statusCode: number;
   message: string;
   data: Service[];
}

export const serviceService = {
   getAllServices: async () => {
      return api<ServicesResponse>("/services", {
         method: "GET",
      });
   },

   getSingleService: async (serviceId: string) => {
      return api<{
         success: boolean;
         statusCode: number;
         message: string;
         data: Service;
      }>(`/services/${serviceId}`, {
         method: "GET",
      });
   },
};
