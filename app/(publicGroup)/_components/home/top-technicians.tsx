"use client";

import { Briefcase, MapPin } from "lucide-react";
import Link from "next/link";

import { SectionHeading } from "@/components/shared/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useServices } from "@/hooks/use-services";
import { getTopTechnicians } from "@/lib/technicians";
import { cn } from "@/lib/utils";

export function TopTechnicians() {
   const { data, isLoading, isError } = useServices();

   const technicians = getTopTechnicians(data?.data ?? [], 4);

   if (isError || (!isLoading && technicians.length === 0)) return null;

   return (
      <section className="section-y">
         <div className="container-page">
            <SectionHeading
               eyebrow="Our technicians"
               title="Meet experienced professionals"
               description="Ranked by availability and years of experience."
            />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
               {isLoading &&
                  Array.from({ length: 4 }).map((_, i) => (
                     <Skeleton key={i} className="h-72 rounded-xl" />
                  ))}

               {technicians.map(({ profile, firstServiceId, serviceCount }) => (
                  <article
                     key={profile.id}
                     className="flex h-full flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center"
                  >
                     <span className="grid size-16 place-items-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                        {profile.user.name.charAt(0).toUpperCase()}
                     </span>

                     <div className="w-full">
                        <h3 className="truncate font-semibold">{profile.user.name}</h3>
                        <p
                           className={cn(
                              "text-xs font-medium",
                              profile.isAvailable ? "text-success" : "text-muted-foreground",
                           )}
                        >
                           {profile.isAvailable ? "Available now" : "Currently unavailable"}
                        </p>
                     </div>

                     <ul className="w-full space-y-1.5 text-sm text-muted-foreground">
                        <li className="flex items-center justify-center gap-2">
                           <MapPin className="size-4 shrink-0 text-primary" />
                           <span className="truncate">{profile.location}</span>
                        </li>
                        <li className="flex items-center justify-center gap-2">
                           <Briefcase className="size-4 shrink-0 text-primary" />
                           {profile.experience} yrs &middot; {serviceCount}{" "}
                           {serviceCount === 1 ? "service" : "services"}
                        </li>
                     </ul>

                     <div className="flex min-h-14 flex-wrap content-start justify-center gap-1.5">
                        {profile.skills.slice(0, 3).map((skill) => (
                           <span
                              key={skill}
                              className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground"
                           >
                              {skill}
                           </span>
                        ))}
                     </div>

                     <Link
                        href={`/services/${firstServiceId}`}
                        className={cn(
                           buttonVariants({ variant: "outline", size: "lg" }),
                           "mt-auto w-full",
                        )}
                     >
                        View Services
                     </Link>
                  </article>
               ))}
            </div>
         </div>
      </section>
   );
}
