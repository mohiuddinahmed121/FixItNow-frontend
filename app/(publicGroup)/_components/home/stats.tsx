"use client";

import { CheckCircle2, Layers, Users, Wrench, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/use-categories";
import { useServices } from "@/hooks/use-services";

function CountUp({ value }: { value: number }) {
   const ref = useRef<HTMLSpanElement>(null);
   const [display, setDisplay] = useState(0);

   useEffect(() => {
      const element = ref.current;

      if (!element) return;

      let frame = 0;

      const observer = new IntersectionObserver(
         ([entry]) => {
            if (!entry.isIntersecting) return;

            observer.disconnect();

            const start = performance.now();
            const duration = 1200;

            const tick = (now: number) => {
               const progress = Math.min((now - start) / duration, 1);

               setDisplay(Math.round(value * (1 - Math.pow(1 - progress, 3))));

               if (progress < 1) frame = requestAnimationFrame(tick);
            };

            frame = requestAnimationFrame(tick);
         },
         { threshold: 0.4 },
      );

      observer.observe(element);

      return () => {
         observer.disconnect();
         cancelAnimationFrame(frame);
      };
   }, [value]);

   return <span ref={ref}>{display}</span>;
}

export function Stats() {
   const services = useServices();
   const categories = useCategories();

   const list = services.data?.data ?? [];

   const technicians = new Map(list.map((s) => [s.technicianProfile.id, s.technicianProfile]));

   const items: { label: string; value: number; icon: LucideIcon }[] = [
      { label: "Services listed", value: list.length, icon: Wrench },
      { label: "Categories", value: categories.data?.data.length ?? 0, icon: Layers },
      { label: "Active technicians", value: technicians.size, icon: Users },
      {
         label: "Available right now",
         value: [...technicians.values()].filter((t) => t.isAvailable).length,
         icon: CheckCircle2,
      },
   ];

   const loading = services.isLoading || categories.isLoading;

   if (!loading && list.length === 0) return null;

   return (
      <section className="border-b border-border bg-card">
         <div className="container-page grid grid-cols-2 gap-6 py-10 lg:grid-cols-4">
            {items.map(({ label, value, icon: Icon }) => (
               <div key={label} className="flex items-center gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
                     <Icon className="size-6" />
                  </span>

                  <div>
                     {loading ? (
                        <Skeleton className="h-8 w-16" />
                     ) : (
                        <p className="text-3xl font-bold tabular-nums">
                           <CountUp value={value} />
                        </p>
                     )}
                     <p className="text-sm text-muted-foreground">{label}</p>
                  </div>
               </div>
            ))}
         </div>
      </section>
   );
}
