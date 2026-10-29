// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { logout } from "@/services/logout";

// type NavbarUser = {
//    success: boolean;
//    data?: {
//       name: string;
//       email: string;
//       role: "CUSTOMER" | "TECHNICIAN" | "ADMIN";
//    };
// };

// type NavbarProps = {
//    user?: NavbarUser;
// };

// export function Navbar({ user }: NavbarProps) {
//    const isLoggedIn = user?.success && !!user.data;

//    const dashboardLink =
//       user?.data?.role === "CUSTOMER"
//          ? "/dashboard"
//          : user?.data?.role === "TECHNICIAN"
//            ? "/technician-dashboard"
//            : user?.data?.role === "ADMIN"
//              ? "/admin-dashboard"
//              : null;

//    const dashboardLabel =
//       user?.data?.role === "CUSTOMER"
//          ? "Dashboard"
//          : user?.data?.role === "TECHNICIAN"
//            ? "Technician Dashboard"
//            : user?.data?.role === "ADMIN"
//              ? "Admin Dashboard"
//              : null;

//    return (
//       <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
//          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//             <div className="flex h-16 items-center justify-between gap-6">
//                {/* Logo */}
//                <Link href="/" className="shrink-0">
//                   <span className="text-2xl font-bold tracking-tight text-primary">FixItNow</span>
//                </Link>

//                {/* Navigation */}
//                <div className="hidden items-center gap-8 md:flex">
//                   <Link
//                      href="/"
//                      className="text-sm font-medium text-foreground transition-colors hover:text-primary"
//                   >
//                      Home
//                   </Link>

//                   <Link
//                      href="/services"
//                      className="text-sm font-medium text-foreground transition-colors hover:text-primary"
//                   >
//                      Services
//                   </Link>
//                </div>

//                {/* Right Side */}
//                <div className="flex items-center gap-3">
//                   {!isLoggedIn ? (
//                      <>
//                         <Link href="/login">
//                            <Button variant="ghost">Login</Button>
//                         </Link>

//                         <Link href="/register">
//                            <Button>Register</Button>
//                         </Link>
//                      </>
//                   ) : (
//                      <>
//                         {/* Dashboard */}
//                         {dashboardLink && dashboardLabel && (
//                            <Link href={dashboardLink}>
//                               <Button variant="outline" className="hidden sm:inline-flex">
//                                  {dashboardLabel}
//                               </Button>
//                            </Link>
//                         )}

//                         {/* User Info */}
//                         <div className="hidden border-l pl-3 text-right sm:block">
//                            <p className="text-sm font-medium leading-none">{user.data?.name}</p>

//                            <p className="mt-1 text-xs capitalize text-muted-foreground">
//                               {user.data?.role.toLowerCase()}
//                            </p>
//                         </div>

//                         {/* Logout */}
//                         <form action={logout}>
//                            <Button type="submit" variant="outline">
//                               Logout
//                            </Button>
//                         </form>
//                      </>
//                   )}
//                </div>
//             </div>
//          </div>
//       </nav>
//    );
// }

"use client";

