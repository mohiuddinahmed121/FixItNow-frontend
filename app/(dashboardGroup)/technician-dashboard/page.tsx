"use client";

import Link from "next/link";
import { useTechnicianBookings, useUpdateBookingStatus } from "@/hooks/use-technician-bookings";
import { useMyTechnicianProfile } from "@/hooks/use-technician";
import { useTechnicianReviews } from "@/hooks/use-reviews";

export default function TechnicianDashboardPage() {
   const {
      data,
      isLoading: bookingsLoading,
      isError: bookingsError,
      error: bookingsErrorMessage,
   } = useTechnicianBookings();

   const {
      data: profileData,
      isLoading: profileLoading,
      isError: profileError,
   } = useMyTechnicianProfile();

   const updateStatus = useUpdateBookingStatus();

   const technicianProfileId = profileData?.data?.id ?? "";

   const {
      data: reviewsData,
      isLoading: reviewsLoading,
      isError: reviewsError,
   } = useTechnicianReviews(technicianProfileId);

   if (bookingsLoading || profileLoading) {
      return (
         <div className="p-6">
            <p className="text-muted-foreground">Loading technician dashboard...</p>
         </div>
      );
   }

   if (bookingsError || profileError) {
      return (
         <div className="p-6">
            <p className="text-red-500">
               {bookingsErrorMessage instanceof Error
                  ? bookingsErrorMessage.message
                  : "Failed to load technician dashboard"}
            </p>
         </div>
      );
   }

   const bookings = data?.data ?? [];

   const reviews = reviewsData?.data?.reviews ?? [];
   const averageRating = reviewsData?.data?.averageRating ?? 0;
   const totalReviews = reviewsData?.data?.totalReviews ?? 0;

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
      <div className="space-y-8 p-6">
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

         <div className="rounded-lg border p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
               <div>
                  <h2 className="text-xl font-semibold">Your Reviews</h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                     See what your customers think about your services.
                  </p>
               </div>

               <div className="rounded-lg bg-muted px-5 py-4 text-center">
                  <p className="text-3xl font-bold">⭐ {averageRating.toFixed(1)}</p>

                  <p className="mt-1 text-sm text-muted-foreground">
                     {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
                  </p>
               </div>
            </div>

            {reviewsLoading ? (
               <div className="mt-6 rounded-md border p-4">
                  <p className="text-sm text-muted-foreground">Loading reviews...</p>
               </div>
            ) : reviewsError ? (
               <div className="mt-6 rounded-md border p-4">
                  <p className="text-sm text-red-500">Failed to load reviews.</p>
               </div>
            ) : reviews.length === 0 ? (
               <div className="mt-6 rounded-md border p-6 text-center">
                  <p className="text-sm text-muted-foreground">No reviews yet.</p>
               </div>
            ) : (
               <div className="mt-6 space-y-4">
                  {reviews.map((review) => (
                     <div key={review.id} className="rounded-md border p-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                           <div>
                              <p className="font-medium">{review.customer.name}</p>

                              <div className="mt-1 flex items-center gap-2">
                                 <span className="text-yellow-500">
                                    {"★".repeat(review.rating)}
                                 </span>

                                 <span className="text-sm text-muted-foreground">
                                    {review.rating}/5
                                 </span>
                              </div>
                           </div>

                           <p className="text-xs text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString()}
                           </p>
                        </div>

                        {review.comment && (
                           <p className="mt-3 text-sm text-muted-foreground">{review.comment}</p>
                        )}
                     </div>
                  ))}
               </div>
            )}
         </div>

         <div>
            <div className="mb-4">
               <h2 className="text-2xl font-semibold">Customer Bookings</h2>

               <p className="mt-1 text-sm text-muted-foreground">
                  Manage your customer booking requests.
               </p>
            </div>

            {bookings.length === 0 ? (
               <div className="rounded-lg border p-6">
                  <p className="text-muted-foreground">You do not have any bookings yet.</p>
               </div>
            ) : (
               <div className="space-y-4">
                  {bookings.map((booking) => (
                     <div key={booking.id} className="rounded-lg border p-6 shadow-sm">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                           <div>
                              <h2 className="text-xl font-semibold">{booking.service.title}</h2>

                              <p className="mt-1 text-sm text-muted-foreground">
                                 Booking ID: {booking.id}
                              </p>
                           </div>

                           <span className="w-fit rounded-full bg-muted px-3 py-1 text-xs font-medium">
                              {booking.status}
                           </span>
                        </div>

                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                           <div>
                              <h3 className="font-medium">Customer</h3>

                              <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                                 <p>{booking.customer.name}</p>

                                 <p>{booking.customer.email}</p>

                                 {booking.customer.phone && <p>{booking.customer.phone}</p>}
                              </div>
                           </div>

                           <div>
                              <h3 className="font-medium">Booking</h3>

                              <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                                 <p>Date: {new Date(booking.bookingDate).toLocaleString()}</p>

                                 <p>Price: ${booking.service.price}</p>

                                 {booking.note && <p>Note: {booking.note}</p>}
                              </div>
                           </div>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-3">
                           {booking.status === "REQUESTED" && (
                              <>
                                 <button
                                    type="button"
                                    onClick={() => handleStatusUpdate(booking.id, "ACCEPTED")}
                                    disabled={updateStatus.isPending}
                                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
                                 >
                                    Accept
                                 </button>

                                 <button
                                    type="button"
                                    onClick={() => handleStatusUpdate(booking.id, "DECLINED")}
                                    disabled={updateStatus.isPending}
                                    className="rounded-md border px-4 py-2 text-sm font-medium disabled:opacity-50"
                                 >
                                    Decline
                                 </button>
                              </>
                           )}

                           {booking.status === "ACCEPTED" && (
                              <div className="rounded-md bg-yellow-50 px-4 py-2 text-sm font-medium text-yellow-700">
                                 Waiting for customer payment
                              </div>
                           )}

                           {booking.status === "PAID" && (
                              <button
                                 type="button"
                                 onClick={() => handleStatusUpdate(booking.id, "IN_PROGRESS")}
                                 disabled={updateStatus.isPending}
                                 className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
                              >
                                 Start Service
                              </button>
                           )}

                           {booking.status === "IN_PROGRESS" && (
                              <button
                                 type="button"
                                 onClick={() => handleStatusUpdate(booking.id, "COMPLETED")}
                                 disabled={updateStatus.isPending}
                                 className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
                              >
                                 Complete Service
                              </button>
                           )}

                           {booking.status === "COMPLETED" && (
                              <div className="rounded-md bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
                                 ✓ Service Completed
                              </div>
                           )}

                           {booking.status === "DECLINED" && (
                              <div className="rounded-md bg-red-50 px-4 py-2 text-sm font-medium text-red-700">
                                 Booking Declined
                              </div>
                           )}
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>
      </div>
   );
}
