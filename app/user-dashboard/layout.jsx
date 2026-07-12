import DashboardSidebar from "@/components/DashboardSidebar";
import { FiGrid, FiHeart, FiShoppingCart, FiPackage, FiUser } from "react-icons/fi";

const navItems = [
  { href: "/user-dashboard", icon: FiGrid, label: "Overview" },
  { href: "/user-dashboard/wishlist", icon: FiHeart, label: "Wishlist" },
  { href: "/user-dashboard/cart", icon: FiShoppingCart, label: "Cart" },
  { href: "/user-dashboard/orders", icon: FiPackage, label: "Orders" },
  { href: "/user-dashboard/profile", icon: FiUser, label: "Profile" },
];

export default function UserDashboardLayout({ children }) {
  return (
    <div className="flex h-screen">
      <DashboardSidebar title="My Account" navItems={navItems} />
      <main className="flex-1 overflow-y-auto bg-gray-50 pb-16 md:pb-0">
        {children}
      </main>
    </div>
  );
}
