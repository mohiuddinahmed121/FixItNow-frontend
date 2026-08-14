import { Navbar } from "@/components/shared/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "./_components/DashboardSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
   return (
      <div className="min-h-screen flex flex-col">
         <Navbar />

         <SidebarProvider>
            <div className="flex flex-1">
               <DashboardSidebar role="ADMIN" />

               <main className="flex-1 min-w-0">{children}</main>
            </div>
         </SidebarProvider>
      </div>
   );
}
