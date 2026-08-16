import { api } from "@/lib/api";

export interface Payment {
   id: string;
   amount: number;
   transactionId: string;
   paymentIntentId: string;
   method: "ONLINE" | "CASH";
   provider: "STRIPE";
   status: "PENDING" | "COMPLETED" | "FAILED";
   paidAt: string | null;
   createdAt: string;
   updatedAt: string;

   booking: {
      id: string;
      bookingDate: string;
      status: string;

      service: {
         id: string;
         title: string;
         price: number;
      };
   };
}

export interface CreatePaymentResponse {
   success: boolean;
   statusCode: number;
   message: string;
   data: {
      checkoutUrl: string | null;
      payment: Payment;
   };
}

export interface PaymentsResponse {
   success: boolean;
   statusCode: number;
   message: string;
   data: Payment[];
}

export interface SinglePaymentResponse {
   success: boolean;
   statusCode: number;
   message: string;
   data: Payment;
}

export const paymentService = {
   createPayment: async (bookingId: string) => {
      return api<CreatePaymentResponse>("/payments/create", {
         method: "POST",
         body: JSON.stringify({ bookingId }),
      });
   },

   getMyPayments: async () => {
      return api<PaymentsResponse>("/payments", {
         method: "GET",
      });
   },

   getSinglePayment: async (paymentId: string) => {
      return api<SinglePaymentResponse>(`/payments/${paymentId}`, {
         method: "GET",
      });
   },
};
