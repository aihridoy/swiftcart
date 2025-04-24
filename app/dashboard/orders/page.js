"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getOrders, updateOrderStatus } from "@/actions/order-utils";
import { 
  FaShoppingCart, 
  FaUser, 
  FaBox, 
  FaTruck, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaCalendarAlt, 
  FaDollarSign,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaSpinner,
  FaSearch
} from "react-icons/fa";

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
    <td className="p-4">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    </td>
  </tr>
);

const OrderList = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
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

  // Filter orders based on search term
  const filteredOrders = orders.filter(order => 
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (order.user?.name && order.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

  // Status icon selector
  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <FaShoppingCart className="text-yellow-600" />;
      case "Processing":
        return <FaBox className="text-orange-600" />;
      case "Shipped":
        return <FaTruck className="text-blue-600" />;
      case "Delivered":
        return <FaCheckCircle className="text-green-600" />;
      case "Cancelled":
        return <FaTimesCircle className="text-red-600" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            <FaShoppingCart className="mr-2 text-blue-600" />
            Orders
          </h1>
        </div>
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <div className="p-4 flex items-center justify-center">
            <FaSpinner className="animate-spin text-blue-600 text-2xl" />
            <span className="ml-2 text-gray-600">Loading orders...</span>
          </div>
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
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Actions</th>
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
        <div className="bg-red-50 p-6 rounded-lg shadow-md flex items-center">
          <FaTimesCircle className="text-red-600 text-xl mr-2" />
          <p className="text-red-600">Failed to load orders. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <FaShoppingCart className="mr-2 text-blue-600" />
          Orders
        </h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>
      
      {orders.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center py-12">
          <FaShoppingCart className="text-gray-400 text-5xl mb-4" />
          <p className="text-gray-600 text-lg">No orders found.</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center py-12">
          <FaSearch className="text-gray-400 text-5xl mb-4" />
          <p className="text-gray-600 text-lg">No orders match your search criteria.</p>
          <button 
            onClick={() => setSearchTerm("")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FaShoppingCart className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-xl font-bold">{pagination.totalOrders}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
              <div className="bg-yellow-100 p-3 rounded-full mr-4">
                <FaShoppingCart className="text-yellow-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-xl font-bold">
                  {orders.filter(order => order.status === "Pending").length}
                </p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FaTruck className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Shipped</p>
                <p className="text-xl font-bold">
                  {orders.filter(order => order.status === "Shipped").length}
                </p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <FaCheckCircle className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Delivered</p>
                <p className="text-xl font-bold">
                  {orders.filter(order => order.status === "Delivered").length}
                </p>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">Order ID</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">
                    <div className="flex items-center">
                      <FaUser className="mr-1 text-gray-500" />
                      Customer
                    </div>
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">
                    <div className="flex items-center">
                      <FaDollarSign className="mr-1 text-gray-500" />
                      Subtotal
                    </div>
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">
                    <div className="flex items-center">
                      <FaTruck className="mr-1 text-gray-500" />
                      Shipping
                    </div>
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">
                    <div className="flex items-center">
                      <FaDollarSign className="mr-1 text-gray-500" />
                      Total
                    </div>
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">
                    <div className="flex items-center">
                      <FaBox className="mr-1 text-gray-500" />
                      Status
                    </div>
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-1 text-gray-500" />
                      Created At
                    </div>
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr
                    key={order._id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-blue-50 transition-colors duration-200`}
                  >
                    <td className="p-4 text-gray-800 font-medium">{order._id}</td>
                    <td className="p-4 text-gray-800">
                      <div className="flex items-center">
                        <div className="bg-gray-200 rounded-full h-8 w-8 flex items-center justify-center mr-2">
                          <FaUser className="text-gray-500" />
                        </div>
                        {order.user?.name || "Unknown"}
                      </div>
                    </td>
                    <td className="p-4 text-gray-800">${order.subtotal.toFixed(2)}</td>
                    <td className="p-4 text-gray-800">${order.shipping.toFixed(2)}</td>
                    <td className="p-4 text-gray-800 font-semibold">${order.total.toFixed(2)}</td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`px-6 py-2 text-xs font-semibold rounded-full focus:outline-none flex items-center ${
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
                      <div className="flex items-center mt-1">
                        {getStatusIcon(order.status)}
                        <span className="ml-1 text-xs text-gray-500">
                          {order.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-1 text-gray-400" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => router.push(`/orders/${order._id}`)}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition-colors mr-2"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="mt-6 flex justify-center items-center space-x-2">
              {/* First Page Button */}
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                } transition-colors duration-200 flex items-center`}
              >
                <FaAngleDoubleLeft className="text-xs" />
              </button>

              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                } transition-colors duration-200 flex items-center`}
              >
                <FaAngleLeft />
                <span className="ml-1">Prev</span>
              </button>

              {/* Page Numbers */}
              {startPage > 1 && (
                <>
                  <button
                    onClick={() => handlePageChange(1)}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 border border-gray-300"
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
                      ? "bg-blue-600 text-white border border-blue-600"
                      : "text-gray-700 hover:bg-gray-100 border border-gray-300"
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
                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 border border-gray-300"
                  >
                    {pagination.totalPages}
                  </button>
                </>
              )}

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  currentPage === pagination.totalPages
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                } transition-colors duration-200 flex items-center`}
              >
                <span className="mr-1">Next</span>
                <FaAngleRight />
              </button>

              {/* Last Page Button */}
              <button
                onClick={() => handlePageChange(pagination.totalPages)}
                disabled={currentPage === pagination.totalPages}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  currentPage === pagination.totalPages
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                } transition-colors duration-200 flex items-center`}
              >
                <FaAngleDoubleRight className="text-xs" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrderList;