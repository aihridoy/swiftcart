/* eslint-disable react/no-unescaped-entities */
"use client";

import { session } from '@/actions/auth-utils';
import { getCart } from '@/actions/cart-utils';
import { getOrders } from '@/actions/order-utils';
import { getWishlist } from '@/actions/wishlist';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { 
  FiHeart, 
  FiShoppingCart, 
  FiPackage, 
  FiTrendingUp, 
  FiActivity, 
  FiUser, 
  FiStar,
  FiCalendar,
  FiMapPin,
  FiCreditCard,
  FiEye,
  FiShoppingBag,
  FiGift
} from 'react-icons/fi';
import Link from 'next/link';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const UserDashboard = () => {
  const { data: userSession, status } = useSession();
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

  // Fetch wishlist
  const { data: wishlistData, error: wishlistError, isLoading: wishlistLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
    enabled: !!userSession,
    onError: (error) => {
      if (error.message.includes("Unauthorized")) {
        toast.error("Please log in to view your wishlist.", {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        toast.error(`Error fetching wishlist: ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    },
  });

  // Fetch cart
  const { data: cartData, error: cartError, isLoading: cartLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: !!userSession,
    onError: (error) => {
      if (error.message.includes("Unauthorized")) {
        toast.error("Please log in to view your cart.", {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        toast.error(`Error fetching cart: ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    },
  });

  // Fetch orders
  const { data: orderData, error: orderError, isLoading: orderLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    enabled: !!userSession,
    onError: (error) => {
      if (error.message.includes("Unauthorized")) {
        toast.error("Please log in to view your orders.", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error(`Error loading orders: ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    },
  });

  if (wishlistLoading || cartLoading || orderLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (wishlistError || cartError || orderError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 p-6 rounded-2xl mb-6">
            <FiActivity className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 text-lg font-medium">Error loading dashboard</p>
            <p className="text-red-500 text-sm mt-2">Please try again later</p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
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
  const totalItems = wishlistItems.length + cartItems.length + orders.length;

  // Calculate total spent
  const totalSpent = orders.reduce((sum, order) => sum + (order.subtotal || 0), 0);

  const dashboardStats = [
    {
      title: "Wishlist Items",
      value: wishlistItems.length,
      icon: <FiHeart className="h-6 w-6" />,
      color: "from-pink-500 to-rose-600",
      bgColor: "bg-pink-50",
      change: wishlistItems.length > 0 ? "+2 this week" : "Empty",
      href: "/user-dashboard/wishlist"
    },
    {
      title: "Cart Items",
      value: cartItems.length,
      icon: <FiShoppingCart className="h-6 w-6" />,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      change: cartItems.length > 0 ? "Ready to checkout" : "Empty",
      href: "/user-dashboard/cart"
    },
    {
      title: "Total Orders",
      value: orders.length,
      icon: <FiPackage className="h-6 w-6" />,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      change: orders.length > 0 ? "Last order 2 days ago" : "No orders yet",
      href: "/user-dashboard/orders"
    },
    {
      title: "Total Spent",
      value: `$${totalSpent.toFixed(2)}`,
      icon: <FiCreditCard className="h-6 w-6" />,
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-50",
      change: totalSpent > 0 ? "This year" : "$0.00",
      href: "/user-dashboard/orders"
    },
  ];

  // Enhanced chart data
  const barChartData = {
    labels: ['Wishlist', 'Cart', 'Orders'],
    datasets: [
      {
        label: 'Item Count',
        data: [wishlistItems.length, cartItems.length, orders.length],
        backgroundColor: [
          'rgba(236, 72, 153, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)'
        ],
        borderColor: [
          'rgba(236, 72, 153, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)'
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const doughnutChartData = {
    labels: ['Wishlist', 'Cart', 'Orders'],
    datasets: [
      {
        data: [wishlistItems.length, cartItems.length, orders.length],
        backgroundColor: [
          'rgba(236, 72, 153, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)'
        ],
        borderColor: [
          'rgba(236, 72, 153, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)'
        ],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        font: { size: 16, weight: 'bold' },
        color: '#374151'
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#6B7280'
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280'
        }
      }
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          font: { size: 12 },
          color: '#374151'
        }
      },
      title: {
        display: true,
        text: "Activity Distribution",
        font: { size: 16, weight: 'bold' },
        color: '#374151'
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Enhanced Dashboard Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
                Welcome back{user?.name ? `, ${user.name}` : ''}!
              </h1>
              <p className="text-lg text-gray-600">
                Here's an overview of your shopping activity and preferences.
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full">
                <FiUser className="h-4 w-4" />
                <span className="text-sm font-medium">Profile Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {dashboardStats.map((stat, index) => (
            <Link
              key={index}
              href={stat.href}
              className={`${stat.bgColor} rounded-2xl p-6 border border-white/20 backdrop-blur-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group block`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-xl text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                  {stat.icon}
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.change}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Enhanced Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Activity Overview</h2>
            <div className="h-80">
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-shadow duration-300">
            <div className="h-80">
              <Doughnut data={doughnutChartData} options={doughnutOptions} />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
            <FiActivity className="h-5 w-5 text-gray-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <QuickActionCard
              href="/products"
              icon={<FiShoppingBag className="h-6 w-6" />}
              title="Continue Shopping"
              description="Discover new products"
              color="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            />
            <QuickActionCard
              href="/user-dashboard/cart"
              icon={<FiShoppingCart className="h-6 w-6" />}
              title="View Cart"
              description={`${cartItems.length} items waiting`}
              color="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
            />
            <QuickActionCard
              href="/user-dashboard/orders"
              icon={<FiPackage className="h-6 w-6" />}
              title="Track Orders"
              description="Check order status"
              color="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
            />
          </div>
        </div>

        {/* Enhanced Activity Table */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Shopping Summary</h2>
            <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium hover:underline transition-colors duration-200">
              View Details
            </button>
          </div>
          
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Count</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <TableRow
                  icon={<FiHeart className="h-5 w-5 text-pink-500" />}
                  category="Wishlist"
                  count={wishlistItems.length}
                  status={wishlistItems.length > 0 ? "Active" : "Empty"}
                  statusColor={wishlistItems.length > 0 ? "text-green-600 bg-green-100" : "text-gray-600 bg-gray-100"}
                  href="/user-dashboard/wishlist"
                />
                <TableRow
                  icon={<FiShoppingCart className="h-5 w-5 text-blue-500" />}
                  category="Shopping Cart"
                  count={cartItems.length}
                  status={cartItems.length > 0 ? "Ready" : "Empty"}
                  statusColor={cartItems.length > 0 ? "text-blue-600 bg-blue-100" : "text-gray-600 bg-gray-100"}
                  href="/user-dashboard/cart"
                />
                <TableRow
                  icon={<FiPackage className="h-5 w-5 text-emerald-500" />}
                  category="Orders"
                  count={orders.length}
                  status={orders.length > 0 ? "Completed" : "None"}
                  statusColor={orders.length > 0 ? "text-emerald-600 bg-emerald-100" : "text-gray-600 bg-gray-100"}
                  href="/user-dashboard/orders"
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Quick Action Card Component
function QuickActionCard({ href, icon, title, description, color }) {
  return (
    <Link
      href={href}
      className={`${color} text-white rounded-2xl p-6 flex flex-col items-start justify-between h-32 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] group`}
    >
      <div className="flex items-center justify-between w-full">
        <div className="bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-colors duration-300">
          {icon}
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-white/80 text-sm">{description}</p>
      </div>
    </Link>
  );
}

// Table Row Component
function TableRow({ icon, category, count, status, statusColor, href }) {
  return (
    <tr className="hover:bg-gray-50/80 transition-colors duration-200">
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gray-100 p-2 rounded-lg">
            {icon}
          </div>
          <span className="text-sm font-medium text-gray-900">{category}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-2xl font-bold text-gray-900">{count}</span>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4">
        <Link
          href={href}
          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium hover:underline transition-colors duration-200 flex items-center space-x-1"
        >
          <span>View</span>
          <FiEye className="h-4 w-4" />
        </Link>
      </td>
    </tr>
  );
}

export default UserDashboard;