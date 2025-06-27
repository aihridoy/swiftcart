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
import { Bar, Pie } from 'react-chartjs-2';
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
    return <div className="p-6">Loading dashboard...</div>;
  }

  if (wishlistError || cartError || orderError) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">Error loading dashboard. Please try again later.</p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const wishlistItems = wishlistData?.wishlist || [];
  const cartItems = cartData?.cart?.items || [];
  const orders = orderData?.orders || [];

  // Data for charts
  const barChartData = {
    labels: ['Wishlist', 'Cart', 'Orders'],
    datasets: [
      {
        label: 'Item Count',
        data: [wishlistItems.length, cartItems.length, orders.length],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: ['Wishlist', 'Cart', 'Orders'],
    datasets: [
      {
        data: [wishlistItems.length, cartItems.length, orders.length],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverOffset: 4,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart Title', // Can be customized per chart
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count',
        },
      },
    },
  };

  return (
    <div className="p-6">
      {/* <h1 className="text-3xl font-bold mb-6">User Dashboard</h1> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Overview Cards */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Total Wishlist Items</h2>
          <p className="text-2xl">{wishlistItems.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Total Cart Items</h2>
          <p className="text-2xl">{cartItems.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Total Orders</h2>
          <p className="text-2xl">{orders.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Total Items</h2>
          <p className="text-2xl">{wishlistItems.length + cartItems.length + orders.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Bar Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md h-96">
          <h2 className="text-lg font-semibold mb-4">Item Distribution</h2>
          <Bar
            data={barChartData}
            options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                title: { ...chartOptions.plugins.title, text: 'Item Distribution' },
              },
            }}
          />
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md h-96">
          <h2 className="text-lg font-semibold mb-4">Item Proportion</h2>
          <Pie
            data={pieChartData}
            options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                title: { ...chartOptions.plugins.title, text: 'Item Proportion' },
              },
              scales: {}, // Remove scales for pie chart as it doesn't use them
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Type</th>
              <th className="p-2">Count</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-2">Wishlist</td>
              <td className="p-2">{wishlistItems.length}</td>
            </tr>
            <tr className="border-t">
              <td className="p-2">Cart</td>
              <td className="p-2">{cartItems.length}</td>
            </tr>
            <tr className="border-t">
              <td className="p-2">Orders</td>
              <td className="p-2">{orders.length}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDashboard;