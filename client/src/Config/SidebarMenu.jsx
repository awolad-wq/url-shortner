import {
  LayoutDashboard,
  Link,
  BarChart3,
  User,
  Shield,
  LogOut
} from "lucide-react";

export const USER_MENU = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "History", path: "/dashboard/history", icon: Link },
  // { name: "Statistics", path: "/dashboard/statistics", icon: BarChart3 },
  { name: "Profile", path: "/dashboard/profile", icon: User },
];

export const ADMIN_MENU = [
  // { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "All Links", path: "/dashboard/admin/links", icon: Shield },
  // { name: "Statistics", path: "/dashboard/statistics", icon: BarChart3 },
  { name: "Profile", path: "/dashboard/profile", icon: User },
];
