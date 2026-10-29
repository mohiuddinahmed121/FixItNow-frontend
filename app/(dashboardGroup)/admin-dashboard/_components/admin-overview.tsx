"use client";

import {
   AlertTriangle,
   CalendarCheck,
   DollarSign,
   Info,
   Sparkles,
   TrendingUp,
   Users,
   Wrench,
   type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { ChartCard } from "@/components/charts/chart-card";
import { formatMoney, formatMoneyFull } from "@/components/charts/chart-utils";
import { ColumnChart } from "@/components/charts/column-chart";
import { HBarChart } from "@/components/charts/hbar-chart";
import { LineChart } from "@/components/charts/line-chart";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminBookings, useAdminUsers } from "@/hooks/use-admin";
import {
   bookingDate,
   bookingsPerMonth,
   categoryCounts,
   computeInsights,
   lastMonths,
   monthToDate,
   paymentAmount,
   paymentDate,
   percentChange,
   revenuePerMonth,
   statusCounts,
   totalRevenue,
   type Insight,
} from "@/lib/admin-analytics";
import { cn } from "@/lib/utils";

type StatCardProps = {
   label: string;
   value: string;
   icon: LucideIcon;
   // Change against the same days of last month. Null when there is nothing to compare with.
   change?: number | null;
   hint?: string;
};

function StatCard({ label, value, icon: Icon, change, hint }: StatCardProps) {
   return (
      <div className="rounded-xl border border-border bg-card p-5">
         <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
               <p className="text-sm text-muted-foreground">{label}</p>
               <p className="mt-1 truncate text-3xl font-bold tracking-tight tabular-nums">
                  {value}
               </p>
            </div>

            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
               <Icon className="size-5" />
            </span>
         </div>

         <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            {change !== undefined && change !== null && change !== 0 && (
               <span
                  className={cn(
                     "inline-flex items-center gap-1 font-medium",
                     change > 0 ? "text-success" : "text-destructive",
                  )}
               >
                  <TrendingUp className={cn("size-3.5", change < 0 && "-scale-y-100")} />
                  {change > 0 ? "+" : ""}
                  {change}%
               </span>
            )}
            {hint}
         </p>
      </div>
   );
}

const INSIGHT_STYLE: Record<Insight["tone"], { icon: LucideIcon; className: string }> = {
   positive: { icon: TrendingUp, className: "text-success" },
   warning: { icon: AlertTriangle, className: "text-destructive" },
   info: { icon: Info, className: "text-primary" },
};

