"use client";

import { RotateCcw, SearchX, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

import { Pagination } from "@/components/shared/pagination";
import { ServiceCard, ServiceCardSkeleton } from "@/components/shared/service-card";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/use-categories";
import { useServices } from "@/hooks/use-services";
import { matchesSearch } from "@/lib/search";
import { cn } from "@/lib/utils";
import type { Service } from "@/services/service";
import { SearchBox } from "./search-box";

const PAGE_SIZE = 12;

const SORT_OPTIONS = [
   { value: "newest", label: "Newest first" },
   { value: "price-asc", label: "Price: low to high" },
   { value: "price-desc", label: "Price: high to low" },
   { value: "experience", label: "Most experienced" },
   { value: "title", label: "Title: A to Z" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

type Filters = {
   search: string;
   category: string;
   location: string;
   minPrice: string;
   maxPrice: string;
   minExperience: string;
   onlyAvailable: boolean;
   sort: SortValue;
   page: number;
};

const selectClass =
   "h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

function sortServices(list: Service[], sort: SortValue): Service[] {
   const sorted = [...list];

   switch (sort) {
      case "price-asc":
         return sorted.sort((a, b) => a.price - b.price);
      case "price-desc":
         return sorted.sort((a, b) => b.price - a.price);
      case "experience":
         return sorted.sort(
            (a, b) => b.technicianProfile.experience - a.technicianProfile.experience,
         );
      case "title":
         return sorted.sort((a, b) => a.title.localeCompare(b.title));
      default:
         return sorted.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
   }
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
   return (
      <label className="block space-y-1.5">
         <span className="text-xs font-medium text-muted-foreground">{label}</span>
         {children}
      </label>
   );
}

export function ServicesExplorer({
   initialSearch,
   initialCategory,
}: {
   initialSearch: string;
   initialCategory: string;
}) {
   const services = useServices();
   const categories = useCategories();

   const [filtersOpen, setFiltersOpen] = useState(false);
   const [filters, setFilters] = useState<Filters>({
      search: initialSearch,
      category: initialCategory,
      location: "",
      minPrice: "",
      maxPrice: "",
      minExperience: "",
      onlyAvailable: false,
      sort: "newest",
      page: 1,
   });

   // Any filter change sends the user back to page 1
   const update = (patch: Partial<Omit<Filters, "page">>) =>
      setFilters((current) => ({ ...current, ...patch, page: 1 }));

   const all = useMemo(() => services.data?.data ?? [], [services.data]);
   const categoryList = categories.data?.data ?? [];

   const locations = useMemo(
      () => [...new Set(all.map((s) => s.technicianProfile.location))].sort(),
      [all],
   );

   const filtered = useMemo(() => {
      const min = filters.minPrice === "" ? null : Number(filters.minPrice);
      const max = filters.maxPrice === "" ? null : Number(filters.maxPrice);
      const minExp = filters.minExperience === "" ? 0 : Number(filters.minExperience);

      const result = all.filter((service) => {
         const tech = service.technicianProfile;

         if (!matchesSearch(service, filters.search)) return false;
         if (filters.category && service.category.id !== filters.category) return false;
         if (filters.location && tech.location !== filters.location) return false;
         if (min !== null && service.price < min) return false;
         if (max !== null && service.price > max) return false;
         if (tech.experience < minExp) return false;
         if (filters.onlyAvailable && !tech.isAvailable) return false;

         return true;
      });

      return sortServices(result, filters.sort);
   }, [all, filters]);

   const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
   const page = Math.min(filters.page, totalPages);
   const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

   const activeCount = [
      filters.category,
      filters.location,
      filters.minPrice,
      filters.maxPrice,
      filters.minExperience,
      filters.onlyAvailable,
   ].filter(Boolean).length;

   const hasAnyFilter = activeCount > 0 || filters.search.trim() !== "";

   const reset = () =>
      setFilters((current) => ({
         ...current,
         search: "",
         category: "",
         location: "",
         minPrice: "",
         maxPrice: "",
         minExperience: "",
         onlyAvailable: false,
         page: 1,
      }));

   const changePage = (next: number) => {
      setFilters((current) => ({ ...current, page: next }));
      window.scrollTo({ top: 0, behavior: "smooth" });
   };

   return (
      <>
         <section className="border-b border-border bg-linear-to-b from-accent/60 to-background">
            <div className="container-page space-y-6 py-12 text-center">
               <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Our Services</h1>
                  <p className="text-muted-foreground">
                     Find the right professional for your home, then book in a few clicks.
                  </p>
               </div>

               <div className="mx-auto max-w-2xl text-left">
                  <SearchBox
                     value={filters.search}
                     onChange={(search) => update({ search })}
                     services={all}
                     categories={categoryList}
                  />
               </div>
            </div>
         </section>

         <section className="container-page space-y-6 py-8">
            {/* Filters */}
            <div className="rounded-xl border border-border bg-card p-4">
               <div className="flex items-center justify-between lg:hidden">
                  <Button
                     variant="outline"
                     size="lg"
                     aria-expanded={filtersOpen}
                     onClick={() => setFiltersOpen((open) => !open)}
                  >
                     <SlidersHorizontal />
                     Filters{activeCount > 0 ? ` (${activeCount})` : ""}
                  </Button>
               </div>

               <div
                  className={cn(
                     "grid gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:items-end",
                     filtersOpen ? "mt-4 grid" : "hidden lg:grid",
                  )}
               >
                  <Field label="Category">
                     <select
                        className={selectClass}
                        value={filters.category}
                        onChange={(event) => update({ category: event.target.value })}
                     >
                        <option value="">All categories</option>
                        {categoryList.map((category) => (
                           <option key={category.id} value={category.id}>
                              {category.name}
                           </option>
                        ))}
                     </select>
                  </Field>

                  <Field label="Location">
                     <select
                        className={selectClass}
                        value={filters.location}
                        onChange={(event) => update({ location: event.target.value })}
                     >
                        <option value="">All locations</option>
                        {locations.map((location) => (
                           <option key={location} value={location}>
                              {location}
                           </option>
                        ))}
                     </select>
                  </Field>

                  <Field label="Min price ($)">
                     <input
                        type="number"
                        min={0}
                        inputMode="numeric"
                        placeholder="0"
                        className={selectClass}
                        value={filters.minPrice}
                        onChange={(event) => update({ minPrice: event.target.value })}
                     />
                  </Field>

                  <Field label="Max price ($)">
                     <input
                        type="number"
                        min={0}
                        inputMode="numeric"
                        placeholder="Any"
                        className={selectClass}
                        value={filters.maxPrice}
                        onChange={(event) => update({ maxPrice: event.target.value })}
                     />
                  </Field>

                  <Field label="Experience">
                     <select
                        className={selectClass}
                        value={filters.minExperience}
                        onChange={(event) => update({ minExperience: event.target.value })}
                     >
                        <option value="">Any experience</option>
                        <option value="2">2+ years</option>
                        <option value="5">5+ years</option>
                        <option value="10">10+ years</option>
                     </select>
                  </Field>

                  <label className="flex h-9 cursor-pointer items-center gap-2 text-sm">
                     <input
                        type="checkbox"
                        className="size-4 accent-primary"
                        checked={filters.onlyAvailable}
                        onChange={(event) => update({ onlyAvailable: event.target.checked })}
                     />
                     Available only
                  </label>
               </div>
            </div>

            {/* Result bar */}
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
               <p className="text-sm text-muted-foreground" aria-live="polite">
                  {services.isLoading
                     ? "Loading services..."
                     : `${filtered.length} ${filtered.length === 1 ? "service" : "services"} found`}
               </p>

               <div className="flex items-center gap-2">
                  {hasAnyFilter && (
                     <Button variant="ghost" size="lg" onClick={reset}>
                        <RotateCcw />
                        Reset
                     </Button>
                  )}

                  <select
                     aria-label="Sort services"
                     className={cn(selectClass, "w-auto min-w-44")}
                     value={filters.sort}
                     onChange={(event) => update({ sort: event.target.value as SortValue })}
                  >
                     {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                           {option.label}
                        </option>
                     ))}
                  </select>
               </div>
            </div>

            {/* Results */}
            {services.isError ? (
               <div className="rounded-xl border border-border bg-card p-10 text-center">
                  <h2 className="text-lg font-semibold">We could not load services</h2>
                  <p className="mt-2 text-sm text-destructive">
                     {services.error instanceof Error
                        ? services.error.message
                        : "Something went wrong. Please try again."}
                  </p>
                  <Button className="mt-4" onClick={() => services.refetch()}>
                     Try again
                  </Button>
               </div>
            ) : services.isLoading ? (
               <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                     <ServiceCardSkeleton key={i} />
                  ))}
               </div>
            ) : filtered.length === 0 ? (
               <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card p-12 text-center">
                  <SearchX className="size-10 text-muted-foreground" />
                  <h2 className="text-lg font-semibold">No services match your filters</h2>
                  <p className="max-w-sm text-sm text-muted-foreground">
                     {all.length === 0
                        ? "There are no services listed yet. Please check back soon."
                        : "Try a different search word or loosen some filters."}
                  </p>
                  {hasAnyFilter && (
                     <Button variant="outline" size="lg" onClick={reset}>
                        <RotateCcw />
                        Reset filters
                     </Button>
                  )}
               </div>
            ) : (
               <>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                     {visible.map((service) => (
                        <ServiceCard key={service.id} service={service} />
                     ))}
                  </div>

                  <Pagination
                     page={page}
                     totalPages={totalPages}
                     onPageChange={changePage}
                     className="pt-4"
                  />
               </>
            )}
         </section>
      </>
   );
}
