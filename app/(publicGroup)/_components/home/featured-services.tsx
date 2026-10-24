"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { SectionHeading } from "@/components/shared/section-heading";
import { ServiceCard, ServiceCardSkeleton } from "@/components/shared/service-card";
import { buttonVariants } from "@/components/ui/button";
import { useServices } from "@/hooks/use-services";

export function FeaturedServices() {
   const { data, isLoading, isError } = useServices();

   // Newest services first
   const services = [...(data?.data ?? [])]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8);

   if (isError || (!isLoading && services.length === 0)) return null;

   return (
      <section className="section-y bg-muted/40">
         <div className="container-page">
            <SectionHeading
               eyebrow="Latest services"
               title="Recently added services"
               description="Fresh listings from technicians on FixItNow."
            />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
               {isLoading
                  ? Array.from({ length: 4 }).map((_, i) => <ServiceCardSkeleton key={i} />)
                  : services.map((service) => <ServiceCard key={service.id} service={service} />)}
            </div>

            <div className="mt-10 text-center">
               <Link
                  href="/services"
                  className={buttonVariants({ variant: "outline", size: "lg" })}
               >
                  View all services
                  <ArrowRight />
               </Link>
            </div>
         </div>
      </section>
   );
}
