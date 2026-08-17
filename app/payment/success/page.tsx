"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { paymentService } from "@/services/payment";
import { bookingService } from "@/services/booking";

export default function PaymentSuccessPage() {
   const searchParams = useSearchParams();
   const queryClient = useQueryClient();

   const bookingId = searchParams.get("bookingId");

   const bookingQuery = useQuery({
      queryKey: ["booking", bookingId],
      queryFn: () => bookingService.getSingleBooking(bookingId as string),
      enabled: !!bookingId,
      refetchInterval: (query) => {
         const booking = query.state.data?.data;

         if (booking?.status === "PAID") {
            return false;
         }

         return 2000;
      },
   });

   const paymentsQuery = useQuery({
      queryKey: ["payments"],
      queryFn: paymentService.getMyPayments,
      refetchInterval: (query) => {
         const payments = query.state.data?.data ?? [];

         if (!bookingId) {
            return false;
         }

         const payment = payments.find((item) => item.booking.id === bookingId);

         if (payment?.status === "COMPLETED") {
            return false;
         }

         return 2000;
      },
   });

   useEffect(() => {
      if (!bookingId) return;

      queryClient.invalidateQueries({
         queryKey: ["booking", bookingId],
      });

      queryClient.invalidateQueries({
         queryKey: ["bookings"],
      });

      queryClient.invalidateQueries({
         queryKey: ["payments"],
      });
   }, [bookingId, queryClient]);

   if (!bookingId) {
      return (
         <div className="flex min-h-[70vh] items-center justify-center p-6">
            <div className="w-full max-w-md rounded-lg border p-8 text-center shadow-sm">
               <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl">
                  !
               </div>

               <h1 className="text-2xl font-bold">Invalid Payment Session</h1>

               <p className="mt-3 text-muted-foreground">Booking information was not found.</p>

               <Link
                  href="/dashboard/bookings"
                  className="mt-6 block rounded-md bg-primary px-4 py-3 font-medium text-primary-foreground"
               >
                  View My Bookings
               </Link>
            </div>
         </div>
      );
   }

   const booking = bookingQuery.data?.data;

   const payments = paymentsQuery.data?.data ?? [];

   const payment = payments.find((item) => item.booking.id === bookingId);

   const isLoading = bookingQuery.isLoading || paymentsQuery.isLoading;

   const paymentCompleted = payment?.status === "COMPLETED";

   const bookingPaid = booking?.status === "PAID";

   const confirmed = paymentCompleted && bookingPaid;

   if (isLoading || !confirmed) {
      return (
         <div className="flex min-h-[70vh] items-center justify-center p-6">
            <div className="w-full max-w-md rounded-lg border p-8 text-center shadow-sm">
               <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 text-3xl">
                  ⏳
               </div>

               <h1 className="text-2xl font-bold">Processing Payment...</h1>

               <p className="mt-3 text-muted-foreground">
                  Your payment was received by Stripe. We are waiting for payment confirmation.
               </p>

               <p className="mt-3 text-sm text-muted-foreground">
                  Please wait a moment. This page will update automatically.
               </p>

               <div className="mt-5 rounded-md bg-muted p-4 text-left text-sm">
                  <p>
                     <span className="font-medium">Payment:</span> {payment?.status ?? "PENDING"}
                  </p>

                  <p className="mt-1">
                     <span className="font-medium">Booking:</span>{" "}
                     {booking?.status ?? "Checking..."}
                  </p>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="flex min-h-[70vh] items-center justify-center p-6">
         <div className="w-full max-w-md rounded-lg border p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
               ✓
            </div>

            <h1 className="text-3xl font-bold">Payment Successful!</h1>

            <p className="mt-3 text-muted-foreground">
               Your payment has been completed successfully.
            </p>

            <div className="mt-5 rounded-md bg-green-50 p-4 text-sm text-green-700">
               <p>
                  <span className="font-medium">Payment:</span> COMPLETED
               </p>

               <p className="mt-1">
                  <span className="font-medium">Booking:</span> PAID
               </p>
            </div>

            <div className="mt-6 flex flex-col gap-3">
               <Link
                  href="/dashboard/bookings"
                  className="rounded-md bg-primary px-4 py-3 font-medium text-primary-foreground"
               >
                  View My Bookings
               </Link>

               <Link
                  href="/dashboard"
                  className="rounded-md border px-4 py-3 font-medium hover:bg-muted"
               >
                  Go to Dashboard
               </Link>
            </div>
         </div>
      </div>
   );
}
