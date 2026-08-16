import { api } from "@/lib/api";

export interface Booking {
   id: string;
   bookingDate: string;
   note: string | null;
   status:
      | "REQUESTED"
      | "ACCEPTED"
      | "DECLINED"
      | "IN_PROGRESS"
      | "COMPLETED"
      | "CANCELED"
      | "PAID";
   createdAt: string;
   updatedAt: string;

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

      technicianProfile: {
         id: string;
         location: string;
         experience: number;
         isAvailable: boolean;

         user: {
            id: string;
            name: string;
            email: string;
            phone: string | null;
         };
      };
   };
}

export interface CreateBookingPayload {
   serviceId: string;
   bookingDate: string;
   note?: string;
}

export interface BookingResponse {
   success: boolean;
   statusCode: number;
   message: string;
   data: Booking;
}

export interface BookingsResponse {
   success: boolean;
   statusCode: number;
   message: string;
   data: Booking[];
}

export const bookingService = {
   createBooking: async (payload: CreateBookingPayload) => {
      return api<BookingResponse>("/bookings", {
         method: "POST",
         body: JSON.stringify(payload),
      });
   },

   getMyBookings: async () => {
      return api<BookingsResponse>("/bookings", {
         method: "GET",
      });
   },

   getSingleBooking: async (bookingId: string) => {
      return api<BookingResponse>(`/bookings/${bookingId}`, {
         method: "GET",
      });
   },

   cancelBooking: async (bookingId: string) => {
      return api<BookingResponse>(`/bookings/${bookingId}/cancel`, {
         method: "PATCH",
      });
   },
};
