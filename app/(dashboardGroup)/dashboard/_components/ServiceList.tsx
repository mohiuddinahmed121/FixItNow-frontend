"use client";

import { useServices } from "@/hooks/use-services";
import Link from "next/link";

export default function ServiceList() {
   const { data, isLoading, isError } = useServices();

   if (isLoading) {
      return <div className="py-10 text-center text-muted-foreground">Loading services...</div>;
   }

   if (isError || !data?.success) {
      return (
         <div className="rounded-lg border p-6 text-center">
            <p className="text-red-500">Failed to load services.</p>
         </div>
      );
   }

   if (data.data.length === 0) {
      return (
         <div className="rounded-lg border p-6 text-center">
            <p className="text-muted-foreground">No services are available right now.</p>
         </div>
      );
   }

   return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
         {data.data.map((service) => (
            <div
               key={service.id}
               className="rounded-lg border p-5 transition-shadow hover:shadow-md"
            >
               <div className="space-y-3">
                  <div>
                     <h3 className="text-lg font-semibold">{service.title}</h3>

                     <p className="text-sm text-muted-foreground">{service.category.name}</p>
                  </div>

                  <p className="line-clamp-3 text-sm text-muted-foreground">
                     {service.description}
                  </p>

                  <div className="flex items-center justify-between">
                     <span className="font-semibold">${service.price}</span>

                     <span className="text-sm text-muted-foreground">
                        {service.technicianProfile.user.name}
                     </span>
                  </div>

                  <Link
                     href={`/services/${service.id}`}
                     className="block rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground"
                  >
                     View Details
                  </Link>
               </div>
            </div>
         ))}
      </div>
   );
}
