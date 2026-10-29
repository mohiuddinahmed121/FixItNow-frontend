import type { AdminBooking, BookingStatus } from "@/types/admin";

export const STATUS_LABEL: Record<BookingStatus, string> = {
   REQUESTED: "Requested",
   ACCEPTED: "Accepted",
   DECLINED: "Declined",
   PAID: "Paid",
   IN_PROGRESS: "In progress",
   COMPLETED: "Completed",
   CANCELED: "Canceled",
};

export type MonthBucket = {
   key: string;
   label: string;
   fullLabel: string;
   start: Date;
   end: Date;
};

// The last `count` calendar months, oldest first, ending with the month of `now`.
export function lastMonths(count: number, now: Date): MonthBucket[] {
   return Array.from({ length: count }, (_, i) => {
      const start = new Date(now.getFullYear(), now.getMonth() - (count - 1 - i), 1);
      const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);

      return {
         key: `${start.getFullYear()}-${start.getMonth()}`,
         label: start.toLocaleDateString("en-US", { month: "short" }),
         fullLabel: start.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
         start,
         end,
      };
   });
}

function bucketIndex(date: Date, months: MonthBucket[]): number {
   return months.findIndex((m) => date >= m.start && date < m.end);
}

export function bookingsPerMonth(bookings: AdminBooking[], months: MonthBucket[]): number[] {
   const counts = months.map(() => 0);

   for (const booking of bookings) {
      const index = bucketIndex(new Date(booking.createdAt), months);

      if (index >= 0) counts[index] += 1;
   }

   return counts;
}

// Revenue counts only payments that Stripe has completed.
export function revenuePerMonth(bookings: AdminBooking[], months: MonthBucket[]): number[] {
   const totals = months.map(() => 0);

   for (const booking of bookings) {
      const payment = booking.payment;

      if (!payment || payment.status !== "COMPLETED") continue;

      const index = bucketIndex(new Date(payment.paidAt ?? payment.createdAt), months);

      if (index >= 0) totals[index] += payment.amount;
   }

   return totals;
}

export function totalRevenue(bookings: AdminBooking[]): number {
   return bookings.reduce(
      (sum, b) => (b.payment?.status === "COMPLETED" ? sum + b.payment.amount : sum),
      0,
   );
}

export function statusCounts(bookings: AdminBooking[]): { label: string; value: number }[] {
   const counts = new Map<BookingStatus, number>();

   for (const booking of bookings) {
      counts.set(booking.status, (counts.get(booking.status) ?? 0) + 1);
   }

   return [...counts.entries()]
      .map(([status, value]) => ({ label: STATUS_LABEL[status], value }))
      .sort((a, b) => b.value - a.value);
}

export function categoryCounts(
   bookings: AdminBooking[],
   limit = 6,
): { label: string; value: number }[] {
   const counts = new Map<string, number>();

   for (const booking of bookings) {
      const name = booking.service.category.name;

      counts.set(name, (counts.get(name) ?? 0) + 1);
   }

   return [...counts.entries()]
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, limit);
}

// Percentage change, or null when there is no earlier value to compare with.
export function percentChange(current: number, previous: number): number | null {
   if (previous <= 0) return null;

   return Math.round(((current - previous) / previous) * 100);
}

/*
  Fair month comparison: this month so far against the same number of days last month,
  so a month that is only 3 days old is never compared with a full month.
*/
export function monthToDate<T>(
   items: T[],
   now: Date,
   getDate: (item: T) => Date | null,
   getValue: (item: T) => number = () => 1,
): { current: number; previous: number } {
   const currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
   const previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

   const elapsed = now.getTime() - currentStart.getTime();
   const previousEnd = new Date(
      Math.min(previousStart.getTime() + elapsed, currentStart.getTime()),
   );

   let current = 0;
   let previous = 0;

   for (const item of items) {
      const date = getDate(item);

      if (!date) continue;

      if (date >= currentStart && date <= now) current += getValue(item);
      else if (date >= previousStart && date <= previousEnd) previous += getValue(item);
   }

   return { current, previous };
}

export const bookingDate = (b: AdminBooking) => new Date(b.createdAt);

