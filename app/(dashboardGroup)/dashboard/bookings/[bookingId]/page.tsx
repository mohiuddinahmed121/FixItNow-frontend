"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { useBooking, useCancelBooking } from "@/hooks/use-bookings";

export default function BookingDetailsPage() {
   const params = useParams();

   const bookingId = params.bookingId as string;

   const { data, isLoading, isError, error } = useBooking(bookingId);

   const cancelBooking = useCancelBooking();

   if (isLoading) {
      return (
         <div className="p-6">
            <p className="text-muted-foreground">Loading booking...</p>
         </div>
      );
   }

   if (isError || !data?.data) {
      return (
         <div className="p-6">
            <div className="rounded-lg border p-6 text-center">
               <h1 className="text-xl font-semibold">Booking not found</h1>

               <p className="mt-2 text-sm text-muted-foreground">
                  {error instanceof Error ? error.message : "We could not load this booking."}
               </p>

               <Link
                  href="/dashboard/bookings"
                  className="mt-4 inline-block rounded-md border px-4 py-2 text-sm"
               >
                  Back to My Bookings
               </Link>
            </div>
         </div>
      );
   }

   const booking = data.data;

   const canCancel = booking.status === "REQUESTED" || booking.status === "ACCEPTED";

   const canReview = booking.status === "COMPLETED";

   const handleCancel = () => {
      const confirmed = window.confirm("Are you sure you want to cancel this booking?");

      if (!confirmed) return;

      cancelBooking.mutate(booking.id);
   };

   return (
      <div className="space-y-6 p-6">
         {/* Header */}
         <div>
            <Link
               href="/dashboard/bookings"
               className="text-sm text-muted-foreground hover:underline"
            >
               ← Back to My Bookings
            </Link>

            <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
               <div>
                  <h1 className="text-3xl font-bold">Booking Details</h1>

                  <p className="mt-2 text-sm text-muted-foreground">Booking ID: {booking.id}</p>
               </div>

               <span className="w-fit rounded-full bg-muted px-4 py-2 text-sm font-medium">
                  {booking.status}
               </span>
            </div>
         </div>

         {/* Service Information */}
         <div className="rounded-lg border p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Service Information</h2>

            <div className="mt-5 space-y-4">
               <div>
                  <p className="text-sm text-muted-foreground">Service</p>

                  <p className="mt-1 text-lg font-semibold">{booking.service.title}</p>
               </div>

               <div>
                  <p className="text-sm text-muted-foreground">Description</p>

                  <p className="mt-1 text-sm">{booking.service.description}</p>
               </div>

               <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                     <p className="text-sm text-muted-foreground">Category</p>

                     <p className="mt-1 font-medium">{booking.service.category.name}</p>
                  </div>

                  <div>
                     <p className="text-sm text-muted-foreground">Price</p>

                     <p className="mt-1 text-lg font-semibold">${booking.service.price}</p>
                  </div>
               </div>
            </div>
         </div>

         {/* Technician Information */}
         <div className="rounded-lg border p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Technician Information</h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
               <div>
                  <p className="text-sm text-muted-foreground">Name</p>

                  <p className="mt-1 font-medium">{booking.service.technicianProfile.user.name}</p>
               </div>

               <div>
                  <p className="text-sm text-muted-foreground">Email</p>

                  <p className="mt-1 font-medium">{booking.service.technicianProfile.user.email}</p>
               </div>

               <div>
                  <p className="text-sm text-muted-foreground">Phone</p>

                  <p className="mt-1 font-medium">
                     {booking.service.technicianProfile.user.phone || "Not provided"}
                  </p>
               </div>

               <div>
                  <p className="text-sm text-muted-foreground">Location</p>

                  <p className="mt-1 font-medium">{booking.service.technicianProfile.location}</p>
               </div>

               <div>
                  <p className="text-sm text-muted-foreground">Experience</p>

                  <p className="mt-1 font-medium">
                     {booking.service.technicianProfile.experience} years
                  </p>
               </div>

               <div>
                  <p className="text-sm text-muted-foreground">Availability</p>

                  <p className="mt-1 font-medium">
                     {booking.service.technicianProfile.isAvailable
                        ? "Available"
                        : "Currently unavailable"}
                  </p>
               </div>
            </div>
         </div>

         {/* Booking Information */}
         <div className="rounded-lg border p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Booking Information</h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
               <div>
                  <p className="text-sm text-muted-foreground">Booking Date</p>

                  <p className="mt-1 font-medium">
                     {new Date(booking.bookingDate).toLocaleString()}
                  </p>
               </div>

               <div>
                  <p className="text-sm text-muted-foreground">Booking Status</p>

                  <p className="mt-1 font-medium">{booking.status}</p>
               </div>

               <div>
                  <p className="text-sm text-muted-foreground">Created At</p>

                  <p className="mt-1 font-medium">{new Date(booking.createdAt).toLocaleString()}</p>
               </div>

               {booking.note && (
                  <div>
                     <p className="text-sm text-muted-foreground">Note</p>

                     <p className="mt-1 font-medium">{booking.note}</p>
                  </div>
               )}
            </div>
         </div>

         {/* Actions */}
         <div className="flex flex-wrap gap-3">
            {canCancel && (
               <button
                  type="button"
                  onClick={handleCancel}
                  disabled={cancelBooking.isPending}
                  className="rounded-md border border-red-500 px-4 py-2 text-sm font-medium text-red-500 disabled:opacity-50"
               >
                  {cancelBooking.isPending ? "Cancelling..." : "Cancel Booking"}
               </button>
            )}

            {canReview && (
               <Link
                  href={`/dashboard/bookings/${booking.id}/review`}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
               >
                  Leave a Review
               </Link>
            )}
         </div>

         {cancelBooking.isError && (
            <p className="text-sm text-red-500">
               {cancelBooking.error instanceof Error
                  ? cancelBooking.error.message
                  : "Failed to cancel booking"}
            </p>
         )}

         {cancelBooking.isSuccess && (
            <p className="text-sm text-green-600">Booking cancelled successfully.</p>
         )}
      </div>
   );
}
