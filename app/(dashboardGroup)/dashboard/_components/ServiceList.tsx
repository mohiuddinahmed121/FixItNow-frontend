"use client";

import Link from "next/link";
import { useServices } from "@/hooks/use-services";

export default function ServiceList() {
   const { data, isLoading, isError, error } = useServices();

   if (isLoading) {
      return (
         <div className="rounded-lg border p-6">
            <p className="text-muted-foreground">Loading services...</p>
         </div>
      );
   }

   if (isError) {
      return (
         <div className="rounded-lg border p-6">
            <p className="text-red-500">
               {error instanceof Error ? error.message : "Failed to load services"}
            </p>
         </div>
      );
   }

   const services = data?.data ?? [];

   if (services.length === 0) {
      return (
         <div className="rounded-lg border p-6">
            <p className="text-muted-foreground">No services are available right now.</p>
         </div>
      );
   }

   return (
      <section className="space-y-4">
         <div>
            <h2 className="text-2xl font-bold">Available Services</h2>

            <p className="text-muted-foreground">
               Find professional technicians for your home services.
            </p>
         </div>

         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
               <div key={service.id} className="rounded-lg border p-6 shadow-sm">
                  <div className="mb-4">
                     <span className="rounded-full bg-muted px-3 py-1 text-xs">
                        {service.category.name}
                     </span>
                  </div>

                  <h3 className="text-xl font-semibold">{service.title}</h3>

                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                     {service.description}
                  </p>

                  <div className="mt-4 space-y-2 text-sm">
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

                     <p>
                        <span className="font-medium">Availability:</span>{" "}
                        {service.technicianProfile.isAvailable ? "Available" : "Unavailable"}
                     </p>
                  </div>

                  <Link
                     href={`/dashboard/services/${service.id}`}
                     className="mt-5 block rounded-md border px-4 py-2 text-center text-sm font-medium hover:bg-muted"
                  >
                     View Details
                  </Link>
               </div>
            ))}
         </div>
      </section>
   );
}
