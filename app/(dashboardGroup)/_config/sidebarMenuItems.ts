import { CalendarDays, LayoutDashboard, Settings, Users, Wrench, Tags } from "lucide-react";

export const sidebarMenuItems = {
   CUSTOMER: [
      {
         label: "Dashboard",
         href: "/dashboard",
         icon: LayoutDashboard,
      },
      {
         label: "My Bookings",
         href: "/dashboard/bookings",
         icon: CalendarDays,
      },
   ],

   TECHNICIAN: [
      {
         label: "Dashboard",
         href: "/technician-dashboard",
         icon: LayoutDashboard,
      },
      {
         label: "My Services",
         href: "/technician-dashboard/services",
         icon: Wrench,
      },
      {
         label: "Bookings",
         href: "/technician-dashboard/bookings",
         icon: CalendarDays,
      },
   ],

   ADMIN: [
      {
         label: "Dashboard",
         href: "/admin-dashboard",
         icon: LayoutDashboard,
      },
      {
         label: "Users",
         href: "/admin-dashboard/users",
         icon: Users,
      },
      {
         label: "Bookings",
         href: "/admin-dashboard/bookings",
         icon: CalendarDays,
      },
      {
         label: "Categories",
         href: "/admin-dashboard/categories",
         icon: Tags,
      },
   ],
};
