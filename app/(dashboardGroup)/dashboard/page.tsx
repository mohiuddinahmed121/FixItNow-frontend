import { getMe } from "@/services/getMe";
import ServiceList from "./_components/ServiceList";

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

         <ServiceList />
      </div>
   );
}
