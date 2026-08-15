import { Navbar } from "@/components/shared/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getMe } from "@/services/getMe";
import DashboardSidebar from "./_components/DashboardSidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
   const user = await getMe();

   return (
      <div className="min-h-screen flex flex-col">
         <Navbar user={user} />

         <SidebarProvider>
            <div className="flex flex-1">
               <DashboardSidebar user={user} />

               <main className="flex-1 min-w-0">{children}</main>
            </div>
         </SidebarProvider>
      </div>
   );
}
