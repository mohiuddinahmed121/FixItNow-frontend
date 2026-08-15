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

   return (
      <nav className="border-b border-border bg-background">
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
               {/* Logo */}
               <Link href="/" className="shrink-0">
                  <span className="text-2xl font-bold text-primary">FixItNow</span>
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

                  <Link
                     href="/technicians"
                     className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                  >
                     Technicians
                  </Link>
               </div>

               {/* Auth Actions */}
               <div className="flex items-center gap-2">
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
                        <div className="hidden text-right sm:block">
                           <p className="text-sm font-medium">{user.data?.name}</p>

                           <p className="text-xs text-muted-foreground">{user.data?.role}</p>
                        </div>

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
