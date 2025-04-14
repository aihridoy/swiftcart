"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getOrders } from "@/actions/order-utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";

const OrderDetails = () => {
  const { orderId } = useParams();
  const { data: session } = useSession();
  const router = useRouter();

  // Fetch orders and find the specific order by ID
  const { data, error, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const result = await getOrders();
      const order = result.orders.find((o) => o._id === orderId);
      if (!order) throw new Error("Order not found");
      return order;
    },
    enabled: !!session && !!orderId,
    onError: (error) => {
      if (error.message.includes("Unauthorized")) {
        toast.error("Please log in to view your order.", {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        toast.error(`Error loading order: ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    },
  });

  if (isLoading) {
    return (
      <div className="container min-h-screen py-16 flex justify-center">
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-16 flex justify-center">
        <p>Failed to load order details. Please try again later.</p>
      </div>
    );
  }

  const order = data;

  return (
    <div className="container py-16">
      <h2 className="text-2xl font-medium mb-6">Order Details</h2>

      <div className="border border-gray-200 rounded p-4 shadow-sm">
        {/* Order Overview */}
        <div className="mb-6">
          <p className="text-gray-800 font-medium">Order ID: {order._id}</p>
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

        {/* Shipping Details */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Shipping Details</h3>
          <p className="text-gray-600">
            {order.shippingDetails.firstName} {order.shippingDetails.lastName}
          </p>
          {order.shippingDetails.company && (
            <p className="text-gray-600">{order.shippingDetails.company}</p>
          )}
          <p className="text-gray-600">{order.shippingDetails.address}</p>
          <p className="text-gray-600">
            {order.shippingDetails.city}, {order.shippingDetails.country}
          </p>
          <p className="text-gray-600">Phone: {order.shippingDetails.phone}</p>
          <p className="text-gray-600">Email: {order.shippingDetails.email}</p>
        </div>

        {/* Order Items */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Items</h3>
          <div className="space-y-2">
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
                    <h4 className="text-gray-800 font-medium">
                      {item.product.title}
                    </h4>
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
        </div>

        {/* Order Summary */}
        <div className="border-t border-gray-200 pt-2">
          <h3 className="text-lg font-medium mb-2">Order Summary</h3>
          <div className="flex justify-between text-gray-600 mb-1">
            <p>Subtotal</p>
            <p>${order.subtotal.toFixed(2)}</p>
          </div>
          <div className="flex justify-between text-gray-600 mb-1">
            <p>Shipping</p>
            <p>
              {order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`}
            </p>
          </div>
          <div className="flex justify-between text-gray-800 font-semibold">
            <p>Total</p>
            <p>${order.total.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link href="/orders" className="text-primary hover:underline">
          Back to Order History
        </Link>
      </div>
    </div>
  );
};

export default OrderDetails;
