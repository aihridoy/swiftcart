"use client";

import { session } from "@/actions/auth-utils";
import { getCart } from "@/actions/cart-utils";
import { getOrders } from "@/actions/order-utils";
import { getWishlist } from "@/actions/wishlist";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  FiHeart,
  FiShoppingCart,
  FiPackage,
  FiCreditCard,
  FiShoppingBag,
  FiAlertTriangle,
} from "react-icons/fi";
import Link from "next/link";
import { Skeleton } from "@/components/skeletons";

const STATUS_STYLES = {
  Pending: "bg-yellow-100 text-yellow-800",
  Processing: "bg-blue-100 text-blue-800",
  Shipped: "bg-purple-100 text-purple-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

const UserDashboard = () => {
  const { data: userSession } = useSession();
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      const res = await session();
      if (res) {
        setUser(res.user);
      }
      if (!res?.user) {
        router.push("/");
      }
    }
    fetchUser();
  }, [router]);

  const { data: wishlistData, error: wishlistError, isLoading: wishlistLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
    enabled: !!userSession,
    onError: (error) => {
      toast.error(`Error fetching wishlist: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    },
  });

  const { data: cartData, error: cartError, isLoading: cartLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: !!userSession,
    onError: (error) => {
      toast.error(`Error fetching cart: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    },
  });

  const { data: orderData, error: orderError, isLoading: orderLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    enabled: !!userSession,
    onError: (error) => {
      toast.error(`Error loading orders: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    },
  });

  if (wishlistLoading || cartLoading || orderLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Skeleton className="h-8 w-64 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (wishlistError || cartError || orderError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="text-center">
          <div className="bg-red-50 p-6 rounded-xl mb-6">
            <FiAlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-3" />
            <p className="text-red-700 font-medium">Error loading dashboard</p>
            <p className="text-red-500 text-sm mt-1">Please try again later</p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-transparent hover:text-primary border border-primary transition"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const wishlistItems = wishlistData?.wishlist || [];
  const cartItems = cartData?.cart?.items || [];
  const orders = orderData?.orders || [];
  const totalSpent = orders
    .filter((order) => order.status !== "Cancelled")
    .reduce((sum, order) => sum + (order.subtotal || 0), 0);

  const stats = [
    {
      title: "Wishlist Items",
      value: wishlistItems.length,
      icon: FiHeart,
      href: "/user-dashboard/wishlist",
    },
    {
      title: "Cart Items",
      value: cartItems.length,
      icon: FiShoppingCart,
      href: "/user-dashboard/cart",
    },
    {
      title: "Total Orders",
      value: orders.length,
      icon: FiPackage,
      href: "/user-dashboard/orders",
    },
    {
      title: "Total Spent",
      value: `$${totalSpent.toFixed(2)}`,
      icon: FiCreditCard,
      href: "/user-dashboard/orders",
    },
  ];

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800 uppercase">
          Welcome back{user?.name ? `, ${user.name}` : ""}
        </h1>
        <p className="text-gray-600 mt-1">
          Here&apos;s an overview of your shopping activity.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map(({ title, value, icon: Icon, href }) => (
          <Link
            key={title}
            href={href}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-primary/30 transition-all"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <Link
          href="/products"
          className="flex items-center gap-4 bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:border-primary/30 hover:shadow-md transition-all"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white flex-shrink-0">
            <FiShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Continue Shopping</p>
            <p className="text-sm text-gray-500">Discover new products</p>
          </div>
        </Link>
        <Link
          href="/user-dashboard/cart"
          className="flex items-center gap-4 bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:border-primary/30 hover:shadow-md transition-all"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white flex-shrink-0">
            <FiShoppingCart className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">View Cart</p>
            <p className="text-sm text-gray-500">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"} waiting
            </p>
          </div>
        </Link>
        <Link
          href="/user-dashboard/orders"
          className="flex items-center gap-4 bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:border-primary/30 hover:shadow-md transition-all"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white flex-shrink-0">
            <FiPackage className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Track Orders</p>
            <p className="text-sm text-gray-500">Check order status</p>
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-800 uppercase">Recent Orders</h2>
          <Link href="/user-dashboard/orders" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-gray-500 mb-4">You haven&apos;t placed any orders yet.</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-medium hover:bg-transparent hover:text-primary border border-primary transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentOrders.map((order) => (
              <Link
                key={order._id}
                href={`/user-dashboard/orders/${order._id}`}
                className="flex items-center justify-between py-3 hover:bg-gray-50 -mx-2 px-2 rounded transition"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Order #{order._id.slice(-6)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()} ·{" "}
                    {order.items?.length || 0} {order.items?.length === 1 ? "item" : "items"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-900">
                    ${order.total?.toFixed(2)}
                  </span>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      STATUS_STYLES[order.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
