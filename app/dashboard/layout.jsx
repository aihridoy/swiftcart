import DashboardSidebar from "@/components/DashboardSidebar";
import { FiPlus, FiPackage, FiUsers, FiShoppingCart, FiGrid } from "react-icons/fi";

const navItems = [
  { href: "/dashboard", icon: FiGrid, label: "Overview" },
  { href: "/dashboard/add-product", icon: FiPlus, label: "Add" },
  { href: "/dashboard/products-list", icon: FiPackage, label: "Products" },
  { href: "/dashboard/users", icon: FiUsers, label: "Users" },
  { href: "/dashboard/orders", icon: FiShoppingCart, label: "Orders" },
];

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen">
      <DashboardSidebar title="Admin" navItems={navItems} />
      <main className="flex-1 overflow-y-auto bg-gray-50 pb-16 md:pb-0">
        {children}
      </main>
    </div>
  );
}
