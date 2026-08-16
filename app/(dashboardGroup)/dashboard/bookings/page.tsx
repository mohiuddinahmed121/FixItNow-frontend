"use client";

import Link from "next/link";
import { useMyBookings } from "@/hooks/use-bookings";

export default function BookingsPage() {
   const { data, isLoading, isError, error } = useMyBookings();

   if (isLoading) {
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
               {bookings.map((booking) => (
                  <div key={booking.id} className="rounded-lg border p-6 shadow-sm">
                     <div className="flex items-start justify-between gap-4">
                        <h2 className="text-lg font-semibold">{booking.service.title}</h2>

                        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
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

                     <Link
                        href={`/dashboard/bookings/${booking.id}`}
                        className="mt-5 block rounded-md border px-4 py-2 text-center text-sm font-medium hover:bg-muted"
                     >
                        View Details
                     </Link>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
}
