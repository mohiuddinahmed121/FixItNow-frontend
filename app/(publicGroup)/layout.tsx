import { Navbar } from "@/components/shared/navbar";
import { getMe } from "@/services/getMe";

export default async function PublicGroupLayout({ children }: { children: React.ReactNode }) {
   const user = await getMe();

   return (
      <>
         <Navbar user={user} />
         {children}
      </>
   );
}
