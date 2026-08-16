"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { FormEvent, Suspense, useEffect } from "react";
import { toast } from "sonner";

import { useCreateBooking } from "@/hooks/use-bookings";
import { useService } from "@/hooks/use-services";

function CreateBookingForm() {
   const searchParams = useSearchParams();
   const router = useRouter();

   const serviceId = searchParams.get("serviceId") || "";

   const {
      data: serviceResponse,
      isLoading: serviceLoading,
      isError: serviceError,
   } = useService(serviceId);

   const createBookingMutation = useCreateBooking();

   useEffect(() => {
      if (!createBookingMutation.isSuccess) return;

      toast.success(createBookingMutation.data.message || "Booking created successfully!");

      router.push("/dashboard/bookings");
   }, [createBookingMutation.isSuccess, createBookingMutation.data, router]);

   useEffect(() => {
      if (!createBookingMutation.isError) return;

      toast.error(
         createBookingMutation.error instanceof Error
            ? createBookingMutation.error.message
            : "Failed to create booking",
      );
   }, [createBookingMutation.isError, createBookingMutation.error]);

   if (!serviceId) {
      return (
         <div className="p-6">
            <div className="rounded-lg border p-6 text-center">
               <h1 className="text-xl font-semibold">Service not selected</h1>

               <p className="mt-2 text-sm text-muted-foreground">
                  Please select a service before creating a booking.
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

   if (serviceLoading) {
      return (
         <div className="p-6">
            <div className="rounded-lg border p-6">
               <p className="text-muted-foreground">Loading service...</p>
            </div>
         </div>
      );
   }

   if (serviceError || !serviceResponse?.data) {
      return (
         <div className="p-6">
            <div className="rounded-lg border p-6 text-center">
               <h1 className="text-xl font-semibold">Service not found</h1>

               <p className="mt-2 text-sm text-muted-foreground">We could not load this service.</p>

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

   const service = serviceResponse.data;

   const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);

      const bookingDate = formData.get("bookingDate") as string;
      const note = formData.get("note") as string;

      if (!bookingDate) {
         toast.error("Please select a booking date.");
         return;
      }

      createBookingMutation.mutate({
         serviceId,
         bookingDate,
         note: note || undefined,
      });
   };

   return (
      <div className="space-y-6 p-6">
         <div>
            <Link
               href={`/dashboard/services/${service.id}`}
               className="text-sm text-muted-foreground hover:underline"
            >
               ← Back to Service
            </Link>

            <h1 className="mt-3 text-3xl font-bold">Book Service</h1>

            <p className="mt-2 text-muted-foreground">
               Schedule this service with your selected technician.
            </p>
         </div>

         <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border p-6">
               <h2 className="text-xl font-semibold">Service Information</h2>

               <div className="mt-4 space-y-3 text-sm">
                  <p>
                     <span className="font-medium">Service:</span> {service.title}
                  </p>

                  <p>
                     <span className="font-medium">Category:</span> {service.category.name}
                  </p>

                  <p>
                     <span className="font-medium">Price:</span> ${service.price}
                  </p>

                  <p>
                     <span className="font-medium">Technician:</span>{" "}
                     {service.technicianProfile.user.name}
                  </p>

                  <p>
                     <span className="font-medium">Location:</span>{" "}
                     {service.technicianProfile.location}
                  </p>

                  <p>
                     <span className="font-medium">Experience:</span>{" "}
                     {service.technicianProfile.experience} years
                  </p>
               </div>
            </div>

            <div className="rounded-lg border p-6">
               <h2 className="text-xl font-semibold">Booking Details</h2>

               <form onSubmit={handleSubmit} className="mt-4 space-y-5">
                  <div className="space-y-2">
                     <label htmlFor="bookingDate" className="text-sm font-medium">
                        Booking Date
                     </label>

                     <input
                        id="bookingDate"
                        name="bookingDate"
                        type="datetime-local"
                        required
                        className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                     />
                  </div>

                  <div className="space-y-2">
                     <label htmlFor="note" className="text-sm font-medium">
                        Note
                     </label>

                     <textarea
                        id="note"
                        name="note"
                        rows={4}
                        placeholder="Add any additional information..."
                        className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                     />
                  </div>

                  <button
                     type="submit"
                     disabled={createBookingMutation.isPending}
                     className="w-full rounded-md bg-primary px-4 py-2.5 font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  >
                     {createBookingMutation.isPending ? "Creating Booking..." : "Confirm Booking"}
                  </button>
               </form>
            </div>
         </div>
      </div>
   );
}

export default function CreateBookingPage() {
   return (
      <Suspense
         fallback={
            <div className="p-6">
               <p className="text-muted-foreground">Loading...</p>
            </div>
         }
      >
         <CreateBookingForm />
      </Suspense>
   );
}
