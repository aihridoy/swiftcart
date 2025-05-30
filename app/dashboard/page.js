"use client";

import { session } from "@/actions/auth-utils";
import { getOrders } from "@/actions/order-utils";
import { getProducts } from "@/actions/products";
import { getUsers } from "@/actions/user-utils";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FiUsers,
  FiPackage,
  FiShoppingCart,
  FiDollarSign,
} from "react-icons/fi";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      const res = await session();
      if (res) {
        if (res?.user?.role !== "admin") {
          router.push('/');
        }
      } 
    }
    fetchUser();
  }, [router]);

  const {
    data: userData,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    onError: (error) => {
      if (error.message.includes("Unauthorized")) {
        toast.error("Please log in to view users.", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error(`Error loading users: ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    },
  });

  const { data: productData } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    onError: (error) => {
      toast.error(`Error fetching products: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    },
  });

  const { data: orderData } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    onError: (error) => {
      if (error.message.includes("Unauthorized")) {
        toast.error("Please log in to view your orders.", {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        toast.error(`Error loading orders: ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    },
  });

  const totalRevenue = orderData?.orders
    ?.map((order) => order.subtotal)
    ?.reduce((acc, curr) => acc + curr, 0);

  const dashboardStats = [
    {
      title: "Total Users",
      value: userData?.users?.length,
      icon: <FiUsers className="h-6 w-6" />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Total Products",
      value: productData?.products?.length,
      icon: <FiPackage className="h-6 w-6" />,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Orders",
      value: orderData?.orders?.length,
      icon: <FiShoppingCart className="h-6 w-6" />,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Revenue",
      value: `$${totalRevenue?.toFixed(2) || 0}`,
      icon: <FiDollarSign className="h-6 w-6" />,
      color: "bg-amber-100 text-amber-600",
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto mb-20">
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome to the SwiftCart Admin Dashboard. Select a menu item to get
          started.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4"
          >
            <div className={`${stat.color} p-3 rounded-full`}>{stat.icon}</div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">
                {stat.title}
              </h3>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Access Panel */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionButton
            href="/dashboard/add-product"
            icon={<FiPackage className="h-5 w-5" />}
            text="Add New Product"
            color="bg-indigo-600 hover:bg-indigo-700"
          />
          <QuickActionButton
            href="/dashboard/orders"
            icon={<FiShoppingCart className="h-5 w-5" />}
            text="View Recent Orders"
            color="bg-green-600 hover:bg-green-700"
          />
          <QuickActionButton
            href="/dashboard/users"
            icon={<FiUsers className="h-5 w-5" />}
            text="Manage Users"
            color="bg-blue-600 hover:bg-blue-700"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          <ActivityItem
            title="New Order #1234"
            description="Customer purchased 3 items"
            time="10 minutes ago"
          />
          <ActivityItem
            title="Product Updated"
            description="'Wireless Headphones' stock updated to 24"
            time="2 hours ago"
          />
          <ActivityItem
            title="New User Registration"
            description="john.doe@example.com registered an account"
            time="5 hours ago"
          />
        </div>
      </div>
    </div>
  );
}

// Helper component for quick action buttons
function QuickActionButton({ href, icon, text, color }) {
  return (
    <a
      href={href}
      className={`${color} text-white rounded-lg px-4 py-3 flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg`}
    >
      {icon}
      <span>{text}</span>
    </a>
  );
}

// Helper component for activity items
function ActivityItem({ title, description, time }) {
  return (
    <div className="flex items-start border-b border-gray-100 pb-4 last:border-0 last:pb-0">
      <div className="h-2 w-2 mt-2 rounded-full bg-indigo-500 mr-3"></div>
      <div className="flex-1">
        <h4 className="text-sm font-medium text-gray-800">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div className="text-xs text-gray-400">{time}</div>
    </div>
  );
}
