import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Cta() {
   return (
      <section className="section-y pt-0 md:pt-0 lg:pt-0">
         <div className="container-page">
            <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12">
               <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-20 -right-20 size-72 rounded-full bg-primary-foreground/10 blur-2xl"
               />

               <div className="relative mx-auto max-w-2xl space-y-4">
                  <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
                     Ready to get your home fixed?
                  </h2>
                  <p className="text-primary-foreground/80 text-pretty">
                     Create a free account to book a technician, or join as a technician and start
                     receiving booking requests.
                  </p>

                  <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
                     <Link
                        href="/register"
                        className={cn(
                           buttonVariants({ size: "lg" }),
                           "h-10 bg-cta px-5 text-cta-foreground hover:bg-cta/90",
                        )}
                     >
                        Get started free
                        <ArrowRight />
                     </Link>

                     <Link
                        href="/services"
                        className={cn(
                           buttonVariants({ variant: "outline", size: "lg" }),
                           "h-10 border-primary-foreground/30 bg-transparent px-5 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground",
                        )}
                     >
                        Browse services
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}
