import { api } from "@/lib/api";

export interface Service {
   id: string;
   title: string;
   description: string;
   price: number;
   createdAt: string;
   updatedAt: string;

   category: {
      id: string;
      name: string;
      description: string | null;
      createdAt: string;
      updatedAt: string;
   };

   technicianProfile: {
      id: string;
      bio: string | null;
      experience: number;
      skills: string[];
      location: string;
      hourlyRate: number;
      isAvailable: boolean;
      createdAt: string;
      updatedAt: string;

      user: {
         id: string;
         name: string;
         email: string;
         phone: string | null;
         role: "CUSTOMER" | "TECHNICIAN" | "ADMIN";
         activeStatus: string;
         createdAt: string;
         updatedAt: string;
      };
   };
}

export interface ServicesResponse {
   success: boolean;
   statusCode: number;
   message: string;
   data: Service[];
}

export interface SingleServiceResponse {
   success: boolean;
   statusCode: number;
   message: string;
   data: Service;
}

export interface CreateServicePayload {
   title: string;
   description: string;
   price: number;
   categoryId: string;
}

export interface CreateServiceResponse {
   success: boolean;
   statusCode: number;
   message: string;
   data: Service;
}

export interface UpdateServicePayload {
   title?: string;
   description?: string;
   price?: number;
   categoryId?: string;
}

export interface UpdateServiceResponse {
   success: boolean;
   statusCode: number;
   message: string;
   data: Service;
}

export interface DeleteServiceResponse {
   success: boolean;
   statusCode: number;
   message: string;
   data: null;
}

export const serviceService = {
   getAllServices: async () => {
      return api<ServicesResponse>("/services", {
         method: "GET",
      });
   },

   getSingleService: async (serviceId: string) => {
      return api<SingleServiceResponse>(`/services/${serviceId}`, {
         method: "GET",
      });
   },

   createService: async (payload: CreateServicePayload) => {
      return api<CreateServiceResponse>("/services", {
         method: "POST",
         body: JSON.stringify(payload),
      });
   },

   updateService: async ({
      serviceId,
      payload,
   }: {
      serviceId: string;
      payload: UpdateServicePayload;
   }) => {
      return api<UpdateServiceResponse>(`/services/${serviceId}`, {
         method: "PUT",
         body: JSON.stringify(payload),
      });
   },

   deleteService: async (serviceId: string) => {
      return api<DeleteServiceResponse>(`/services/${serviceId}`, {
         method: "DELETE",
      });
   },
};
