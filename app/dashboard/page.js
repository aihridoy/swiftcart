"use client";

import { session } from "@/actions/auth-utils";
import { getOrders } from "@/actions/order-utils";
import { getProducts } from "@/actions/products";
import { getUsers } from "@/actions/user-utils";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";
import {
  FiUsers,
  FiPackage,
  FiShoppingCart,
  FiDollarSign,
  FiPlus,
  FiEye,
  FiAlertTriangle,
} from "react-icons/fi";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Link from "next/link";
import { Skeleton } from "@/components/skeletons";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const STATUS_STYLES = {
  Pending: "bg-yellow-100 text-yellow-800",
  Processing: "bg-blue-100 text-blue-800",
  Shipped: "bg-purple-100 text-purple-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      const res = await session();
      if (res) {
        if (res?.user?.role !== "admin") {
          router.push("/");
        }
      }
    }
    fetchUser();
  }, [router]);

  const { data: userData, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    onError: (error) => {
      toast.error(`Error loading users: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    },
  });

  const { data: productData, isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    onError: (error) => {
      toast.error(`Error fetching products: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    },
  });

  const { data: orderData, isLoading: ordersLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    onError: (error) => {
      toast.error(`Error loading orders: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    },
  });

  const isLoading = usersLoading || productsLoading || ordersLoading;

  const users = userData?.users || [];
  const products = productData?.products || [];
  const orders = orderData?.orders || [];

  const revenue = orders
    .filter((order) => order.status !== "Cancelled")
    .reduce((sum, order) => sum + (order.subtotal || 0), 0);

  const stats = [
    {
      title: "Total Users",
      value: users.length,
      icon: FiUsers,
      href: "/dashboard/users",
    },
    {
      title: "Total Products",
      value: products.length,
      icon: FiPackage,
      href: "/dashboard/products-list",
    },
    {
      title: "Total Orders",
      value: orders.length,
      icon: FiShoppingCart,
      href: "/dashboard/orders",
    },
    {
      title: "Revenue",
      value: `$${revenue.toFixed(2)}`,
      icon: FiDollarSign,
      href: "/dashboard/orders",
    },
  ];

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const lowStockProducts = products
    .filter((p) => p.availability === "In Stock" && p.quantity <= 5)
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, 5);

  const barChartData = {
    labels: ["Users", "Products", "Orders"],
    datasets: [
      {
        label: "Count",
        data: [users.length, products.length, orders.length],
        backgroundColor: ["#3b82f6", "#10b981", "#8b5cf6"],
        borderRadius: 6,
      },
    ],
  };

  const pieChartData = {
    labels: ["Users", "Products", "Orders"],
    datasets: [
      {
        data: [users.length, products.length, orders.length],
        backgroundColor: ["#3b82f6", "#10b981", "#8b5cf6"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0 } },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" } },
  };

  if (isLoading) {
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-72 w-full rounded-xl" />
          <Skeleton className="h-72 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800 uppercase">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Overview of your SwiftCart store.
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-gray-800 uppercase mb-4">Overview</h2>
          <div className="h-72">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-gray-800 uppercase mb-4">Distribution</h2>
          <div className="h-72">
            <Pie data={pieChartData} options={pieOptions} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <Link
          href="/dashboard/add-product"
          className="flex items-center gap-4 bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:border-primary/30 hover:shadow-md transition-all"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white flex-shrink-0">
            <FiPlus className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Add Product</p>
            <p className="text-sm text-gray-500">Create a new listing</p>
          </div>
        </Link>
        <Link
          href="/dashboard/orders"
          className="flex items-center gap-4 bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:border-primary/30 hover:shadow-md transition-all"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white flex-shrink-0">
            <FiEye className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">View Orders</p>
            <p className="text-sm text-gray-500">Manage recent orders</p>
          </div>
        </Link>
        <Link
          href="/dashboard/users"
          className="flex items-center gap-4 bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:border-primary/30 hover:shadow-md transition-all"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white flex-shrink-0">
            <FiUsers className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Manage Users</p>
            <p className="text-sm text-gray-500">User administration</p>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-800 uppercase">Recent Orders</h2>
            <Link href="/dashboard/orders" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-gray-500 py-6 text-center">No orders yet.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {order.user?.name || order.shippingDetails?.firstName || "Customer"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()} · #{order._id.slice(-6)}
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
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-800 uppercase">Low Stock</h2>
            <Link href="/dashboard/products-list" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          {lowStockProducts.length === 0 ? (
            <p className="text-sm text-gray-500 py-6 text-center">
              No products running low.
            </p>
          ) : (
            <div className="divide-y divide-gray-100">
              {lowStockProducts.map((product) => (
                <div key={product._id} className="flex items-center gap-3 py-3">
                  <FiAlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                  <p className="text-sm text-gray-800 flex-1 line-clamp-1">{product.title}</p>
                  <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    {product.quantity} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
