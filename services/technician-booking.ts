import { api } from "@/lib/api";

export type TechnicianBookingStatus =
   | "REQUESTED"
   | "ACCEPTED"
   | "DECLINED"
   | "IN_PROGRESS"
   | "COMPLETED"
   | "CANCELED"
   | "PAID";

export interface TechnicianBooking {
   id: string;
   bookingDate: string;
   note: string | null;
   status: TechnicianBookingStatus;
   createdAt: string;
   updatedAt: string;

   customer: {
      id: string;
      name: string;
      email: string;
      phone: string | null;
   };

   service: {
      id: string;
      title: string;
      description: string;
      price: number;

      category: {
         id: string;
         name: string;
         description: string | null;
      };
   };
}

export interface TechnicianBookingsResponse {
   success: boolean;
   statusCode: number;
   message: string;
   data: TechnicianBooking[];
}

export interface UpdateBookingStatusResponse {
   success: boolean;
   statusCode: number;
   message: string;
   data: TechnicianBooking;
}

export const technicianBookingService = {
   getMyBookings: async () => {
      return api<TechnicianBookingsResponse>("/bookings/technician/my-bookings", {
         method: "GET",
      });
   },

   updateBookingStatus: async ({
      bookingId,
      status,
   }: {
      bookingId: string;
      status: TechnicianBookingStatus;
   }) => {
      return api<UpdateBookingStatusResponse>(`/bookings/technician/${bookingId}`, {
         method: "PATCH",
         body: JSON.stringify({ status }),
      });
   },
};
