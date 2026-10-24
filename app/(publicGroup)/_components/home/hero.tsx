"use client";

import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/use-categories";
import { cn } from "@/lib/utils";

export function Hero() {
   const router = useRouter();
   const { data, isLoading } = useCategories();
   const categories = data?.data ?? [];

   const [query, setQuery] = useState("");
   const [index, setIndex] = useState(0);

   // Rotates through the real category names every 2.5s
   useEffect(() => {
      if (categories.length < 2) return;

      const timer = setInterval(() => setIndex((i) => (i + 1) % categories.length), 2500);

      return () => clearInterval(timer);
   }, [categories.length]);

   const current = categories.length ? categories[index % categories.length].name : "home repairs";

   const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const value = query.trim();

      router.push(value ? `/services?search=${encodeURIComponent(value)}` : "/services");
   };

   return (
      <section className="relative overflow-hidden border-b border-border bg-linear-to-b from-accent/60 via-background to-background">
         <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-primary/10 blur-3xl"
         />
         <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -left-24 size-96 rounded-full bg-cta/10 blur-3xl"
         />

         <div className="container-page relative flex min-h-[60svh] flex-col items-center justify-center gap-6 py-14 text-center lg:h-[65svh] lg:min-h-[500px]">
            <span className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground">
               Trusted home service professionals
            </span>

            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
               Book expert help for
               <span
                  key={current}
                  className="mt-1 block animate-in fade-in slide-in-from-bottom-2 text-primary duration-500"
               >
                  {current}
               </span>
            </h1>

            <p className="max-w-xl text-lg text-muted-foreground text-pretty">
               Compare technicians by price, experience and location, book in a few clicks, and pay
               securely online.
            </p>

            <form
               onSubmit={handleSearch}
               role="search"
               className="flex w-full max-w-xl items-center gap-2 rounded-xl border border-border bg-card p-2 shadow-sm"
            >
               <Search className="ml-2 size-5 shrink-0 text-muted-foreground" />
               <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  type="search"
                  aria-label="Search services"
                  placeholder="What do you need help with?"
                  className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm outline-none placeholder:text-muted-foreground"
               />
               <Button
                  type="submit"
                  size="lg"
                  className="bg-cta px-4 text-cta-foreground hover:bg-cta/90"
               >
                  Search
               </Button>
            </form>

            <div className="flex max-w-2xl flex-wrap items-center justify-center gap-2">
               {isLoading &&
                  Array.from({ length: 4 }).map((_, i) => (
                     <Skeleton key={i} className="h-8 w-24 rounded-full" />
                  ))}

               {categories.slice(0, 6).map((category) => (
                  <Link
                     key={category.id}
                     href={`/services?category=${category.id}`}
                     className="rounded-full border border-border bg-card px-3 py-1.5 text-sm transition-colors hover:border-primary hover:text-primary"
                  >
                     {category.name}
                  </Link>
               ))}
            </div>

            <Link
               href="/services"
               className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "text-primary")}
            >
               Browse all services
               <ArrowRight />
            </Link>
         </div>
      </section>
   );
}
