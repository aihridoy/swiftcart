"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import { FaTrash } from "react-icons/fa";
import { getCart, removeFromCart, updateCartQuantity } from "@/actions/cart-utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const CartPage = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const router = useRouter();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
  const removeMutation = useMutation({
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

  // Mutation to update quantity in cart
  const updateQuantityMutation = useMutation({
    mutationFn: ({ productId, quantity }) => updateCartQuantity(productId, quantity),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["cart"]);
      toast.success("Quantity updated successfully", {
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
    if (removeMutation.isLoading) return;
    removeMutation.mutate(productId);
  };

  // Handle quantity increase
  const handleIncreaseQuantity = (productId, currentQuantity, productStock, e) => {
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

    const maxQuantity = productStock !== undefined ? productStock : 10; // Fallback to 10 if stock isn't available
    const newQuantity = currentQuantity + 1;

    if (newQuantity > maxQuantity) {
      toast.warn(`Cannot add more than ${maxQuantity} items.`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    if (updateQuantityMutation.isLoading) return;
    updateQuantityMutation.mutate({ productId, quantity: newQuantity });
  };

  // Handle quantity decrease
  const handleDecreaseQuantity = (productId, currentQuantity, e) => {
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

    const newQuantity = currentQuantity > 1 ? currentQuantity - 1 : 1;
    if (newQuantity === currentQuantity) return; // No change needed if already at minimum
    if (updateQuantityMutation.isLoading) return;
    updateQuantityMutation.mutate({ productId, quantity: newQuantity });
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page numbers for pagination display
  const getPageNumbers = (totalPages, currentPage) => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
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

  // Pagination logic
  const totalItems = cart.items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  if (validCurrentPage !== currentPage) {
    setCurrentPage(validCurrentPage);
  }

  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedItems = cart.items.slice(startIndex, endIndex);

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
            {/* Cart items summary */}
            <div className="mb-4 text-gray-600">
              Showing {startIndex + 1}-{endIndex} of {totalItems} items in your cart
            </div>

            {/* Cart Items */}
            {paginatedItems.map((item) => (
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
                  <div className="flex items-center mt-2">
                    <button
                      onClick={(e) =>
                        handleDecreaseQuantity(item.product._id, item.quantity, e)
                      }
                      disabled={
                        item.quantity === 1 ||
                        (updateQuantityMutation.isLoading &&
                          updateQuantityMutation.variables?.productId === item.product._id)
                      }
                      className={`h-8 w-8 text-xl flex items-center justify-center select-none transition ${
                        item.quantity === 1 ||
                        (updateQuantityMutation.isLoading &&
                          updateQuantityMutation.variables?.productId === item.product._id)
                          ? "text-gray-400 cursor-not-allowed"
                          : "cursor-pointer hover:bg-gray-100"
                      }`}
                    >
                      -
                    </button>
                    <div className="h-8 w-8 text-base flex items-center justify-center">
                      {updateQuantityMutation.isLoading &&
                      updateQuantityMutation.variables?.productId === item.product._id ? (
                        <svg
                          className="animate-spin h-5 w-5 text-primary"
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
                        item.quantity
                      )}
                    </div>
                    <button
                      onClick={(e) =>
                        handleIncreaseQuantity(
                          item.product._id,
                          item.quantity,
                          item.product.inStock, // Use item.product.stock if available
                          e
                        )
                      }
                      disabled={
                        (item.product.inStock !== undefined &&
                          item.quantity >= item.product.inStock) ||
                        (updateQuantityMutation.isLoading &&
                          updateQuantityMutation.variables?.productId === item.product._id)
                      }
                      className={`h-8 w-8 text-xl flex items-center justify-center select-none transition ${
                        (item.product.inStock !== undefined &&
                          item.quantity >= item.product.inStock) ||
                        (updateQuantityMutation.isLoading &&
                          updateQuantityMutation.variables?.productId === item.product._id)
                          ? "text-gray-400 cursor-not-allowed"
                          : "cursor-pointer hover:bg-gray-100"
                      }`}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={(e) => handleRemoveFromCart(item.product._id, e)}
                  disabled={
                    removeMutation.isLoading &&
                    removeMutation.variables === item.product._id
                  }
                  className={`text-red-500 hover:text-red-700 transition ${
                    removeMutation.isLoading &&
                    removeMutation.variables === item.product._id
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {removeMutation.isLoading &&
                  removeMutation.variables === item.product._id ? (
                    <svg
                        className="animate-spin h-5 w-5 text-gray-600"
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
                    <FaTrash className="text-lg" />
                  )}
                </button>
              </div>
            ))}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(validCurrentPage - 1)}
                    disabled={validCurrentPage === 1}
                    className={`px-4 py-2 text-sm font-medium rounded ${
                      validCurrentPage === 1
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-primary text-white hover:bg-primary-dark"
                    }`}
                  >
                    Previous
                  </button>

                  {/* Page Numbers with Ellipsis */}
                  {getPageNumbers(totalPages, validCurrentPage).map((page, index) =>
                    page === "..." ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-4 py-2 text-sm font-medium"
                      >
                        {page}
                      </span>
                    ) : (
                      <button
                        key={`page-${page}`}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 text-sm font-medium rounded ${
                          validCurrentPage === page
                            ? "bg-primary text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(validCurrentPage + 1)}
                    disabled={validCurrentPage === totalPages}
                    className={`px-4 py-2 text-sm font-medium rounded ${
                      validCurrentPage === totalPages
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-primary text-white hover:bg-primary-dark"
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}

            {/* Cart Summary - Always visible */}
            <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800">
                Total: ${total.toFixed(2)}
              </h3>
              <Link href={`/cart/${cart._id}`}>
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