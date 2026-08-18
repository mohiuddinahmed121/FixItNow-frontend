"use client";

import { useState } from "react";
import Link from "next/link";

import { useMyBookings } from "@/hooks/use-bookings";
import { useMyPayments, useCreatePayment } from "@/hooks/use-payments";

export default function BookingsPage() {
   const { data, isLoading, isError, error } = useMyBookings();
   const { data: paymentsData, isLoading: paymentsLoading } = useMyPayments();

   const createPayment = useCreatePayment();

   const [processingBookingId, setProcessingBookingId] = useState<string | null>(null);
   const [paymentError, setPaymentError] = useState<{
      bookingId: string;
      message: string;
   } | null>(null);

   if (isLoading || paymentsLoading) {
      return (
         <div className="p-6">
            <div className="rounded-lg border p-6">
               <p className="text-muted-foreground">Loading your bookings...</p>
            </div>
         </div>
      );
   }

   if (isError) {
      return (
         <div className="p-6">
            <div className="rounded-lg border p-6">
               <p className="text-red-500">
                  {error instanceof Error ? error.message : "Failed to load bookings"}
               </p>
            </div>
         </div>
      );
   }

   const bookings = data?.data ?? [];
   const payments = paymentsData?.data ?? [];

   const handlePayNow = (bookingId: string) => {
      setPaymentError(null);
      setProcessingBookingId(bookingId);

      createPayment.mutate(bookingId, {
         onSuccess: () => {
            setProcessingBookingId(null);
         },

         onError: (error) => {
            setProcessingBookingId(null);

            setPaymentError({
               bookingId,
               message: error instanceof Error ? error.message : "Payment failed",
            });
         },
      });
   };

   const getPaymentForBooking = (bookingId: string) => {
      return payments.find((payment) => payment.booking.id === bookingId);
   };

   return (
      <div className="space-y-6 p-6">
         <div>
            <h1 className="text-3xl font-bold">My Bookings</h1>

            <p className="mt-2 text-muted-foreground">View and manage your service bookings.</p>
         </div>

         {bookings.length === 0 ? (
            <div className="rounded-lg border p-8 text-center">
               <h2 className="text-xl font-semibold">No bookings yet</h2>

               <p className="mt-2 text-sm text-muted-foreground">
                  You have not booked any services yet.
               </p>

               <Link
                  href="/dashboard"
                  className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
               >
                  Browse Services
               </Link>
            </div>
         ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
               {bookings.map((booking) => {
                  const payment = getPaymentForBooking(booking.id);

                  const isProcessing = processingBookingId === booking.id;

                  const isPaid = booking.status === "PAID" || payment?.status === "COMPLETED";

                  return (
                     <div key={booking.id} className="rounded-lg border p-6 shadow-sm">
                        <div className="flex items-start justify-between gap-4">
                           <h2 className="text-lg font-semibold">{booking.service.title}</h2>

                           <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                 booking.status === "PAID"
                                    ? "bg-green-100 text-green-700"
                                    : booking.status === "ACCEPTED"
                                      ? "bg-blue-100 text-blue-700"
                                      : booking.status === "REQUESTED"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : booking.status === "COMPLETED"
                                          ? "bg-green-100 text-green-700"
                                          : booking.status === "IN_PROGRESS"
                                            ? "bg-purple-100 text-purple-700"
                                            : "bg-muted"
                              }`}
                           >
                              {booking.status}
                           </span>
                        </div>

                        <div className="mt-4 space-y-2 text-sm">
                           <p>
                              <span className="font-medium">Category:</span>{" "}
                              {booking.service.category.name}
                           </p>

                           <p>
                              <span className="font-medium">Technician:</span>{" "}
                              {booking.service.technicianProfile.user.name}
                           </p>

                           <p>
                              <span className="font-medium">Price:</span> ${booking.service.price}
                           </p>

                           <p>
                              <span className="font-medium">Booking Date:</span>{" "}
                              {new Date(booking.bookingDate).toLocaleString()}
                           </p>
                        </div>

                        <div className="mt-5">
                           {isPaid ? (
                              <div className="rounded-md bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-700">
                                 ✓ Payment Completed
                              </div>
                           ) : payment?.status === "PENDING" ? (
                              <div className="rounded-md bg-yellow-50 px-4 py-3 text-center text-sm font-medium text-yellow-700">
                                 Payment Processing
                              </div>
                           ) : payment?.status === "FAILED" ? (
                              <button
                                 type="button"
                                 onClick={() => handlePayNow(booking.id)}
                                 disabled={isProcessing}
                                 className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
                              >
                                 {isProcessing ? "Processing..." : "Try Payment Again"}
                              </button>
                           ) : booking.status === "ACCEPTED" ? (
                              <button
                                 type="button"
                                 onClick={() => handlePayNow(booking.id)}
                                 disabled={isProcessing}
                                 className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
                              >
                                 {isProcessing ? "Processing..." : "Pay Now"}
                              </button>
                           ) : null}

                           {paymentError?.bookingId === booking.id && (
                              <p className="mt-2 text-sm text-red-500">{paymentError.message}</p>
                           )}
                        </div>

                        <Link
                           href={`/dashboard/bookings/${booking.id}`}
                           className="mt-3 block rounded-md border px-4 py-2 text-center text-sm font-medium hover:bg-muted"
                        >
                           View Details
                        </Link>
                        {booking.status === "COMPLETED" && (
                           <Link
                              href={`/dashboard/bookings/${booking.id}/review`}
                              className="mt-3 block rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground"
                           >
                              Write Review
                           </Link>
                        )}
                     </div>
                  );
               })}
            </div>
         )}
      </div>
   );
}
