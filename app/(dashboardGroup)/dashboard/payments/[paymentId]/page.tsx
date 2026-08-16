import Link from "next/link";
import { paymentService } from "@/services/payment";

interface PaymentDetailsPageProps {
   params: Promise<{
      paymentId: string;
   }>;
}

export default async function PaymentDetailsPage({ params }: PaymentDetailsPageProps) {
   const { paymentId } = await params;

   let response;

   try {
      response = await paymentService.getSinglePayment(paymentId);
   } catch {
      return (
         <div className="p-6">
            <div className="rounded-lg border p-6 text-center">
               <h1 className="text-xl font-semibold">Payment not found</h1>

               <p className="mt-2 text-sm text-muted-foreground">We could not load this payment.</p>

               <Link
                  href="/dashboard/payments"
                  className="mt-4 inline-block rounded-md border px-4 py-2 text-sm"
               >
                  Back to Payments
               </Link>
            </div>
         </div>
      );
   }

   const payment = response.data;

   return (
      <div className="space-y-6 p-6">
         <Link href="/dashboard/payments" className="text-sm text-muted-foreground hover:underline">
            ← Back to Payments
         </Link>

         <div>
            <h1 className="text-3xl font-bold">Payment Details</h1>

            <p className="mt-2 text-muted-foreground">View details of your payment transaction.</p>
         </div>

         <div className="rounded-lg border p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
               <div>
                  <h2 className="text-xl font-semibold">{payment.booking.service.title}</h2>

                  <p className="mt-1 text-sm text-muted-foreground">Payment ID: {payment.id}</p>
               </div>

               <span className="w-fit rounded-full bg-muted px-3 py-1 text-sm font-medium">
                  {payment.status}
               </span>
            </div>
         </div>

         <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border p-6">
               <h2 className="mb-4 text-xl font-semibold">Payment Information</h2>

               <div className="space-y-3 text-sm">
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
                     <span className="font-medium">Transaction ID:</span> {payment.transactionId}
                  </p>

                  <p>
                     <span className="font-medium">Payment Intent ID:</span>{" "}
                     {payment.paymentIntentId}
                  </p>

                  <p>
                     <span className="font-medium">Created:</span>{" "}
                     {new Date(payment.createdAt).toLocaleString()}
                  </p>

                  <p>
                     <span className="font-medium">Paid At:</span>{" "}
                     {payment.paidAt ? new Date(payment.paidAt).toLocaleString() : "Not paid yet"}
                  </p>
               </div>
            </div>

            <div className="rounded-lg border p-6">
               <h2 className="mb-4 text-xl font-semibold">Booking Information</h2>

               <div className="space-y-3 text-sm">
                  <p>
                     <span className="font-medium">Booking ID:</span> {payment.booking.id}
                  </p>

                  <p>
                     <span className="font-medium">Service:</span> {payment.booking.service.title}
                  </p>

                  <p>
                     <span className="font-medium">Service Price:</span> $
                     {payment.booking.service.price}
                  </p>

                  <p>
                     <span className="font-medium">Booking Status:</span> {payment.booking.status}
                  </p>

                  <p>
                     <span className="font-medium">Booking Date:</span>{" "}
                     {new Date(payment.booking.bookingDate).toLocaleString()}
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
}
