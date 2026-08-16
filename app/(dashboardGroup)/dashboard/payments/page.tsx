"use client";

import Link from "next/link";
import { useMyPayments } from "@/hooks/use-payments";

export default function PaymentsPage() {
   const { data, isLoading, isError, error } = useMyPayments();

   if (isLoading) {
      return (
         <div className="p-6">
            <div className="rounded-lg border p-6">
               <p className="text-muted-foreground">Loading payments...</p>
            </div>
         </div>
      );
   }

   if (isError) {
      return (
         <div className="p-6">
            <div className="rounded-lg border p-6">
               <p className="text-red-500">
                  {error instanceof Error ? error.message : "Failed to load payments"}
               </p>
            </div>
         </div>
      );
   }

   const payments = data?.data ?? [];

   return (
      <div className="space-y-6 p-6">
         <div>
            <h1 className="text-3xl font-bold">My Payments</h1>

            <p className="mt-2 text-muted-foreground">
               View your payment history and transactions.
            </p>
         </div>

         {payments.length === 0 ? (
            <div className="rounded-lg border p-6 text-center">
               <p className="text-muted-foreground">No payments found.</p>
            </div>
         ) : (
            <div className="grid gap-6 md:grid-cols-2">
               {payments.map((payment) => (
                  <div key={payment.id} className="rounded-lg border p-6 shadow-sm">
                     <div className="flex items-start justify-between gap-4">
                        <div>
                           <h2 className="text-xl font-semibold">
                              {payment.booking.service.title}
                           </h2>

                           <p className="mt-1 text-sm text-muted-foreground">
                              Payment ID: {payment.id}
                           </p>
                        </div>

                        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                           {payment.status}
                        </span>
                     </div>

                     <div className="mt-5 space-y-2 text-sm">
                        <p>
                           <span className="font-medium">Amount:</span> ${payment.amount}
                        </p>

                        <p>
                           <span className="font-medium">Method:</span> {payment.method}
                        </p>

                        <p>
                           <span className="font-medium">Provider:</span> {payment.provider}
                        </p>

                        <p>
                           <span className="font-medium">Booking Status:</span>{" "}
                           {payment.booking.status}
                        </p>

                        <p>
                           <span className="font-medium">Payment Date:</span>{" "}
                           {new Date(payment.createdAt).toLocaleString()}
                        </p>

                        {payment.paidAt && (
                           <p>
                              <span className="font-medium">Paid At:</span>{" "}
                              {new Date(payment.paidAt).toLocaleString()}
                           </p>
                        )}
                     </div>

                     <Link
                        href={`/dashboard/payments/${payment.id}`}
                        className="mt-5 block rounded-md border px-4 py-2 text-center text-sm font-medium hover:bg-muted"
                     >
                        View Details
                     </Link>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
}
