import { getMe } from "@/services/getMe";
import ServiceList from "./_components/ServiceList";

export default async function DashboardPage() {
   const user = await getMe();

   if (!user.success || !user.data) {
      return null;
   }

   return (
      <div className="space-y-8 p-6">
         <div>
            <h1 className="text-3xl font-bold">Welcome, {user.data.name}!</h1>

            <p className="mt-2 text-muted-foreground">
               Find trusted professionals for your home services.
            </p>
         </div>

         <div>
            <div className="mb-5">
               <h2 className="text-2xl font-semibold">Available Services</h2>

               <p className="text-sm text-muted-foreground">
                  Browse services offered by our technicians.
               </p>
            </div>

            <ServiceList />
         </div>
      </div>
   );
}
