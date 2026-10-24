"use client";

import { useQueries } from "@tanstack/react-query";
import { Quote, Star } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { Skeleton } from "@/components/ui/skeleton";
import { useServices } from "@/hooks/use-services";
import { getTopTechnicians } from "@/lib/technicians";
import { reviewService } from "@/services/review";

export function Reviews() {
   const services = useServices();

   const technicians = getTopTechnicians(services.data?.data ?? [], 6);

   const results = useQueries({
      queries: technicians.map(({ profile }) => ({
         queryKey: ["reviews", profile.id],
         queryFn: () => reviewService.getTechnicianReviews(profile.id),
      })),
   });

   const loading = services.isLoading || results.some((r) => r.isLoading);

   const reviews = results
      .flatMap((result, i) =>
         (result.data?.data.reviews ?? []).map((review) => ({
            ...review,
            technicianName: technicians[i].profile.user.name,
         })),
      )
      .filter((review) => review.comment?.trim() && review.rating >= 4)
      .sort((a, b) => b.rating - a.rating || +new Date(b.createdAt) - +new Date(a.createdAt))
      .slice(0, 3);

   // No real reviews yet: hide the section instead of showing made-up quotes.
   if (!loading && reviews.length === 0) return null;

   return (
      <section className="section-y bg-muted/40">
         <div className="container-page">
            <SectionHeading
               eyebrow="Customer reviews"
               title="What customers say"
               description="Real reviews from customers who completed a booking."
            />

            <div className="grid gap-6 md:grid-cols-3">
               {loading &&
                  Array.from({ length: 3 }).map((_, i) => (
                     <Skeleton key={i} className="h-56 rounded-xl" />
                  ))}

               {reviews.map((review) => (
                  <figure
                     key={review.id}
                     className="flex h-full flex-col gap-4 rounded-xl border border-border bg-card p-6"
                  >
                     <Quote className="size-8 text-primary/40" />

                     <div className="flex gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                        {Array.from({ length: 5 }).map((_, i) => (
                           <Star
                              key={i}
                              className={
                                 i < review.rating
                                    ? "size-4 fill-cta text-cta"
                                    : "size-4 text-muted-foreground/40"
                              }
                           />
                        ))}
                     </div>

                     <blockquote className="line-clamp-5 text-sm text-pretty">
                        {review.comment}
                     </blockquote>

                     <figcaption className="mt-auto flex items-center gap-3 border-t border-border pt-4">
                        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                           {review.customer.name.charAt(0).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                           <p className="truncate text-sm font-semibold">{review.customer.name}</p>
                           <p className="truncate text-xs text-muted-foreground">
                              Service by {review.technicianName}
                           </p>
                        </div>
                     </figcaption>
                  </figure>
               ))}
            </div>
         </div>
      </section>
   );
}
