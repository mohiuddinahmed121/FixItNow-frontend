"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
   { label: "Home", href: "/" },
   { label: "Services", href: "/services" },
   { label: "Technicians", href: "/technicians" },
];

export function Navbar() {
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
                  {navItems.map((item) => (
                     <Link
                        key={item.href}
                        href={item.href}
                        className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                     >
                        {item.label}
                     </Link>
                  ))}
               </div>

               {/* Auth Actions */}
               <div className="flex items-center gap-2">
                  <Link href="/auth/login">
                     <Button variant="ghost">Login</Button>
                  </Link>

                  <Link href="/auth/register">
                     <Button>Get Started</Button>
                  </Link>
               </div>
            </div>
         </div>
      </nav>
   );
}
