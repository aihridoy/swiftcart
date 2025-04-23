"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getOrders, updateOrderStatus } from "@/actions/order-utils";

// Skeleton Loader Component
const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="p-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </td>
    <td className="p-4">
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </td>
    <td className="p-4">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    </td>
    <td className="p-4">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    </td>
    <td className="p-4">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    </td>
    <td className="p-4">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    </td>
    <td className="p-4">
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
    </td>
  </tr>
);

const OrderList = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  // Fetch orders with React Query
  const { data, error, isLoading } = useQuery({
    queryKey: ["orders", currentPage],
    queryFn: () => getOrders({ page: currentPage, limit }),
    onError: (error) => {
      if (error.message.includes("Unauthorized")) {
        toast.error("Please log in to view orders.", {
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

  // Mutation for updating order status
  const mutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      // Refetch orders to update the UI
      queryClient.invalidateQueries(["orders", currentPage]);
      toast.success("Order status updated successfully", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error) => {
      toast.error(`Failed to update order: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    },
  });

  const handleStatusChange = (orderId, newStatus) => {
    mutation.mutate({ orderId, status: newStatus });
  };

  const orders = data?.orders || [];
  const pagination = data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    limit,
  };

  // Pagination controls
  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Generate page numbers for pagination
  const pageNumbers = [];
  const maxPagesToShow = 5;
  const startPage = Math.max(
    1,
    pagination.currentPage - Math.floor(maxPagesToShow / 2)
  );
  const endPage = Math.min(
    pagination.totalPages,
    startPage + maxPagesToShow - 1
  );

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-16">
        <h2 className="text-2xl font-bold mb-6">Orders</h2>
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Order ID</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Customer</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Subtotal</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Shipping</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Total</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Created At</th>
              </tr>
            </thead>
            <tbody>
              {Array(5).fill().map((_, index) => (
                <SkeletonRow key={index} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-16 flex justify-center">
        <p className="text-red-600">Failed to load orders. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16">
      <h2 className="text-2xl font-bold mb-6">Orders</h2>
      {orders.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600">No orders found.</p>
        </div>
      ) : (
        <>
          {/* Orders Table */}
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">Order ID</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">Customer</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">Subtotal</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">Shipping</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">Total</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">Status</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">Created At</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr
                    key={order._id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100 transition-colors duration-200`}
                  >
                    <td className="p-4 text-gray-800">{order._id}</td>
                    <td className="p-4 text-gray-800">
                      {order.user?.name || "Unknown"}
                    </td>
                    <td className="p-4 text-gray-800">${order.subtotal.toFixed(2)}</td>
                    <td className="p-4 text-gray-800">${order.shipping.toFixed(2)}</td>
                    <td className="p-4 text-gray-800">${order.total.toFixed(2)}</td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`px-6 py-2 text-xs font-semibold rounded-full focus:outline-none ${
                          order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "Processing"
                            ? "bg-orange-100 text-orange-800"
                            : order.status === "Shipped"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                        disabled={mutation.isLoading}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4 text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="mt-6 flex justify-center items-center space-x-2">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                } transition-colors duration-200`}
              >
                Previous
              </button>

              {/* Page Numbers */}
              {startPage > 1 && (
                <>
                  <button
                    onClick={() => handlePageChange(1)}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200"
                  >
                    1
                  </button>
                  {startPage > 2 && (
                    <span className="px-4 py-2 text-sm text-gray-500">...</span>
                  )}
                </>
              )}

              {pageNumbers.map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  } transition-colors duration-200`}
                >
                  {page}
                </button>
              ))}

              {endPage < pagination.totalPages && (
                <>
                  {endPage < pagination.totalPages - 1 && (
                    <span className="px-4 py-2 text-sm text-gray-500">...</span>
                  )}
                  <button
                    onClick={() => handlePageChange(pagination.totalPages)}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200"
                  >
                    {pagination.totalPages}
                  </button>
                </>
              )}

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  currentPage === pagination.totalPages
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                } transition-colors duration-200`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrderList;