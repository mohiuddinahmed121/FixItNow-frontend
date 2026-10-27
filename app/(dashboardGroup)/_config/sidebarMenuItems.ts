import {
   CalendarDays,
   LayoutDashboard,
   Settings,
   UserCircle,
   Users,
   Wrench,
   Tags,
} from "lucide-react";

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
      {
         label: "My Profile",
         href: "/dashboard/profile",
         icon: UserCircle,
      },
   ],

   TECHNICIAN: [
      {
         label: "Dashboard",
         href: "/technician-dashboard",
         icon: LayoutDashboard,
      },
      {
         label: "My Profile",
         href: "/technician-dashboard/profile",
         icon: Settings,
      },
      {
         label: "My Services",
         href: "/technician-dashboard/services",
         icon: Wrench,
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
      {
         label: "Profile",
         href: "/admin-dashboard/profile",
         icon: UserCircle,
      },
   ],
};
