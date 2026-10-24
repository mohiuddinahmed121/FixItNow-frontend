import { Briefcase, MapPin } from "lucide-react";
import Link from "next/link";

import { CategoryIcon } from "@/components/shared/category-icon";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Service } from "@/services/service";

/*
  One card size for the whole project: fixed image height, clamped text, and the
  footer pinned to the bottom, so every card in a row is exactly the same height.
*/
export function ServiceCard({ service }: { service: Service }) {
   const { technicianProfile: tech } = service;

   return (
      <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg">
         <div className="relative grid h-40 shrink-0 place-items-center bg-linear-to-br from-primary/15 via-accent to-cta/15">
            <CategoryIcon
               name={service.category.name}
               className="size-14 text-primary/70 transition-transform duration-300 group-hover:scale-110"
            />

            <span className="absolute top-3 left-3 max-w-[60%] truncate rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium">
               {service.category.name}
            </span>

            <span
               className={cn(
                  "absolute top-3 right-3 rounded-full px-2.5 py-1 text-xs font-medium",
                  tech.isAvailable
                     ? "bg-success text-success-foreground"
                     : "bg-muted text-muted-foreground",
               )}
            >
               {tech.isAvailable ? "Available" : "Unavailable"}
            </span>
         </div>

         <div className="flex flex-1 flex-col gap-3 p-4">
            <h3 className="line-clamp-1 text-base font-semibold">{service.title}</h3>

            <p className="line-clamp-2 min-h-10 text-sm text-muted-foreground">
               {service.description}
            </p>

            <ul className="mt-auto space-y-1.5 text-sm text-muted-foreground">
               <li className="flex items-center gap-2">
                  <MapPin className="size-4 shrink-0 text-primary" />
                  <span className="truncate">{tech.location}</span>
               </li>
               <li className="flex items-center gap-2">
                  <Briefcase className="size-4 shrink-0 text-primary" />
                  <span className="truncate">
                     {tech.user.name} &middot; {tech.experience} yrs experience
                  </span>
               </li>
            </ul>

            <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
               <p className="text-lg font-bold">${service.price}</p>

               <Link
                  href={`/services/${service.id}`}
                  className={buttonVariants({ size: "lg", className: "px-3" })}
               >
                  View Details
               </Link>
            </div>
         </div>
      </article>
   );
}

export function ServiceCardSkeleton() {
   return (
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
         <Skeleton className="h-40 rounded-none" />
         <div className="flex flex-1 flex-col gap-3 p-4">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-10 w-full" />
            <div className="mt-auto space-y-2">
               <Skeleton className="h-4 w-1/2" />
               <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="flex items-center justify-between border-t border-border pt-3">
               <Skeleton className="h-6 w-14" />
               <Skeleton className="h-8 w-24" />
            </div>
         </div>
      </div>
   );
}
