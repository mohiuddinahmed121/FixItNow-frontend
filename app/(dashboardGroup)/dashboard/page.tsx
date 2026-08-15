import { getMe } from "@/services/getMe";

export default async function DashboardPage() {
   const user = await getMe();

   if (!user.success || !user.data) {
      return null;
   }

   return (
      <div className="p-6">
         <div className="mb-8">
            <h1 className="text-3xl font-bold">Welcome, {user.data.name}!</h1>

            <p className="mt-2 text-muted-foreground">
               Welcome to your FixItNow customer dashboard.
            </p>
         </div>

         <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border p-6">
               <h2 className="text-lg font-semibold">Browse Services</h2>

               <p className="mt-2 text-sm text-muted-foreground">
                  Find professional technicians for your home services.
               </p>
            </div>

            <div className="rounded-lg border p-6">
               <h2 className="text-lg font-semibold">My Bookings</h2>

               <p className="mt-2 text-sm text-muted-foreground">
                  View and manage your service bookings.
               </p>
            </div>

            <div className="rounded-lg border p-6">
               <h2 className="text-lg font-semibold">My Payments</h2>

               <p className="mt-2 text-sm text-muted-foreground">
                  View your payment history and transactions.
               </p>
            </div>
         </div>
      </div>
   );
}
