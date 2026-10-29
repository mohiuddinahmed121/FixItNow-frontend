import { api } from "@/lib/api";

export interface ContactPayload {
   name: string;
   email: string;
   subject: string;
   message: string;
   // Honeypot: real visitors never fill this, bots often do
   website?: string;
}

export interface ContactResponse {
   success: boolean;
   statusCode: number;
   message: string;
}

export const contactService = {
   sendMessage: async (payload: ContactPayload) => {
      return api<ContactResponse>("/contact", {
         method: "POST",
         body: JSON.stringify(payload),
      });
   },
};
