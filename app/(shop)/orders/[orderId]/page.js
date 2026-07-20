"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getOrderById } from "@/actions/order-utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";
import { DetailSkeleton } from "@/components/skeletons";
import LoadError from "@/components/LoadError";

// PDF is now generated server-side (GET /api/orders/[id]/receipt) - this
// just fetches those bytes and triggers the browser download, instead of
// shipping ~290 lines of pdf-lib to the client.
const downloadReceipt = async (order) => {
  try {
    const res = await fetch(`/api/orders/${order._id}/receipt`);
    if (!res.ok) throw new Error("Failed to generate receipt");

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `SwiftCart_Order_${order._id}_Receipt.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Receipt downloaded successfully!", {
      position: "top-right",
      autoClose: 3000,
    });
  } catch (err) {
    console.error("Error downloading receipt:", err);
    toast.error("Failed to generate receipt. Please try again.", {
      position: "top-right",
      autoClose: 3000,
    });
  }
};

const OrderDetails = () => {
  const { orderId } = useParams();
  const { data: session } = useSession();
  const router = useRouter();

  const { data, error, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const result = await getOrderById(orderId);
      return result.order;
    },
    enabled: !!session && !!orderId,
  });

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (error) {
    return (
      <div className="container py-16 flex justify-center">
        <LoadError message="Failed to load order details. Please try again later." />
      </div>
    );
  }

  const order = data;

  return (
    <div className="bg-gradient-to-br from-gray-100 via-blue-50 to-teal-50 py-8 px-4">
      <div className="container py-5 bg-white/90 ">
      <h2 className="text-2xl font-medium mb-6">Order Details</h2>

      <div className="border border-gray-200 rounded p-4 shadow-sm">
        {/* Order Overview */}
        <div className="mb-6">
          <p className="text-gray-800 font-medium">Order ID: {order?._id}</p>
          <p className="text-gray-600 text-sm">
            Placed on: {new Date(order?.createdAt).toLocaleDateString()}
          </p>
          <p className="text-gray-600 text-sm">
            Status:{" "}
            <span
              className={`font-medium ${
                order?.status === "Pending"
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {order?.status}
            </span>
          </p>
        </div>

        {/* Shipping Details */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Shipping Details</h3>
          <p className="text-gray-600">
            {order?.shippingDetails.firstName} {order?.shippingDetails.lastName}
          </p>
          {order?.shippingDetails.company && (
            <p className="text-gray-600">{order?.shippingDetails.company}</p>
          )}
          <p className="text-gray-600">{order?.shippingDetails.address}</p>
          <p className="text-gray-600">
            {order?.shippingDetails.city}, {order?.shippingDetails.country}
          </p>
          <p className="text-gray-600">Phone: {order?.shippingDetails.phone}</p>
          <p className="text-gray-600">Email: {order?.shippingDetails.email}</p>
        </div>

        {/* Order Items */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Items</h3>
          <div className="space-y-2">
            {order?.items.map((item) => (
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
            <p>${order?.subtotal.toFixed(2)}</p>
          </div>
          <div className="flex justify-between text-gray-600 mb-1">
            <p>Shipping</p>
            <p>
              {order?.shipping === 0 ? "Free" : `$${order?.shipping.toFixed(2)}`}
            </p>
          </div>
          <div className="flex justify-between text-gray-800 font-semibold">
            <p>Total</p>
            <p>${order?.total.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex space-x-4">
        <Link href="/orders" className="text-primary hover:underline">
          Back to Order History
        </Link>
        <button
          onClick={() => downloadReceipt(order)}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition"
        >
          Download Receipt
        </button>
      </div>
    </div>
    </div>
  );
};

export default OrderDetails;