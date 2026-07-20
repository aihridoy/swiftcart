"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiGrid,
  FiPlus,
  FiPackage,
  FiUsers,
  FiShoppingCart,
  FiHeart,
  FiUser,
} from "react-icons/fi";
import SignOut from "./SignOut";

// Nav definitions live here (a Client Component) rather than being passed
// down as props: the icons are function references, which a Server
// Component parent (the layout) cannot serialize to send across the
// server/client boundary. Keeping them here lets the layouts stay Server
// Components and pass only a plain string variant.
const NAV_ITEMS = {
  admin: [
    { href: "/dashboard", icon: FiGrid, label: "Overview" },
    { href: "/dashboard/add-product", icon: FiPlus, label: "Add" },
    { href: "/dashboard/products-list", icon: FiPackage, label: "Products" },
    { href: "/dashboard/users", icon: FiUsers, label: "Users" },
    { href: "/dashboard/orders", icon: FiShoppingCart, label: "Orders" },
  ],
  user: [
    { href: "/user-dashboard", icon: FiGrid, label: "Overview" },
    { href: "/user-dashboard/wishlist", icon: FiHeart, label: "Wishlist" },
    { href: "/user-dashboard/cart", icon: FiShoppingCart, label: "Cart" },
    { href: "/user-dashboard/orders", icon: FiPackage, label: "Orders" },
    { href: "/user-dashboard/profile", icon: FiUser, label: "Profile" },
  ],
};

export default function DashboardSidebar({ title, variant }) {
  const pathname = usePathname();

  const items = [
    ...(NAV_ITEMS[variant] || []),
    { href: "/", icon: FiHome, label: "Home" },
  ];

  return (
    <aside className="fixed md:static bottom-0 left-0 z-50 flex h-16 w-full justify-between border-t border-gray-200 bg-white md:h-full md:w-64 md:flex-col md:justify-start md:border-r md:border-t-0 md:shadow-sm">
      <div className="hidden border-b border-gray-100 p-6 md:block">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/swiftcart-logo.svg"
            alt="SwiftCart"
            width={128}
            height={32}
            className="w-28 h-auto"
          />
        </Link>
        <p className="mt-2 text-xs font-medium uppercase tracking-wider text-gray-400">
          {title}
        </p>
      </div>

      <nav className="flex flex-grow md:flex-grow-0 md:flex-col md:p-4">
        <ul className="flex w-full justify-around md:flex-col md:space-y-1">
          {items.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href;
            return (
              <li key={href} className="w-full">
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex flex-col items-center justify-center gap-0.5 rounded-lg p-2 transition-colors md:flex-row md:justify-start md:gap-3 md:p-3 ${
                    isActive
                      ? "bg-primary text-white font-medium"
                      : "text-gray-600 hover:bg-gray-100 hover:text-primary"
                  }`}
                >
                  <Icon className="h-5 w-5 md:h-5 md:w-5" />
                  <span className="text-[11px] md:text-sm md:font-medium">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="hidden border-t border-gray-100 p-4 md:mt-auto md:block [&>form>button]:w-full">
        <SignOut />
      </div>
    </aside>
  );
}
