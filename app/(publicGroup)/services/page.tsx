"use client";

import Link from "next/link";
import { useServices } from "@/hooks/use-services";

export default function ServicesPage() {
   const { data, isLoading, isError, error } = useServices();

   if (isLoading) {
      return (
         <div className="min-h-screen p-6">
            <div className="mx-auto max-w-6xl">
               <p className="text-muted-foreground">Loading services...</p>
            </div>
         </div>
      );
   }

   if (isError) {
      return (
         <div className="min-h-screen p-6">
            <div className="mx-auto max-w-6xl">
               <div className="rounded-lg border p-6">
                  <h1 className="text-xl font-semibold">Failed to load services</h1>

                  <p className="mt-2 text-sm text-red-500">
                     {error instanceof Error
                        ? error.message
                        : "Something went wrong while loading services."}
                  </p>
               </div>
            </div>
         </div>
      );
   }

   const services = data?.data ?? [];

   return (
      <div className="min-h-screen p-6">
         <div className="mx-auto max-w-6xl space-y-8">
            {/* Header */}
            <div>
               <h1 className="text-4xl font-bold">Our Services</h1>

               <p className="mt-2 text-muted-foreground">
                  Find the right professional service for your needs.
               </p>
            </div>

            {/* Services */}
            {services.length === 0 ? (
               <div className="rounded-lg border p-10 text-center">
                  <h2 className="text-xl font-semibold">No services available</h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                     There are currently no services available.
                  </p>
               </div>
            ) : (
               <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {services.map((service) => (
                     <div
                        key={service.id}
                        className="flex flex-col justify-between rounded-lg border p-6 shadow-sm transition hover:shadow-md"
                     >
                        <div>
                           {/* Category */}
                           <span className="inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium">
                              {service.category.name}
                           </span>

                           {/* Title */}
                           <h2 className="mt-4 text-xl font-semibold">{service.title}</h2>

                           {/* Description */}
                           <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                              {service.description}
                           </p>

                           {/* Price */}
                           <p className="mt-5 text-2xl font-bold">${service.price}</p>

                           {/* Technician */}
                           <div className="mt-5 border-t pt-4">
                              <p className="text-sm font-medium">
                                 {service.technicianProfile.user.name}
                              </p>

                              <p className="mt-1 text-sm text-muted-foreground">
                                 {service.technicianProfile.location}
                              </p>

                              <p className="mt-1 text-sm text-muted-foreground">
                                 {service.technicianProfile.experience} years experience
                              </p>

                              <p
                                 className={`mt-2 text-sm font-medium ${
                                    service.technicianProfile.isAvailable
                                       ? "text-green-600"
                                       : "text-red-500"
                                 }`}
                              >
                                 {service.technicianProfile.isAvailable
                                    ? "Available"
                                    : "Currently unavailable"}
                              </p>
                           </div>
                        </div>

                        {/* Button */}
                        <Link
                           href={`/dashboard/services/${service.id}`}
                           className="mt-6 rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground"
                        >
                           View Service
                        </Link>
                     </div>
                  ))}
               </div>
            )}
         </div>
      </div>
   );
}
