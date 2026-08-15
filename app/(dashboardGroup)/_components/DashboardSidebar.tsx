"use client";

import {
   Sidebar,
   SidebarContent,
   SidebarGroup,
   SidebarGroupContent,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
} from "@/components/ui/sidebar";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { sidebarMenuItems } from "../_config/sidebarMenuItems";

type UserRole = "CUSTOMER" | "TECHNICIAN" | "ADMIN";

type DashboardSidebarProps = {
   user: {
      success: boolean;
      data?: {
         role: UserRole;
      };
   };
};

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
   const pathname = usePathname();

   const role = user?.data?.role;

   if (!role) {
      return null;
   }

   const navItems = sidebarMenuItems[role];

   return (
      <Sidebar collapsible="none" className="h-[calc(100svh-4rem)] border-r border-sidebar-border">
         <SidebarContent>
            <SidebarGroup>
               <SidebarGroupContent>
                  <SidebarMenu>
                     {navItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                           <SidebarMenuButton isActive={pathname === item.href}>
                              <Link href={item.href} className="flex w-full items-center gap-2">
                                 <item.icon />
                                 <span>{item.label}</span>
                              </Link>
                           </SidebarMenuButton>
                        </SidebarMenuItem>
                     ))}
                  </SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>
         </SidebarContent>
      </Sidebar>
   );
}
