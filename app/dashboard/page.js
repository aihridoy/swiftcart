/* eslint-disable react/no-unescaped-entities */
"use client";

import { session } from "@/actions/auth-utils";
import { getOrders } from "@/actions/order-utils";
import { getProducts } from "@/actions/products";
import { getUsers } from "@/actions/user-utils";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { FiUsers, FiPackage, FiShoppingCart, FiDollarSign, FiTrendingUp, FiActivity, FiPlus, FiEye, FiSettings } from "react-icons/fi";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Link from "next/link";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Title, Tooltip, Legend);

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

  const { data: userData } = useQuery({
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
      value: userData?.users?.length || 0,
      icon: <FiUsers className="h-7 w-7" />,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      change: "+12%",
      changeType: "increase"
    },
    {
      title: "Total Products",
      value: productData?.products?.length || 0,
      icon: <FiPackage className="h-7 w-7" />,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      change: "+8%",
      changeType: "increase"
    },
    {
      title: "Total Orders",
      value: orderData?.orders?.length || 0,
      icon: <FiShoppingCart className="h-7 w-7" />,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      change: "+23%",
      changeType: "increase"
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue?.toFixed(2) || 0}`,
      icon: <FiDollarSign className="h-7 w-7" />,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      change: "+15%",
      changeType: "increase"
    },
  ];

  // Enhanced Chart Data
  const barChartData = {
    labels: ["Users", "Products", "Orders"],
    datasets: [
      {
        label: "Count",
        data: [
          userData?.users?.length || 0,
          productData?.products?.length || 0,
          orderData?.orders?.length || 0,
        ],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(139, 92, 246, 0.8)"
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(139, 92, 246, 1)"
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const pieChartData = {
    labels: ["Users", "Products", "Orders"],
    datasets: [
      {
        data: [
          userData?.users?.length || 0,
          productData?.products?.length || 0,
          orderData?.orders?.length || 0,
        ],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(139, 92, 246, 0.8)"
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(139, 92, 246, 1)"
        ],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  // Enhanced Chart Options
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: false
      },
      title: { 
        display: true, 
        text: "Activity Overview",
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

  const pieChartOptions = {
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
        text: "Distribution Overview",
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
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
                Admin Dashboard
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl">
                Welcome back! Here's what's happening with your SwiftCart store today.
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
                <FiActivity className="h-4 w-4" />
                <span className="text-sm font-medium">System Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {dashboardStats.map((stat, index) => (
            <div
              key={index}
              className={`${stat.bgColor} rounded-2xl p-6 border border-white/20 backdrop-blur-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-xl text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                  {stat.icon}
                </div>
                <div className="flex items-center space-x-1 text-sm">
                  <FiTrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-green-600 font-medium">{stat.change}</span>
                </div>
              </div>
              <div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-shadow duration-300">
            <div className="h-80">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-shadow duration-300">
            <div className="h-80">
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>
          </div>
        </div>

        {/* Enhanced Quick Access Panel */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
            <div className="flex items-center space-x-2 text-gray-500">
              <FiSettings className="h-5 w-5" />
              <span className="text-sm">Manage</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <QuickActionButton
              href="/dashboard/add-product"
              icon={<FiPlus className="h-5 w-5" />}
              text="Add New Product"
              description="Create and list new products"
              color="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700"
            />
            <QuickActionButton
              href="/dashboard/orders"
              icon={<FiEye className="h-5 w-5" />}
              text="View Orders"
              description="Monitor recent orders"
              color="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
            />
            <QuickActionButton
              href="/dashboard/users"
              icon={<FiUsers className="h-5 w-5" />}
              text="Manage Users"
              description="User administration"
              color="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            />
          </div>
        </div>

        {/* Enhanced Recent Activity */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
            <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium hover:underline transition-colors duration-200">
              View All
            </button>
          </div>
          <div className="space-y-6 max-h-80 overflow-y-auto">
            <ActivityItem
              title="New Order #1234"
              description="Customer purchased 3 items worth $299.99"
              time="10 minutes ago"
              type="order"
            />
            <ActivityItem
              title="Product Updated"
              description="'Wireless Headphones' stock updated to 24 units"
              time="2 hours ago"
              type="product"
            />
            <ActivityItem
              title="New User Registration"
              description="john.doe@example.com joined the platform"
              time="5 hours ago"
              type="user"
            />
            <ActivityItem
              title="Order Shipped #1235"
              description="Order successfully shipped to customer"
              time="1 hour ago"
              type="shipping"
            />
            <ActivityItem
              title="Low Stock Alert"
              description="iPhone 13 Pro Max has only 5 units left"
              time="3 hours ago"
              type="alert"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Quick Action Button Component
function QuickActionButton({ href, icon, text, description, color }) {
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
        <h3 className="font-semibold text-lg mb-1">{text}</h3>
        <p className="text-white/80 text-sm">{description}</p>
      </div>
    </Link>
  );
}

// Enhanced Activity Item Component
function ActivityItem({ title, description, time, type }) {
  const getTypeColor = (type) => {
    switch (type) {
      case 'order': return 'bg-green-500';
      case 'product': return 'bg-blue-500';
      case 'user': return 'bg-purple-500';
      case 'shipping': return 'bg-indigo-500';
      case 'alert': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'order': return <FiShoppingCart className="h-3 w-3" />;
      case 'product': return <FiPackage className="h-3 w-3" />;
      case 'user': return <FiUsers className="h-3 w-3" />;
      case 'shipping': return <FiTrendingUp className="h-3 w-3" />;
      case 'alert': return <FiActivity className="h-3 w-3" />;
      default: return <FiActivity className="h-3 w-3" />;
    }
  };

  return (
    <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50/80 transition-colors duration-200 group">
      <div className={`${getTypeColor(type)} p-2 rounded-lg text-white shadow-sm group-hover:shadow-md transition-shadow duration-200`}>
        {getTypeIcon(type)}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-gray-900 mb-1">{title}</h4>
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
      </div>
      <div className="text-xs text-gray-400 whitespace-nowrap bg-gray-100 px-3 py-1 rounded-full">
        {time}
      </div>
    </div>
  );
}