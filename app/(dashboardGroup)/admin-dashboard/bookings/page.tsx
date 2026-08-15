"use client";

import { getAdminBookings } from "@/services/admin";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Booking = {
   id: string;
   status: string;
   createdAt: string;

   customer?: {
      name: string;
      email: string;
   };

   service?: {
      title?: string;
      name?: string;
      category?: {
         name: string;
      };
      technicianProfile?: {
         user?: {
            name: string;
         };
      };
   };

   payment?: {
      status: string;
      amount?: number;
   };

   review?: {
      rating: number;
   } | null;
};

const BookingsPage = () => {
   const [bookings, setBookings] = useState<Booking[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      let ignore = false;

      const loadBookings = async () => {
         try {
            const result = await getAdminBookings();

            if (ignore) return;

            if (result.success) {
               setBookings(result.data || []);
            } else {
               toast.error(result.message || "Failed to fetch bookings.");
            }
         } catch (error) {
            if (!ignore) {
               console.error("Failed to fetch bookings:", error);

               toast.error("Failed to fetch bookings.");
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

   return (
      <div className="p-8">
         <div className="mb-8">
            <h1 className="text-4xl font-bold">Bookings</h1>

            <p className="mt-2 text-gray-500">Manage all service bookings.</p>
         </div>

         <div className="overflow-hidden rounded-lg border">
            <table className="w-full">
               <thead>
                  <tr className="border-b bg-gray-50">
                     <th className="px-5 py-4 text-left">Customer</th>

                     <th className="px-5 py-4 text-left">Service</th>

                     <th className="px-5 py-4 text-left">Technician</th>

                     <th className="px-5 py-4 text-left">Status</th>

                     <th className="px-5 py-4 text-left">Payment</th>

                     <th className="px-5 py-4 text-left">Date</th>
                  </tr>
               </thead>

               <tbody>
                  {loading ? (
                     <tr>
                        <td colSpan={6} className="px-5 py-10 text-center text-gray-500">
                           Loading bookings...
                        </td>
                     </tr>
                  ) : bookings.length === 0 ? (
                     <tr>
                        <td colSpan={6} className="px-5 py-10 text-center text-gray-500">
                           No bookings found.
                        </td>
                     </tr>
                  ) : (
                     bookings.map((booking) => (
                        <tr key={booking.id} className="border-b last:border-0">
                           <td className="px-5 py-4">
                              <div>
                                 <p className="font-medium">{booking.customer?.name || "N/A"}</p>

                                 <p className="text-sm text-gray-500">
                                    {booking.customer?.email || "N/A"}
                                 </p>
                              </div>
                           </td>

                           <td className="px-5 py-4">
                              {booking.service?.title || booking.service?.name || "N/A"}
                           </td>

                           <td className="px-5 py-4">
                              {booking.service?.technicianProfile?.user?.name || "N/A"}
                           </td>

                           <td className="px-5 py-4">{booking.status}</td>

                           <td className="px-5 py-4">{booking.payment?.status || "N/A"}</td>

                           <td className="px-5 py-4">
                              {new Date(booking.createdAt).toLocaleDateString()}
                           </td>
                        </tr>
                     ))
                  )}
               </tbody>
            </table>
         </div>
      </div>
   );
};

export default BookingsPage;
