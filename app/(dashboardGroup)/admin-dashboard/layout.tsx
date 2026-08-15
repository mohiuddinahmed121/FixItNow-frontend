import { getMe } from "@/services/getMe";
import { redirect } from "next/navigation";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
   const user = await getMe();

   if (!user.success || !user.data) {
      redirect("/login");
   }

   if (user.data.role !== "ADMIN") {
      redirect("/");
   }

   return <>{children}</>;
}
