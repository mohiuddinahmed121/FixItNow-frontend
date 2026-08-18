"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { useService } from "@/hooks/use-services";
import { useTechnicianReviews } from "@/hooks/use-reviews";

export default function ServiceDetailsPage() {
   const params = useParams();

   const serviceId = params.serviceId as string;

   const { data, isLoading, isError, error } = useService(serviceId);

   const service = data?.data;

   const technicianProfileId = service?.technicianProfile?.id ?? "";

   const {
      data: reviewsData,
      isLoading: reviewsLoading,
      isError: reviewsError,
   } = useTechnicianReviews(technicianProfileId);

   if (isLoading) {
      return (
         <div className="p-6">
            <div className="rounded-lg border p-6">
               <p className="text-muted-foreground">Loading service...</p>
            </div>
         </div>
      );
   }

   if (isError || !service) {
      return (
         <div className="p-6">
            <div className="rounded-lg border p-6 text-center">
               <h1 className="text-xl font-semibold">Service not found</h1>

               <p className="mt-2 text-sm text-muted-foreground">
                  {error instanceof Error ? error.message : "We could not load this service."}
               </p>

               <Link
                  href="/dashboard"
                  className="mt-4 inline-block rounded-md border px-4 py-2 text-sm"
               >
                  Back to Dashboard
               </Link>
            </div>
         </div>
      );
   }

   const reviews = reviewsData?.data?.reviews ?? [];
   const averageRating = reviewsData?.data?.averageRating ?? 0;
   const totalReviews = reviewsData?.data?.totalReviews ?? 0;

   return (
      <div className="space-y-6 p-6">
         {/* Back */}
         <div>
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:underline">
               ← Back to Services
            </Link>
         </div>

         {/* Service Information */}
         <div className="rounded-lg border p-6 shadow-sm">
            <div className="flex flex-col gap-6 md:flex-row md:justify-between">
               <div className="space-y-4">
                  <div>
                     <span className="rounded-full bg-muted px-3 py-1 text-xs">
                        {service.category.name}
                     </span>
                  </div>

                  <div>
                     <h1 className="text-3xl font-bold">{service.title}</h1>

                     <p className="mt-3 text-muted-foreground">{service.description}</p>
                  </div>
               </div>

               <div className="text-left md:text-right">
                  <p className="text-sm text-muted-foreground">Service Price</p>

                  <p className="text-3xl font-bold">${service.price}</p>
               </div>
            </div>
         </div>

         {/* Technician Information + Skills */}
         <div className="grid gap-6 md:grid-cols-2">
            {/* Technician Information */}
            <div className="rounded-lg border p-6">
               <h2 className="mb-4 text-xl font-semibold">Technician Information</h2>

               <div className="space-y-3 text-sm">
                  <p>
                     <span className="font-medium">Name:</span>{" "}
                     {service.technicianProfile.user.name}
                  </p>

                  <p>
                     <span className="font-medium">Email:</span>{" "}
                     {service.technicianProfile.user.email}
                  </p>

                  <p>
                     <span className="font-medium">Phone:</span>{" "}
                     {service.technicianProfile.user.phone || "Not provided"}
                  </p>

                  <p>
                     <span className="font-medium">Location:</span>{" "}
                     {service.technicianProfile.location}
                  </p>

                  <p>
                     <span className="font-medium">Experience:</span>{" "}
                     {service.technicianProfile.experience} years
                  </p>

                  <p>
                     <span className="font-medium">Hourly Rate:</span> $
                     {service.technicianProfile.hourlyRate}
                  </p>

                  <p>
                     <span className="font-medium">Status:</span>{" "}
                     {service.technicianProfile.isAvailable ? "Available" : "Currently unavailable"}
                  </p>
               </div>
            </div>

            {/* Technician Skills */}
            <div className="rounded-lg border p-6">
               <h2 className="mb-4 text-xl font-semibold">Technician Skills</h2>

               {service.technicianProfile.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                     {service.technicianProfile.skills.map((skill) => (
                        <span key={skill} className="rounded-full border px-3 py-1 text-sm">
                           {skill}
                        </span>
                     ))}
                  </div>
               ) : (
                  <p className="text-sm text-muted-foreground">No skills provided.</p>
               )}

               {service.technicianProfile.bio && (
                  <div className="mt-6">
                     <h3 className="font-medium">About Technician</h3>

                     <p className="mt-2 text-sm text-muted-foreground">
                        {service.technicianProfile.bio}
                     </p>
                  </div>
               )}
            </div>
         </div>

         {/* Category */}
         <div className="rounded-lg border p-6">
            <h2 className="text-xl font-semibold">Category</h2>

            <p className="mt-2 font-medium">{service.category.name}</p>

            {service.category.description && (
               <p className="mt-2 text-sm text-muted-foreground">{service.category.description}</p>
            )}
         </div>

         {/* Reviews */}
         <div className="rounded-lg border p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
               <div>
                  <h2 className="text-2xl font-semibold">Customer Reviews</h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                     See what customers think about this technician.
                  </p>
               </div>

               {/* Rating Summary */}
               <div className="rounded-lg bg-muted px-5 py-4 text-center">
                  <p className="text-3xl font-bold">⭐ {averageRating.toFixed(1)}</p>

                  <p className="mt-1 text-sm text-muted-foreground">
                     {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
                  </p>
               </div>
            </div>

            {/* Reviews Loading */}
            {reviewsLoading && (
               <div className="mt-6 rounded-md border p-4">
                  <p className="text-sm text-muted-foreground">Loading reviews...</p>
               </div>
            )}

            {/* Reviews Error */}
            {reviewsError && (
               <div className="mt-6 rounded-md border p-4">
                  <p className="text-sm text-red-500">Failed to load reviews.</p>
               </div>
            )}

            {/* No Reviews */}
            {!reviewsLoading && !reviewsError && reviews.length === 0 && (
               <div className="mt-6 rounded-md border p-6 text-center">
                  <p className="text-sm text-muted-foreground">No reviews yet.</p>
               </div>
            )}

            {/* Reviews List */}
            {!reviewsLoading && !reviewsError && reviews.length > 0 && (
               <div className="mt-6 space-y-4">
                  {reviews.map((review) => (
                     <div key={review.id} className="rounded-md border p-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                           <div>
                              <p className="font-medium">{review.customer.name}</p>

                              <div className="mt-1 flex items-center gap-2">
                                 <span className="text-yellow-500">
                                    {"★".repeat(review.rating)}

                                    <span className="text-muted-foreground">
                                       {"★".repeat(5 - review.rating)}
                                    </span>
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

         {/* Booking Button */}
         {service.technicianProfile.isAvailable ? (
            <div className="flex justify-end">
               <Link
                  href={`/dashboard/bookings/create?serviceId=${service.id}`}
                  className="rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground"
               >
                  Book This Service
               </Link>
            </div>
         ) : (
            <div className="rounded-lg border p-4 text-center text-sm text-muted-foreground">
               This technician is currently unavailable.
            </div>
         )}
      </div>
   );
}
