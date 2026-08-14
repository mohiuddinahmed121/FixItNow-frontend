"use client";

import { useEffect, useState } from "react";

type Booking = {
   id: string;
   status: string;
   createdAt: string;
   customer?: {
      name: string;
      email: string;
   };
   service?: {
      name: string;
      category?: {
         name: string;
      };
   };
   payment?: {
      status: string;
   };
};

export default function BookingsPage() {
   const [bookings, setBookings] = useState<Booking[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      let ignore = false;

      const loadBookings = async () => {
         try {
            const token = localStorage.getItem("fixitnow_access_token");

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/bookings`, {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            });

            const result = await response.json();

            if (!ignore && result.success) {
               setBookings(result.data);
            }

            if (!ignore && !result.success) {
               console.error("Backend Error:", result.message);
            }
         } catch (error) {
            if (!ignore) {
               console.error("Failed to fetch bookings:", error);
            }
         } finally {
            if (!ignore) {
               setLoading(false);
            }
         }
      };

      loadBookings();

      return () => {
         ignore = true;
      };
   }, []);

   if (loading) {
      return <div className="p-6">Loading bookings...</div>;
   }

   return (
      <div className="p-6">
         <h1 className="text-3xl font-bold">Bookings</h1>

         <p className="mt-2 text-muted-foreground">Manage all customer bookings.</p>

         <div className="mt-6 overflow-x-auto rounded-lg border">
            <table className="w-full">
               <thead className="border-b bg-muted/50">
                  <tr>
                     <th className="px-4 py-3 text-left">Customer</th>
                     <th className="px-4 py-3 text-left">Service</th>
                     <th className="px-4 py-3 text-left">Category</th>
                     <th className="px-4 py-3 text-left">Status</th>
                     <th className="px-4 py-3 text-left">Payment</th>
                     <th className="px-4 py-3 text-left">Created</th>
                  </tr>
               </thead>

               <tbody>
                  {bookings.map((booking) => (
                     <tr key={booking.id} className="border-b">
                        <td className="px-4 py-3">
                           <div>
                              <p className="font-medium">{booking.customer?.name ?? "N/A"}</p>
                              <p className="text-sm text-muted-foreground">
                                 {booking.customer?.email ?? "N/A"}
                              </p>
                           </div>
                        </td>

                        <td className="px-4 py-3">{booking.service?.name ?? "N/A"}</td>

                        <td className="px-4 py-3">{booking.service?.category?.name ?? "N/A"}</td>

                        <td className="px-4 py-3">{booking.status}</td>

                        <td className="px-4 py-3">{booking.payment?.status ?? "N/A"}</td>

                        <td className="px-4 py-3">
                           {new Date(booking.createdAt).toLocaleDateString()}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>

            {bookings.length === 0 && (
               <div className="p-6 text-center text-muted-foreground">No bookings found.</div>
            )}
         </div>
      </div>
   );
}
