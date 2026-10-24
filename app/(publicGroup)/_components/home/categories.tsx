"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { CategoryIcon } from "@/components/shared/category-icon";
import { SectionHeading } from "@/components/shared/section-heading";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/use-categories";
import { useServices } from "@/hooks/use-services";

export function Categories() {
   const categories = useCategories();
   const services = useServices();

   const list = categories.data?.data ?? [];

   if (!categories.isLoading && list.length === 0) return null;

   const countFor = (categoryId: string) =>
      (services.data?.data ?? []).filter((s) => s.category.id === categoryId).length;

   return (
      <section className="section-y">
         <div className="container-page">
            <SectionHeading
               eyebrow="Categories"
               title="Find the right kind of help"
               description="Pick a category to see the technicians and services available for it."
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
               {categories.isLoading &&
                  Array.from({ length: 4 }).map((_, i) => (
                     <Skeleton key={i} className="h-36 rounded-xl" />
                  ))}

               {list.slice(0, 8).map((category) => {
                  const count = countFor(category.id);

                  return (
                     <Link
                        key={category.id}
                        href={`/services?category=${category.id}`}
                        className="group flex h-36 flex-col justify-between rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
                     >
                        <div className="flex items-start justify-between">
                           <span className="grid size-11 place-items-center rounded-xl bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                              <CategoryIcon name={category.name} className="size-5" />
                           </span>
                           <ArrowUpRight className="size-5 text-muted-foreground transition-colors group-hover:text-primary" />
                        </div>

                        <div>
                           <h3 className="truncate font-semibold">{category.name}</h3>
                           <p className="text-sm text-muted-foreground">
                              {services.isLoading
                                 ? "Loading..."
                                 : `${count} ${count === 1 ? "service" : "services"}`}
                           </p>
                        </div>
                     </Link>
                  );
               })}
            </div>
         </div>
      </section>
   );
}
