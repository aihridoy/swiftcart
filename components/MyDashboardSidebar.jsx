"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiPlus, FiPackage, FiUsers, FiShoppingCart, FiLogOut, FiHome, FiUser } from "react-icons/fi";

export default function MyDashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed md:static bottom-0 left-0 w-full md:w-72 bg-gradient-to-b from-blue-50 to-indigo-100 shadow-xl h-16 md:h-full flex md:flex-col justify-between md:justify-start">
      
      {/* Header/Logo Area */}
      <div className="hidden md:block p-6 border-b border-indigo-200/40">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-indigo-700">
          <FiShoppingCart className="h-6 w-6" />
          <span>SwiftCart Admin</span>
        </h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-grow md:flex-grow-0 md:flex-col md:p-4 px-2 py-1">
        <div className="hidden md:block text-xs uppercase tracking-wider text-indigo-600 font-semibold mb-4 ml-2">
          Management
        </div>
        <ul className="flex md:flex-col justify-around md:space-y-1 w-full">
          <NavItem 
            href="/user-dashboard/wishlist" 
            icon={<FiPlus className="h-6 w-6" />} 
            text="Wishlist" 
            isActive={pathname === "/user-dashboard/wishlist"}
            showText={false}
          />
          <NavItem 
            href="/user-dashboard/cart" 
            icon={<FiShoppingCart className="h-6 w-6" />} 
            text="Cart" 
            isActive={pathname === "/user-dashboard/cart"}
            showText={false}
          />
          <NavItem 
            href="/user-dashboard/orders" 
            icon={<FiPackage className="h-6 w-6" />} 
            text="Orders" 
            isActive={pathname === "/user-dashboard/orders"}
            showText={false}
          />
          <NavItem 
            href="/user-dashboard/profile" 
            icon={<FiUser className="h-6 w-6" />} 
            text="Profile" 
            isActive={pathname === "/user-dashboard/profile"}
            showText={false}
          />
          <NavItem 
            href="/" 
            icon={<FiHome className="h-6 w-6" />} 
            text="Home" 
            isActive={pathname === "/"}
            showText={false}
          />
        </ul>
      </nav>

      {/* Footer with Sign Out */}
      <div className="hidden md:flex p-4 border-t border-indigo-200/40 mt-auto">
        <Link 
          href="/api/auth/signout" 
          className="flex items-center gap-2 w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg group"
        >
          <FiLogOut className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          <span>Sign Out</span>
        </Link>
      </div>
    </aside>
  );
}

// Helper component for nav items with active state
function NavItem({ href, icon, text, isActive, showText }) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <li className="w-full">
      <Link
        href={href}
        className={`flex flex-col md:flex-row items-center justify-center md:justify-start gap-0.5 md:gap-3 p-2 md:p-3 rounded-lg transition-all duration-200 group
          ${isActive 
            ? "bg-indigo-500 text-white font-medium shadow-md" 
            : "text-gray-700 hover:bg-indigo-200/30 hover:text-indigo-700"
          }`}
      >
        <div className={`${isActive 
          ? "text-white" 
          : "text-indigo-500 group-hover:text-indigo-700"} transition-colors`}
        >
          {icon}
        </div>
        <span className={`hidden md:block font-medium ${!isActive && "group-hover:translate-x-1"} transition-transform`}>
          {text}
        </span>
      </Link>
    </li>
  );
}