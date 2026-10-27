"use client";

import { useQuery } from "@tanstack/react-query";
import { CalendarCheck, Tags, UserX, Users, type LucideIcon } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { getAdminBookings, getAdminCategories, getAdminUsers } from "@/services/admin";

type Item = { label: string; value: number; icon: LucideIcon };

export function PlatformSummary() {
   const users = useQuery({ queryKey: ["admin-users"], queryFn: getAdminUsers });
   const bookings = useQuery({ queryKey: ["admin-bookings"], queryFn: getAdminBookings });
   const categories = useQuery({ queryKey: ["admin-categories"], queryFn: getAdminCategories });

   const loading = users.isLoading || bookings.isLoading || categories.isLoading;

   const userList: { activeStatus: string }[] = users.data?.data ?? [];

   const items: Item[] = [
      { label: "Total users", value: userList.length, icon: Users },
      {
         label: "Blocked users",
         value: userList.filter((u) => u.activeStatus === "BLOCKED").length,
         icon: UserX,
      },
      { label: "Total bookings", value: (bookings.data?.data ?? []).length, icon: CalendarCheck },
      { label: "Categories", value: (categories.data?.data ?? []).length, icon: Tags },
   ];

   // If every request failed there is nothing real to show, so the section stays hidden.
   if (!loading && !users.data?.success && !bookings.data?.success && !categories.data?.success) {
      return null;
   }

   return (
      <section aria-label="Platform summary" className="space-y-3">
         <h2 className="text-lg font-semibold">Platform at a glance</h2>

         <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {items.map(({ label, value, icon: Icon }) => (
               <div
                  key={label}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
               >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
                     <Icon className="size-5" />
                  </span>

                  <div>
                     {loading ? (
                        <Skeleton className="h-6 w-10" />
                     ) : (
                        <p className="text-2xl font-bold tabular-nums">{value}</p>
                     )}
                     <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
               </div>
            ))}
         </div>
      </section>
   );
}
