"use client";

import Link from "next/link";
import { useServices, useDeleteService } from "@/hooks/use-services";
import { useMyTechnicianProfile } from "@/hooks/use-technician";
import { toast } from "sonner";

export default function MyServicesPage() {
   const { data: servicesData, isLoading: servicesLoading, isError: servicesError } = useServices();

   const {
      data: profileData,
      isLoading: profileLoading,
      isError: profileError,
   } = useMyTechnicianProfile();

   const deleteService = useDeleteService();

   if (servicesLoading || profileLoading) {
      return (
         <div className="p-6">
            <p className="text-muted-foreground">Loading your services...</p>
         </div>
      );
   }

   if (servicesError || profileError) {
      return (
         <div className="p-6">
            <div className="rounded-lg border p-6">
               <h1 className="text-xl font-semibold">Failed to load services</h1>

               <p className="mt-2 text-sm text-muted-foreground">Please try again later.</p>
            </div>
         </div>
      );
   }

   const services = servicesData?.data ?? [];
   const technicianProfile = profileData?.data;

   if (!technicianProfile) {
      return (
         <div className="p-6">
            <div className="rounded-lg border p-6">
               <h1 className="text-xl font-semibold">Technician profile not found</h1>
            </div>
         </div>
      );
   }

   const myServices = services.filter(
      (service) => service.technicianProfile.id === technicianProfile.id,
   );

   const handleDelete = (serviceId: string) => {
      const confirmed = window.confirm("Are you sure you want to delete this service?");

      if (!confirmed) return;

      deleteService.mutate(serviceId, {
         onSuccess: () => {
            toast.success("Service deleted successfully");
         },

         onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Failed to delete service");
         },
      });
   };

   return (
      <div className="space-y-6 p-6">
         <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
               <h1 className="text-3xl font-bold">My Services</h1>

               <p className="mt-2 text-muted-foreground">
                  Manage the services you provide to customers.
               </p>
            </div>

            <Link
               href="/technician-dashboard/services/create"
               className="w-fit rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
               + Create Service
            </Link>
         </div>

         {myServices.length === 0 ? (
            <div className="rounded-lg border p-8 text-center">
               <h2 className="text-xl font-semibold">No services yet</h2>

               <p className="mt-2 text-sm text-muted-foreground">
                  You have not created any services yet.
               </p>

               <Link
                  href="/technician-dashboard/services/create"
                  className="mt-5 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
               >
                  Create Your First Service
               </Link>
            </div>
         ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
               {myServices.map((service) => (
                  <div
                     key={service.id}
                     className="flex flex-col justify-between rounded-lg border p-5 shadow-sm"
                  >
                     <div>
                        <div className="flex items-start justify-between gap-3">
                           <h2 className="text-xl font-semibold">{service.title}</h2>

                           <span className="rounded-full bg-muted px-3 py-1 text-xs">
                              {service.category.name}
                           </span>
                        </div>

                        <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                           {service.description}
                        </p>

                        <p className="mt-4 text-2xl font-bold">${service.price}</p>
                     </div>

                     <div className="mt-6 flex flex-wrap gap-2">
                        <Link
                           href={`/dashboard/services/${service.id}`}
                           className="rounded-md border px-3 py-2 text-sm font-medium"
                        >
                           View
                        </Link>

                        <Link
                           href={`/technician-dashboard/services/${service.id}/edit`}
                           className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
                        >
                           Edit
                        </Link>

                        <button
                           type="button"
                           onClick={() => handleDelete(service.id)}
                           disabled={deleteService.isPending}
                           className="rounded-md border border-red-500 px-3 py-2 text-sm font-medium text-red-500 disabled:opacity-50"
                        >
                           {deleteService.isPending ? "Deleting..." : "Delete"}
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
}
