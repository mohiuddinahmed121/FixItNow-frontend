import { LayoutDashboard, Users, CalendarCheck, Tags } from "lucide-react";

export const ADMIN_SIDEBAR_ITEMS = [
   {
      label: "Admin Dashboard",
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
      icon: CalendarCheck,
   },
   {
      label: "Categories",
      href: "/admin-dashboard/categories",
      icon: Tags,
   },
];