export function AdminOverview() {
   const users = useAdminUsers();
   const bookings = useAdminBookings();

   // Fixed once per visit so every number on the page uses the same "now"
   const [now] = useState(() => new Date());

   const loading = users.isLoading || bookings.isLoading;
   const failed = users.isError || bookings.isError;

   const analytics = useMemo(() => {
      const data = bookings.data ?? [];
      const months = lastMonths(6, now);
      const perMonth = bookingsPerMonth(data, months);
      const revenue = revenuePerMonth(data, months);

      return {
         months,
         perMonth,
         revenue,
         total: totalRevenue(data),
         bookingChange: monthToDate(data, now, bookingDate),
         revenueChange: monthToDate(data, now, paymentDate, paymentAmount),
         statuses: statusCounts(data),
         categories: categoryCounts(data),
         insights: computeInsights(data, months, perMonth, now),
         recent: [...data]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 6),
      };
   }, [bookings.data, now]);

   const refetch = () => {
      users.refetch();
      bookings.refetch();
   };

   if (failed) {
      return (
         <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card p-12 text-center">
            <AlertTriangle className="size-9 text-destructive" />
            <h2 className="text-lg font-semibold">We could not load the dashboard</h2>
            <p className="max-w-sm text-sm text-muted-foreground">
               {(users.error ?? bookings.error)?.message}
            </p>
            <Button size="lg" onClick={refetch}>
               Try again
            </Button>
         </div>
      );
   }

   const userList = users.data ?? [];
   const bookingList = bookings.data ?? [];
   const technicians = userList.filter((u) => u.role === "TECHNICIAN").length;
   const customers = userList.filter((u) => u.role === "CUSTOMER").length;

   const monthSeries = analytics.months.map((m, i) => ({
      label: m.label,
      fullLabel: m.fullLabel,
      value: analytics.perMonth[i],
   }));

   const revenueSeries = analytics.months.map((m, i) => ({
      label: m.label,
      fullLabel: m.fullLabel,
      value: analytics.revenue[i],
   }));

   return (
      <div className="space-y-6">
         {/* Overview cards */}
         <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {loading ? (
               Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)
            ) : (
               <>
                  <StatCard
                     label="Total users"
                     value={String(userList.length)}
                     icon={Users}
                     hint={`${customers} customers`}
                  />
                  <StatCard
                     label="Technicians"
                     value={String(technicians)}
                     icon={Wrench}
                     hint={`${userList.filter((u) => u.role === "TECHNICIAN" && u.activeStatus === "BLOCKED").length} blocked`}
                  />
                  <StatCard
                     label="Bookings"
                     value={String(bookingList.length)}
                     icon={CalendarCheck}
                     change={percentChange(
                        analytics.bookingChange.current,
                        analytics.bookingChange.previous,
                     )}
                     hint="vs same days last month"
                  />
                  <StatCard
                     label="Revenue"
                     value={formatMoneyFull(analytics.total)}
                     icon={DollarSign}
                     change={percentChange(
                        analytics.revenueChange.current,
                        analytics.revenueChange.previous,
                     )}
                     hint="completed payments"
                  />
               </>
            )}
         </div>

         {/* Automated insights, computed from the booking data */}
         {!loading && analytics.insights.length > 0 && (
            <section className="rounded-xl border border-border bg-card p-5">
               <div className="mb-4 flex items-center gap-2">
                  <Sparkles className="size-5 text-primary" />
                  <h2 className="font-semibold">Insights</h2>
                  <span className="text-sm text-muted-foreground">from your booking data</span>
               </div>

               <ul className="grid gap-3 lg:grid-cols-2">
                  {analytics.insights.map((insight) => {
                     const { icon: Icon, className } = INSIGHT_STYLE[insight.tone];

                     return (
                        <li key={insight.title} className="flex gap-3 rounded-lg bg-muted/50 p-3">
                           <Icon className={cn("mt-0.5 size-5 shrink-0", className)} />
                           <div>
                              <p className="text-sm font-medium">{insight.title}</p>
                              <p className="text-sm text-muted-foreground">{insight.detail}</p>
                           </div>
                        </li>
                     );
                  })}
               </ul>
            </section>
         )}

         {/* Charts */}
         <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard
               title="Bookings per month"
               subtitle="Last 6 months"
               loading={loading}
               table={{
                  headers: ["Month", "Bookings"],
                  rows: monthSeries.map((d) => [d.fullLabel, String(d.value)]),
               }}
            >
               <LineChart data={monthSeries} seriesName="Bookings" />
            </ChartCard>

            <ChartCard
               title="Revenue per month"
               subtitle="Completed payments, last 6 months"
               loading={loading}
               table={{
                  headers: ["Month", "Revenue"],
                  rows: revenueSeries.map((d) => [d.fullLabel, formatMoneyFull(d.value)]),
               }}
            >
               <ColumnChart
                  data={revenueSeries}
                  seriesName="Revenue"
                  formatTick={formatMoney}
                  formatValue={formatMoneyFull}
               />
            </ChartCard>

            <ChartCard
               title="Bookings by status"
               subtitle="All bookings"
               loading={loading}
               table={{
                  headers: ["Status", "Bookings"],
                  rows: analytics.statuses.map((d) => [d.label, String(d.value)]),
               }}
            >
               <HBarChart data={analytics.statuses} seriesName="Bookings" />
            </ChartCard>

            <ChartCard
               title="Most booked categories"
               subtitle="Top 6 by number of bookings"
               loading={loading}
               table={{
                  headers: ["Category", "Bookings"],
                  rows: analytics.categories.map((d) => [d.label, String(d.value)]),
               }}
            >
               <HBarChart data={analytics.categories} seriesName="Bookings" />
            </ChartCard>
         </div>

         {/* Recent bookings */}
         <section className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between gap-3 p-5">
               <div>
                  <h2 className="font-semibold">Recent bookings</h2>
                  <p className="text-sm text-muted-foreground">
                     The latest requests on the platform
                  </p>
               </div>

               <Link
                  href="/admin-dashboard/bookings"
                  className="text-sm font-medium text-primary hover:underline"
               >
                  View all
               </Link>
            </div>

            {loading ? (
               <div className="space-y-2 p-5 pt-0">
                  {Array.from({ length: 4 }, (_, i) => (
                     <Skeleton key={i} className="h-10 rounded-lg" />
                  ))}
               </div>
            ) : analytics.recent.length === 0 ? (
               <p className="px-5 pb-8 text-center text-sm text-muted-foreground">
                  No bookings yet. They will appear here as customers book technicians.
               </p>
            ) : (
               <div className="overflow-x-auto">
                  <table className="w-full min-w-[620px] text-left text-sm">
                     <thead>
                        <tr className="border-y border-border bg-muted/50 text-xs text-muted-foreground">
                           <th className="px-5 py-3 font-medium">Service</th>
                           <th className="px-5 py-3 font-medium">Customer</th>
                           <th className="px-5 py-3 font-medium">Date</th>
                           <th className="px-5 py-3 font-medium">Status</th>
                           <th className="px-5 py-3 text-right font-medium">Price</th>
                        </tr>
                     </thead>
                     <tbody>
                        {analytics.recent.map((booking) => (
                           <tr key={booking.id} className="border-b border-border last:border-0">
                              <td className="px-5 py-3 font-medium">{booking.service.title}</td>
                              <td className="px-5 py-3 text-muted-foreground">
                                 {booking.customer.name}
                              </td>
                              <td className="px-5 py-3 whitespace-nowrap text-muted-foreground">
                                 {new Date(booking.bookingDate).toLocaleDateString("en-GB", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                 })}
                              </td>
                              <td className="px-5 py-3">
                                 <StatusBadge status={booking.status} />
                              </td>
                              <td className="px-5 py-3 text-right tabular-nums">
                                 {formatMoneyFull(booking.service.price)}
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            )}
         </section>
      </div>
   );
}
