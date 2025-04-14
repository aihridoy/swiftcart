"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "@/actions/order-utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";

const OrderHistory = () => {
  const { data: session } = useSession();
  const router = useRouter();

  // Fetch orders using React Query
  const { data, error, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    enabled: !!session, // Only fetch if the user is logged in
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

  if (isLoading) {
    return (
      <div className="container min-h-screen py-16 flex justify-center">
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-16 flex justify-center">
        <p>Failed to load orders. Please try again later.</p>
      </div>
    );
  }

  const orders = data?.orders || [];

  return (
    <div className="container py-16">
      <h2 className="text-2xl font-medium mb-6">Your Order History</h2>

      {orders.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            You haven’t placed any orders yet.
          </p>
          <Link href="/products" className="text-primary hover:underline">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-200 rounded p-4 shadow-sm"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
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
                  className="text-primary hover:underline text-sm"
                >
                  View Details
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
                        className="object-cover rounded"
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
                    Shipping:{" "}
                    {order.shipping === 0
                      ? "Free"
                      : `$${order.shipping.toFixed(2)}`}
                  </p>
                </div>
                <p className="text-gray-800 font-semibold">
                  Total: ${order.total.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
