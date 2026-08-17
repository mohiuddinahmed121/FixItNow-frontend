"use client";

import { useTechnicianBookings, useUpdateBookingStatus } from "@/hooks/use-technician-bookings";
import Link from "next/link";

export default function TechnicianDashboardPage() {
   const { data, isLoading, isError, error } = useTechnicianBookings();
   const updateStatus = useUpdateBookingStatus();

   if (isLoading) {
      return (
         <div className="p-6">
            <p className="text-muted-foreground">Loading bookings...</p>
         </div>
      );
   }

   if (isError) {
      return (
         <div className="p-6">
            <p className="text-red-500">
               {error instanceof Error ? error.message : "Failed to load bookings"}
            </p>
         </div>
      );
   }

   const bookings = data?.data ?? [];

   const handleStatusUpdate = (
      bookingId: string,
      status: "ACCEPTED" | "DECLINED" | "IN_PROGRESS" | "COMPLETED",
   ) => {
      updateStatus.mutate({
         bookingId,
         status,
      });
   };

   return (
      <div className="space-y-6 p-6">
         {/* Header */}
         <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
               <h1 className="text-3xl font-bold">Technician Dashboard</h1>

               <p className="mt-2 text-muted-foreground">
                  Manage your customer bookings and service requests.
               </p>
            </div>

            <Link
               href="/technician-dashboard/services/create"
               className="w-fit rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
               Create Service
            </Link>
         </div>

         {/* No bookings */}
         {bookings.length === 0 ? (
            <div className="rounded-lg border p-6">
               <p className="text-muted-foreground">You do not have any bookings yet.</p>
            </div>
         ) : (
            <div className="space-y-4">
               {bookings.map((booking) => (
                  <div key={booking.id} className="rounded-lg border p-6 shadow-sm">
                     {/* Booking Header */}
                     <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                           <h2 className="text-xl font-semibold">{booking.service.title}</h2>

                           <p className="mt-1 text-sm text-muted-foreground">
                              Booking ID: {booking.id}
                           </p>
                        </div>

                        <span
                           className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                              booking.status === "REQUESTED"
                                 ? "bg-yellow-100 text-yellow-700"
                                 : booking.status === "ACCEPTED"
                                   ? "bg-blue-100 text-blue-700"
                                   : booking.status === "PAID"
                                     ? "bg-green-100 text-green-700"
                                     : booking.status === "IN_PROGRESS"
                                       ? "bg-purple-100 text-purple-700"
                                       : booking.status === "COMPLETED"
                                         ? "bg-green-100 text-green-700"
                                         : booking.status === "DECLINED"
                                           ? "bg-red-100 text-red-700"
                                           : "bg-muted"
                           }`}
                        >
                           {booking.status}
                        </span>
                     </div>

                     {/* Customer & Booking Information */}
                     <div className="mt-5 grid gap-4 md:grid-cols-2">
                        {/* Customer */}
                        <div>
                           <h3 className="font-medium">Customer</h3>

                           <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                              <p>{booking.customer.name}</p>

                              <p>{booking.customer.email}</p>

                              {booking.customer.phone && <p>{booking.customer.phone}</p>}
                           </div>
                        </div>

                        {/* Booking */}
                        <div>
                           <h3 className="font-medium">Booking</h3>

                           <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                              <p>Date: {new Date(booking.bookingDate).toLocaleString()}</p>

                              <p>Price: ${booking.service.price}</p>

                              {booking.note && <p>Note: {booking.note}</p>}
                           </div>
                        </div>
                     </div>

                     {/* Actions */}
                     <div className="mt-5 flex flex-wrap items-center gap-3">
                        {/* REQUESTED */}
                        {booking.status === "REQUESTED" && (
                           <>
                              <button
                                 type="button"
                                 onClick={() => handleStatusUpdate(booking.id, "ACCEPTED")}
                                 disabled={updateStatus.isPending}
                                 className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
                              >
                                 {updateStatus.isPending ? "Processing..." : "Accept"}
                              </button>

                              <button
                                 type="button"
                                 onClick={() => handleStatusUpdate(booking.id, "DECLINED")}
                                 disabled={updateStatus.isPending}
                                 className="rounded-md border px-4 py-2 text-sm font-medium disabled:opacity-50"
                              >
                                 {updateStatus.isPending ? "Processing..." : "Decline"}
                              </button>
                           </>
                        )}

                        {/* ACCEPTED */}
                        {booking.status === "ACCEPTED" && (
                           <div className="rounded-md bg-yellow-50 px-4 py-2 text-sm font-medium text-yellow-700">
                              Waiting for customer payment
                           </div>
                        )}

                        {/* PAID */}
                        {booking.status === "PAID" && (
                           <button
                              type="button"
                              onClick={() => handleStatusUpdate(booking.id, "IN_PROGRESS")}
                              disabled={updateStatus.isPending}
                              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
                           >
                              {updateStatus.isPending ? "Starting..." : "Start Service"}
                           </button>
                        )}

                        {/* IN_PROGRESS */}
                        {booking.status === "IN_PROGRESS" && (
                           <button
                              type="button"
                              onClick={() => handleStatusUpdate(booking.id, "COMPLETED")}
                              disabled={updateStatus.isPending}
                              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
                           >
                              {updateStatus.isPending ? "Completing..." : "Complete Service"}
                           </button>
                        )}

                        {/* COMPLETED */}
                        {booking.status === "COMPLETED" && (
                           <div className="rounded-md bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
                              ✓ Service Completed
                           </div>
                        )}

                        {/* DECLINED */}
                        {booking.status === "DECLINED" && (
                           <div className="rounded-md bg-red-50 px-4 py-2 text-sm font-medium text-red-700">
                              Booking Declined
                           </div>
                        )}

                        {/* CANCELED */}
                        {booking.status === "CANCELED" && (
                           <div className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
                              Booking Canceled
                           </div>
                        )}
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
}