export const paymentDate = (b: AdminBooking) =>
   b.payment?.status === "COMPLETED" ? new Date(b.payment.paidAt ?? b.payment.createdAt) : null;

export const paymentAmount = (b: AdminBooking) => b.payment?.amount ?? 0;

export type Insight = {
   tone: "positive" | "warning" | "info";
   title: string;
   detail: string;
};

function meanAndDeviation(values: number[]) {
   const mean = values.reduce((a, b) => a + b, 0) / values.length;
   const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;

   return { mean, deviation: Math.sqrt(variance) };
}

/*
  Rule-based insights computed from the real booking data (no external AI service).
  The anomaly check is a z-score: how far the last complete month is from the months before it.
*/
export function computeInsights(
   bookings: AdminBooking[],
   months: MonthBucket[],
   perMonth: number[],
   now: Date,
): Insight[] {
   if (bookings.length === 0) return [];

   const insights: Insight[] = [];
   const last = perMonth.length - 1;

   // 1. This month so far, against the same days last month
   const mtd = monthToDate(bookings, now, bookingDate);
   const change = percentChange(mtd.current, mtd.previous);

   if (change !== null && change !== 0 && mtd.current + mtd.previous >= 4) {
      insights.push({
         tone: change > 0 ? "positive" : "info",
         title: `Bookings ${change > 0 ? "up" : "down"} ${Math.abs(change)}% on the same days last month`,
         detail: `${mtd.current} so far in ${months[last].fullLabel}, compared with ${mtd.previous} over the same days of ${months[last - 1].fullLabel}.`,
      });
   }

   // 2. Anomaly: last complete month against the three months before it
   if (perMonth.length >= 5) {
      const target = last - 1;
      const history = perMonth.slice(Math.max(0, target - 3), target);

      if (history.length >= 3) {
         const { mean, deviation } = meanAndDeviation(history);

         if (deviation > 0) {
            const z = (perMonth[target] - mean) / deviation;

            if (Math.abs(z) >= 2) {
               insights.push({
                  tone: "warning",
                  title: `Unusual ${z > 0 ? "spike" : "drop"} in ${months[target].fullLabel}`,
                  detail: `${perMonth[target]} bookings, against an average of ${mean.toFixed(1)} in the three months before.`,
               });
            }
         }
      }
   }

   // 3. Most booked category
   const topCategory = categoryCounts(bookings, 1)[0];

   if (topCategory && bookings.length >= 3) {
      const share = Math.round((topCategory.value / bookings.length) * 100);

      insights.push({
         tone: "info",
         title: `${topCategory.label} is the most booked category`,
         detail: `${topCategory.value} of ${bookings.length} bookings (${share}%).`,
      });
   }

   // 4. Declined or canceled share
   const lost = bookings.filter((b) => b.status === "DECLINED" || b.status === "CANCELED").length;
   const lostShare = Math.round((lost / bookings.length) * 100);

   if (bookings.length >= 5 && lostShare >= 25) {
      insights.push({
         tone: "warning",
         title: `${lostShare}% of bookings were declined or canceled`,
         detail: `${lost} of ${bookings.length} bookings did not go ahead.`,
      });
   }

   // 5. Requests waiting too long for a technician
   const threeDays = 3 * 24 * 60 * 60 * 1000;

   const stale = bookings.filter(
      (b) =>
         b.status === "REQUESTED" && now.getTime() - new Date(b.createdAt).getTime() > threeDays,
   ).length;

   if (stale > 0) {
      insights.push({
         tone: "warning",
         title: `${stale} ${stale === 1 ? "request has" : "requests have"} waited over 3 days`,
         detail: "These bookings are still waiting for a technician to accept or decline.",
      });
   }

   // 6. Accepted but not yet paid
   const unpaid = bookings.filter((b) => b.status === "ACCEPTED").length;

   if (unpaid > 0) {
      insights.push({
         tone: "info",
         title: `${unpaid} accepted ${unpaid === 1 ? "booking is" : "bookings are"} waiting for payment`,
         detail: "The customer has not completed Stripe checkout yet.",
      });
   }

   return insights.slice(0, 5);
}
