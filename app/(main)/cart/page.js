"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import { FaTrash } from "react-icons/fa";
import { getCart, removeFromCart } from "@/actions/cart-utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const CartPage = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const router = useRouter();

  // Fetch cart
  const { data, error, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: !!session,
    onError: (error) => {
      if (!error.message.includes("Unauthorized")) {
        toast.error(`Error fetching cart: ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    },
  });

  // Mutation to remove item from cart
  const mutation = useMutation({
    mutationFn: (productId) => removeFromCart(productId),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["cart"]);
      toast.success(data.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    },
    onError: (error) => {
      if (error.message.includes("Unauthorized")) {
        toast.error("Please log in to manage your cart.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        toast.error(`Error: ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    },
  });

  // Handle remove from cart
  const handleRemoveFromCart = (productId, e) => {
    e.preventDefault();
    if (!session) {
      toast.error("Please log in to manage your cart.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        router.push("/login");
      }, 3000);
      return;
    }
    if (mutation.isLoading) return;
    mutation.mutate(productId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Failed to load cart. Please try again later.</p>
      </div>
    );
  }

  const cart = data?.cart || { items: [] };
  const total = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen py-10 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <h1 className="text-2xl font-semibold text-gray-800 mb-8 text-center uppercase">
          Your Cart
        </h1>
        {cart.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-center text-gray-600 text-lg mb-4">
              Your cart is empty.
            </p>
            <Link
              href="/products"
              className="px-6 py-2 text-center text-sm text-white bg-primary border border-primary rounded hover:bg-transparent hover:text-primary transition uppercase font-roboto font-medium"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cart Items */}
            {cart.items.map((item) => (
              <div
                key={item.product._id}
                className="flex items-center bg-white shadow-md rounded-lg p-4"
              >
                <Link href={`/products/${item.product._id}`}>
                  <Image
                    src={item.product.mainImage}
                    alt={item.product.title}
                    width={100}
                    height={100}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </Link>
                <div className="ml-4 flex-grow">
                  <Link href={`/products/${item.product._id}`}>
                    <h4 className="font-medium text-base text-gray-800 uppercase mb-2 hover:text-primary transition">
                      {item.product.title}
                    </h4>
                  </Link>
                  <p className="text-lg text-primary font-semibold">
                    ${item.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <button
                  onClick={(e) => handleRemoveFromCart(item.product._id, e)}
                  disabled={mutation.isLoading && mutation.variables === item.product._id}
                  className={`text-red-500 hover:text-red-700 transition ${
                    mutation.isLoading && mutation.variables === item.product._id
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {mutation.isLoading && mutation.variables === item.product._id ? (
                    <svg
                      className="animate-spin h-5 w-5 text-red-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <FaTrash />
                  )}
                </button>
              </div>
            ))}

            {/* Cart Summary */}
            <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800">
                Total: ${total.toFixed(2)}
              </h3>
              <Link href="/checkout">
                <button className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark transition uppercase font-medium">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;