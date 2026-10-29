import { AdminOverview } from "./_components/admin-overview";

export default function AdminDashboardPage() {
   return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
         <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="mt-1 text-muted-foreground">
               An overview of users, bookings and revenue on FixItNow.
            </p>
         </div>

         <AdminOverview />
      </div>
   );
}
