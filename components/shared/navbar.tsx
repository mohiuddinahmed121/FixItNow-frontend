import Link from "next/link";
import { Button } from "@/components/ui/button";
import { logout } from "@/services/logout";

type NavbarUser = {
   success: boolean;
   data?: {
      name: string;
      email: string;
      role: "CUSTOMER" | "TECHNICIAN" | "ADMIN";
   };
};

type NavbarProps = {
   user?: NavbarUser;
};

export function Navbar({ user }: NavbarProps) {
   const isLoggedIn = user?.success && !!user.data;

   const dashboardLink =
      user?.data?.role === "CUSTOMER"
         ? "/dashboard"
         : user?.data?.role === "TECHNICIAN"
           ? "/technician-dashboard"
           : user?.data?.role === "ADMIN"
             ? "/admin-dashboard"
             : null;

   const dashboardLabel =
      user?.data?.role === "CUSTOMER"
         ? "Dashboard"
         : user?.data?.role === "TECHNICIAN"
           ? "Technician Dashboard"
           : user?.data?.role === "ADMIN"
             ? "Admin Dashboard"
             : null;

   return (
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between gap-6">
               {/* Logo */}
               <Link href="/" className="shrink-0">
                  <span className="text-2xl font-bold tracking-tight text-primary">FixItNow</span>
               </Link>

               {/* Navigation */}
               <div className="hidden items-center gap-8 md:flex">
                  <Link
                     href="/"
                     className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                  >
                     Home
                  </Link>

                  <Link
                     href="/services"
                     className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                  >
                     Services
                  </Link>
               </div>

               {/* Right Side */}
               <div className="flex items-center gap-3">
                  {!isLoggedIn ? (
                     <>
                        <Link href="/login">
                           <Button variant="ghost">Login</Button>
                        </Link>

                        <Link href="/register">
                           <Button>Register</Button>
                        </Link>
                     </>
                  ) : (
                     <>
                        {/* Dashboard */}
                        {dashboardLink && dashboardLabel && (
                           <Link href={dashboardLink}>
                              <Button variant="outline" className="hidden sm:inline-flex">
                                 {dashboardLabel}
                              </Button>
                           </Link>
                        )}

                        {/* User Info */}
                        <div className="hidden border-l pl-3 text-right sm:block">
                           <p className="text-sm font-medium leading-none">{user.data?.name}</p>

                           <p className="mt-1 text-xs capitalize text-muted-foreground">
                              {user.data?.role.toLowerCase()}
                           </p>
                        </div>

                        {/* Logout */}
                        <form action={logout}>
                           <Button type="submit" variant="outline">
                              Logout
                           </Button>
                        </form>
                     </>
                  )}
               </div>
            </div>
         </div>
      </nav>
   );
}
