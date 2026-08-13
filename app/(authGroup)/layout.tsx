import { Navbar } from "@/components/shared/navbar";

const AuthGroupLayout = async ({ children }: { children: React.ReactNode }) => {
   return (
      <div>
         <Navbar />
         {children}
      </div>
   );
};

export default AuthGroupLayout;