import {
   CalendarDays,
   ChevronDown,
   LayoutDashboard,
   Loader2,
   LogOut,
   Menu,
   User,
   Users,
   Wrench,
   type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import SearchSuggest from "@/components/shared/SearchSuggest";

<SearchSuggest searchPath="/services" detailsPath="/services" />;

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { logout } from "@/services/logout";

type Role = "CUSTOMER" | "TECHNICIAN" | "ADMIN";

type NavbarUser = {
   success: boolean;
   data?: {
      name: string;
      email: string;
      role: Role;
   };
};

type NavbarProps = {
   user?: NavbarUser;
};

type MenuLink = {
   label: string;
   href: string;
   icon: LucideIcon;
};

// Logged-out: 5 routes. Logged-in: these 5 + Dashboard = 6 routes.
const PUBLIC_LINKS = [
   { label: "Home", href: "/" },
   { label: "Services", href: "/services" },
   { label: "About", href: "/about" },
   { label: "Blog", href: "/blog" },
   { label: "Contact", href: "/contact" },
];

const ROLE_MENU: Record<Role, { dashboard: string; profile: string; extra: MenuLink }> = {
   CUSTOMER: {
      dashboard: "/dashboard",
      profile: "/dashboard/profile",
      extra: { label: "My Bookings", href: "/dashboard/bookings", icon: CalendarDays },
   },
   TECHNICIAN: {
      dashboard: "/technician-dashboard",
      profile: "/technician-dashboard/profile",
      extra: { label: "My Services", href: "/technician-dashboard/services", icon: Wrench },
   },
   ADMIN: {
      dashboard: "/admin-dashboard",
      profile: "/admin-dashboard/profile",
      extra: { label: "Manage Users", href: "/admin-dashboard/users", icon: Users },
   },
};

const ctaButton = cn(
   buttonVariants({ size: "lg" }),
   "bg-cta text-cta-foreground hover:bg-cta/90 px-4",
);

export function Navbar({ user }: NavbarProps) {
   const pathname = usePathname();
   const [mobileOpen, setMobileOpen] = useState(false);
   const [isLoggingOut, startTransition] = useTransition();

   const account = user?.success ? user.data : undefined;
   const roleMenu = account ? ROLE_MENU[account.role] : null;

   const links = roleMenu
      ? [...PUBLIC_LINKS, { label: "Dashboard", href: roleMenu.dashboard }]
      : PUBLIC_LINKS;

   const isActive = (href: string) =>
      href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

   const handleLogout = () => {
      startTransition(async () => {
         await logout();
      });
   };

   const linkClass = (href: string) =>
      cn(
         "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
         isActive(href)
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
      );

   return (
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
         <nav
            aria-label="Main"
            className="container-page flex h-16 items-center justify-between gap-4"
         >
            {/* Logo */}
            <Link href="/" className="flex shrink-0 items-center gap-2">
               <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
                  <Wrench className="size-5" />
               </span>
               <span className="text-xl font-bold tracking-tight">FixItNow</span>
            </Link>

            {/* Desktop links */}
            <ul className="hidden items-center gap-1 lg:flex">
               {links.map((link) => (
                  <li key={link.href}>
                     <Link
                        href={link.href}
                        aria-current={isActive(link.href) ? "page" : undefined}
                        className={linkClass(link.href)}
                     >
                        {link.label}
                     </Link>
                  </li>
               ))}
            </ul>

            {/* Right side */}
            <div className="flex items-center gap-2">
               <ThemeToggle />

               {account && roleMenu ? (
                  <DropdownMenu>
                     <DropdownMenuTrigger
                        aria-label="Open profile menu"
                        className="flex items-center gap-2 rounded-full border border-border bg-card py-1 pr-2 pl-1 text-sm outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
                     >
                        <span className="grid size-8 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                           {account.name.charAt(0).toUpperCase()}
                        </span>
                        <span className="hidden max-w-28 truncate font-medium sm:block">
                           {account.name}
                        </span>
                        <ChevronDown className="size-4 text-muted-foreground" />
                     </DropdownMenuTrigger>

                     <DropdownMenuContent align="end" className="w-64">
                        <div className="px-2 py-2">
                           <p className="truncate text-sm font-semibold">{account.name}</p>
                           <p className="truncate text-xs text-muted-foreground">{account.email}</p>
                           <span className="mt-2 inline-block rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground capitalize">
                              {account.role.toLowerCase()}
                           </span>
                        </div>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem render={<Link href={roleMenu.dashboard} />}>
                           <LayoutDashboard />
                           Dashboard
                        </DropdownMenuItem>

                        <DropdownMenuItem render={<Link href={roleMenu.profile} />}>
                           <User />
                           Profile
                        </DropdownMenuItem>

                        <DropdownMenuItem render={<Link href={roleMenu.extra.href} />}>
                           <roleMenu.extra.icon />
                           {roleMenu.extra.label}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                           variant="destructive"
                           disabled={isLoggingOut}
                           onClick={handleLogout}
                        >
                           {isLoggingOut ? <Loader2 className="animate-spin" /> : <LogOut />}
                           {isLoggingOut ? "Logging out..." : "Logout"}
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
               ) : (
                  <div className="hidden items-center gap-2 sm:flex">
                     <Link
                        href="/login"
                        className={buttonVariants({ variant: "ghost", size: "lg" })}
                     >
                        Login
                     </Link>
                     <Link href="/register" className={ctaButton}>
                        Register
                     </Link>
                  </div>
               )}

               {/* Mobile menu */}
               <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                  <SheetTrigger
                     render={
                        <Button
                           variant="ghost"
                           size="icon-lg"
                           className="lg:hidden"
                           aria-label="Open menu"
                        />
                     }
                  >
                     <Menu />
                  </SheetTrigger>

                  <SheetContent side="left" className="w-72">
                     <SheetHeader>
                        <SheetTitle className="text-lg font-bold">FixItNow</SheetTitle>
                     </SheetHeader>

                     <ul className="flex flex-col gap-1 px-3">
                        {links.map((link) => (
                           <li key={link.href}>
                              <Link
                                 href={link.href}
                                 onClick={() => setMobileOpen(false)}
                                 aria-current={isActive(link.href) ? "page" : undefined}
                                 className={cn(linkClass(link.href), "block py-2.5")}
                              >
                                 {link.label}
                              </Link>
                           </li>
                        ))}
                     </ul>

                     <div className="mt-auto flex flex-col gap-2 border-t border-border p-4">
                        {account && roleMenu ? (
                           <>
                              <div className="mb-1">
                                 <p className="truncate text-sm font-semibold">{account.name}</p>
                                 <p className="truncate text-xs text-muted-foreground">
                                    {account.email}
                                 </p>
                              </div>

                              <Link
                                 href={roleMenu.profile}
                                 onClick={() => setMobileOpen(false)}
                                 className={cn(
                                    buttonVariants({ variant: "outline", size: "lg" }),
                                    "w-full",
                                 )}
                              >
                                 <User />
                                 Profile
                              </Link>

                              <Button
                                 variant="destructive"
                                 size="lg"
                                 className="w-full"
                                 disabled={isLoggingOut}
                                 onClick={handleLogout}
                              >
                                 {isLoggingOut ? <Loader2 className="animate-spin" /> : <LogOut />}
                                 {isLoggingOut ? "Logging out..." : "Logout"}
                              </Button>
                           </>
                        ) : (
                           <>
                              <Link
                                 href="/login"
                                 onClick={() => setMobileOpen(false)}
                                 className={cn(
                                    buttonVariants({ variant: "outline", size: "lg" }),
                                    "w-full",
                                 )}
                              >
                                 Login
                              </Link>
                              <Link
                                 href="/register"
                                 onClick={() => setMobileOpen(false)}
                                 className={cn(ctaButton, "w-full")}
                              >
                                 Register
                              </Link>
                           </>
                        )}
                     </div>
                  </SheetContent>
               </Sheet>
            </div>
         </nav>
      </header>
   );
}
