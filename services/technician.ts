import { api } from "@/lib/api";

export interface TechnicianProfile {
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

   services: {
      id: string;
      title: string;
      description: string;
      price: number;
      categoryId: string;
      technicianProfileId: string;
      createdAt: string;
      updatedAt: string;
   }[];
}

export interface TechnicianProfileResponse {
   success: boolean;
   statusCode: number;
   message: string;
   data: TechnicianProfile;
}

export interface UpdateTechnicianProfilePayload {
   bio?: string;
   experience?: number;
   skills?: string[];
   location?: string;
   hourlyRate?: number;
   isAvailable?: boolean;
}

export const technicianService = {
   getMyProfile: async () => {
      return api<TechnicianProfileResponse>("/technician/profile", {
         method: "GET",
      });
   },

   updateProfile: async (payload: UpdateTechnicianProfilePayload) => {
      return api<TechnicianProfileResponse>("/technician/profile", {
         method: "PUT",
         body: JSON.stringify(payload),
      });
   },
};
