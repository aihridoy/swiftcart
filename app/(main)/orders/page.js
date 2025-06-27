"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "@/actions/order-utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";
import { FaShoppingBag, FaArrowLeft, FaArrowRight, FaEye, FaSpinner } from "react-icons/fa";
import { session } from "@/actions/auth-utils";

// Skeleton Loader for Orders
const SkeletonOrderItem = () => (
  <div className="bg-white rounded-xl shadow-md p-4 animate-pulse">
    <div className="flex justify-between items-center mb-4">
      <div className="space-y-2">
        <div className="h-6 bg-gray-200 rounded w-40"></div>
        <div className="h-4 bg-gray-200 rounded w-32"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
      <div className="h-6 w-20 bg-gray-200 rounded"></div>
    </div>
    <div className="space-y-2 mb-4">
      <div className="flex justify-between items-center border-b border-gray-100 py-2">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-48"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
      </div>
    </div>
    <div className="flex justify-between items-center border-t border-gray-200 pt-2">
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="h-6 w-24 bg-gray-200 rounded"></div>
    </div>
  </div>
);

const OrderHistory = () => {
  const { data: userSession } = useSession();
  const router = useRouter();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
      async function fetchUser() {
        const res = await session();
        if(!res?.user) {
          router.push("/");
        }
      }
      fetchUser();
    }, [router]);

  // Fetch orders
  const { data, error, isLoading } = useQuery({
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

  // Handle page change
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Loading state - Centered on the screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-teal-50 py-8 px-4">
        <div className="max-w-6xl mx-auto space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonOrderItem key={index} />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-teal-50 py-8 px-4">
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md shadow-md p-6 rounded-b-xl mb-6">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800">
              {userSession?.user?.role === "admin" ? "Users Order History" : "Your Order History"}
            </h1>
          </div>
        </div>
        <div className="max-w-6xl mx-auto text-center bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6">
          <p className="text-red-600 text-lg">Failed to load orders. Please try again later.</p>
        </div>
      </div>
    );
  }

  const orders = data?.orders || [];

  // Pagination logic
  const totalItems = orders.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  if (validCurrentPage !== currentPage) {
    setCurrentPage(validCurrentPage);
  }
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedOrders = orders.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-teal-50 py-8 px-4">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        {/* Orders Summary */}
        <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6 mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FaShoppingBag className="text-blue-500 text-2xl" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Total Orders</h2>
              <p className="text-gray-600">{totalItems} {totalItems === 1 ? "order" : "orders"}</p>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-8 text-center max-w-md w-full">
              <FaShoppingBag className="text-gray-400 text-6xl mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {userSession?.user?.role === "admin" ? "No Orders Found" : "You Haven’t Placed Any Orders Yet"}
              </h2>
              <p className="text-gray-600 mb-6">
                {userSession?.user?.role === "admin" ? "No orders have been placed yet." : "Start shopping to place your first order!"}
              </p>
              {userSession?.user?.role !== "admin" && (
                <Link
                  href="/products"
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <FaShoppingBag />
                  <span>Start Shopping</span>
                </Link>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {paginatedOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white/90 backdrop-blur-lg rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-300"
                >
                  <div className="md:flex flex:row justify-between items-center mb-4">
                    <div className="mb-2 md:mb-0">
                      <p className="text-gray-800 font-medium">
                        Order ID: {order._id}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Placed on: {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Status:{" "}
                        <span
                          className={`font-medium ${
                            order.status === "Pending"
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {order.status}
                        </span>
                      </p>
                    </div>
                    <Link
                      href={`/orders/${order._id}`}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      <FaEye />
                      <span>View Details</span>
                    </Link>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-2 mb-4">
                    {order.items.map((item) => (
                      <div
                        key={item._id}
                        className="flex justify-between items-center border-b border-gray-100 py-2"
                      >
                        <div className="flex items-center space-x-4">
                          <Image
                            src={item.product.mainImage}
                            alt={item.product.title}
                            width={64}
                            height={64}
                            className="w-16 h-16 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                          />
                          <div>
                            <h3 className="text-gray-800 font-medium">
                              {item.product.title}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {item.product.brand} - {item.product.category}
                            </p>
                            <p className="text-gray-600 text-sm">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-800 font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="flex justify-between items-center border-t border-gray-200 pt-2">
                    <div>
                      <p className="text-gray-600 text-sm">
                        Subtotal: ${order.subtotal.toFixed(2)}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Shipping: {order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`}
                      </p>
                    </div>
                    <p className="text-gray-800 font-semibold text-lg">
                      Total: ${order.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(validCurrentPage - 1)}
                    disabled={validCurrentPage === 1}
                    className={`px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 ${
                      validCurrentPage === 1
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    } transition-all duration-300 shadow-md`}
                  >
                    <FaArrowLeft />
                    <span>Previous</span>
                  </button>
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg font-semibold ${
                        validCurrentPage === page
                          ? "bg-blue-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      } transition-all duration-300`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(validCurrentPage + 1)}
                    disabled={validCurrentPage === totalPages}
                    className={`px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 ${
                      validCurrentPage === totalPages
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    } transition-all duration-300 shadow-md`}
                  >
                    <span>Next</span>
                    <FaArrowRight />
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;