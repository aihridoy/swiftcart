"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiPlus, FiPackage, FiUsers, FiShoppingCart, FiLogOut, FiHome } from "react-icons/fi";

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-gradient-to-b from-blue-50 to-indigo-100 shadow-xl h-full flex flex-col">
      {/* Header/Logo Area */}
      <div className="p-6 border-b border-indigo-200/40">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-indigo-700">
          <FiShoppingCart className="h-6 w-6" />
          <span>SwiftCart Admin</span>
        </h1>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-grow p-4">
        <div className="text-xs uppercase tracking-wider text-indigo-600 font-semibold mb-4 ml-2">
          Management
        </div>
        <ul className="space-y-1">
          <NavItem 
            href="/dashboard/add-product" 
            icon={<FiPlus className="h-5 w-5" />} 
            text="Add Product" 
            isActive={pathname === "/dashboard/add-product"}
          />
          <NavItem 
            href="/dashboard/products-list" 
            icon={<FiPackage className="h-5 w-5" />} 
            text="Products List" 
            isActive={pathname === "/dashboard/products-list"}
          />
          <NavItem 
            href="/dashboard/users" 
            icon={<FiUsers className="h-5 w-5" />} 
            text="Users List" 
            isActive={pathname === "/dashboard/users"}
          />
          <NavItem 
            href="/dashboard/orders" 
            icon={<FiShoppingCart className="h-5 w-5" />} 
            text="Orders List" 
            isActive={pathname === "/dashboard/orders"}
          />
        </ul>
        
        <div className="text-xs uppercase tracking-wider text-indigo-600 font-semibold mt-8 mb-4 ml-2">
          Navigation
        </div>
        <ul className="space-y-1">
          <NavItem 
            href="/" 
            icon={<FiHome className="h-5 w-5" />} 
            text="Back to Site" 
            isActive={pathname === "/"}
          />
        </ul>
      </nav>
      
      {/* Footer with Sign Out */}
      <div className="p-4 border-t border-indigo-200/40 mt-auto">
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
function NavItem({ href, icon, text, isActive }) {
  return (
    <li>
      <Link
        href={href}
        className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group
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
        <span className={`font-medium ${!isActive && "group-hover:translate-x-1"} transition-transform`}>
          {text}
        </span>
        {isActive && (
          <div className="ml-auto h-2 w-2 rounded-full bg-white"></div>
        )}
      </Link>
    </li>
  );
}