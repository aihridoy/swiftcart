"use client";

import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import { 
  FaTrash, 
  FaShoppingCart, 
  FaArrowLeft, 
  FaArrowRight, 
  FaSpinner, 
  FaPlus, 
  FaMinus 
} from "react-icons/fa";
import { getCart, removeFromCart, updateCartQuantity } from "@/actions/cart-utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { session } from "@/actions/auth-utils";

// Skeleton Loader for Cart Items
const SkeletonCartItem = () => (
  <div className="bg-white rounded-xl shadow-md p-4 animate-pulse">
    <div className="flex items-center space-x-4">
      <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
      <div className="flex-1 space-y-2">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
      <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
    </div>
  </div>
);

const CartPage = () => {
  const queryClient = useQueryClient();
  const { data: userSession, status } = useSession();
  const router = useRouter();

  useEffect(() => {
      async function fetchUser() {
        const res = await session();
        if(!res?.user) {
          router.push("/");
        }
      }
      fetchUser();
    }, [router]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch cart
  const { data, error, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: !!userSession,
    onError: (error) => {
      if (!error.message.includes("Unauthorized")) {
        toast.error(`Error fetching cart: ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
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
      });
    },
    onError: (error) => {
      if (error.message.includes("Unauthorized")) {
        toast.error("Please log in to manage your cart.", {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        toast.error(`Error: ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
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
      });
    },
    onError: (error) => {
      if (error.message.includes("Unauthorized")) {
        toast.error("Please log in to manage your cart.", {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        toast.error(`Error: ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    },
  });

  // Handle remove from cart
  const handleRemoveFromCart = (productId, e) => {
    e.preventDefault();
    if (status !== "authenticated") {
      toast.error("Please log in to manage your cart.", {
        position: "top-right",
        autoClose: 3000,
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
    if (status !== "authenticated") {
      toast.error("Please log in to manage your cart.", {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => {
        router.push("/login");
      }, 3000);
      return;
    }

    const maxQuantity = productStock !== undefined ? productStock : 10;
    const newQuantity = currentQuantity + 1;

    if (newQuantity > maxQuantity) {
      toast.warn(`Cannot add more than ${maxQuantity} items.`, {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (updateQuantityMutation.isLoading) return;
    updateQuantityMutation.mutate({ productId, quantity: newQuantity });
  };

  // Handle quantity decrease
  const handleDecreaseQuantity = (productId, currentQuantity, e) => {
    e.preventDefault();
    if (!userSession) {
      toast.error("Please log in to manage your cart.", {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => {
        router.push("/login");
      }, 3000);
      return;
    }

    const newQuantity = currentQuantity > 1 ? currentQuantity - 1 : 1;
    if (newQuantity === currentQuantity) return;
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

  // Loading state - Centered on the screen
  if (isLoading) {
    return (
      <div className=" bg-gradient-to-br from-gray-100 via-blue-50 to-teal-50 flex items-center justify-center py-8 px-4">
        <div className="space-y-4 w-full max-w-2xl">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonCartItem key={index} />
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
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <FaShoppingCart className="mr-2 text-blue-500" />
              Your Cart
            </h1>
          </div>
        </div>
        <div className="max-w-6xl mx-auto text-center bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6">
          <p className="text-red-600 text-lg">Failed to load cart. Please try again later.</p>
        </div>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-teal-50 py-8 px-4">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        {/* Cart Summary Card */}
        <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6 mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FaShoppingCart className="text-blue-500 text-2xl" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Total Items</h2>
              <p className="text-gray-600">{totalItems} {totalItems === 1 ? "item" : "items"}</p>
            </div>
          </div>
        </div>

        {/* Cart Items or Empty State */}
        {cart.items.length === 0 ? (
          <div className="flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-8 text-center max-w-md w-full">
              <FaShoppingCart className="text-gray-400 text-6xl mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Your Cart is Empty</h2>
              <p className="text-gray-600 mb-6">Add some products to your cart to get started!</p>
              <Link
                href="/products"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <FaShoppingCart />
                <span>Shop Now</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              {/* Cart Items Summary */}
              <div className="mb-4 text-gray-600">
                Showing {startIndex + 1}-{endIndex} of {totalItems} items in your cart
              </div>

              {/* Cart Items List */}
              <div className="space-y-4">
                {paginatedItems.map((item) => (
                  <div
                    key={item.product._id}
                    className="bg-white/90 backdrop-blur-lg rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <Link href={`/products/${item.product._id}`}>
                        <Image
                          src={item.product.mainImage}
                          alt={item.product.title}
                          width={100}
                          height={100}
                          className="w-24 h-24 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                      <div className="flex-1">
                        <Link href={`/products/${item.product._id}`}>
                          <h4 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors mb-2">
                            {item.product.title}
                          </h4>
                        </Link>
                        <p className="text-blue-600 text-lg font-semibold">
                          ${item.price.toFixed(2)}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2 shadow-sm">
                            <button
                              onClick={(e) =>
                                handleDecreaseQuantity(item.product._id, item.quantity, e)
                              }
                              disabled={
                                item.quantity === 1 ||
                                (updateQuantityMutation.isLoading &&
                                  updateQuantityMutation.variables?.productId === item.product._id)
                              }
                              className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
                                item.quantity === 1 ||
                                (updateQuantityMutation.isPending &&
                                  updateQuantityMutation.variables?.productId === item.product._id)
                                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                  : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                              }`}
                            >
                              <FaMinus />
                            </button>
                            <div className="w-12 text-center py-2 bg-white border border-gray-200 rounded-lg">
                              {updateQuantityMutation.isLoading &&
                              updateQuantityMutation.variables?.productId === item.product._id ? (
                                <FaSpinner className="animate-spin mx-auto" />
                              ) : (
                                item.quantity
                              )}
                            </div>
                            <button
                              onClick={(e) =>
                                handleIncreaseQuantity(
                                  item.product._id,
                                  item.quantity,
                                  item.product.inStock,
                                  e
                                )
                              }
                              disabled={
                                (item.product.inStock !== undefined &&
                                  item.quantity >= item.product.inStock) ||
                                (updateQuantityMutation.isLoading &&
                                  updateQuantityMutation.variables?.productId === item.product._id)
                              }
                              className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
                                (item.product.inStock !== undefined &&
                                  item.quantity >= item.product.inStock) ||
                                (updateQuantityMutation.isPending &&
                                  updateQuantityMutation.variables?.productId === item.product._id)
                                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                  : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                              }`}
                            >
                              <FaPlus />
                            </button>
                          </div>
                          <button
                            onClick={(e) => handleRemoveFromCart(item.product._id, e)}
                            disabled={
                              removeMutation.isLoading &&
                              removeMutation.variables === item.product._id
                            }
                            className={`p-2 rounded-full transition-all duration-300 ${
                              removeMutation.isLoading &&
                              removeMutation.variables === item.product._id
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-red-100 text-red-600 hover:bg-red-200 hover:shadow-md"
                            }`}
                          >
                            {removeMutation.isPending &&
                            removeMutation.variables === item.product._id ? (
                              <FaSpinner className="animate-spin" />
                            ) : (
                              <FaTrash />
                            )}
                          </button>
                        </div>
                      </div>
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
                          className={`px-4 py-2 rounded-lg font-semibold ${
                            validCurrentPage === page
                              ? "bg-blue-600 text-white shadow-lg"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          } transition-all duration-300`}
                        >
                          {page}
                        </button>
                      )
                    )}
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
            </div>

            {/* Cart Summary Sidebar */}
            {cart.items.length > 0 && (
              <div className="lg:col-span-1 bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6 sticky top-32 h-fit">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                  <FaShoppingCart className="mr-2 text-blue-500" />
                  Cart Summary
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Total Items:</span>
                    <span>{totalItems}</span>
                  </div>
                  <div className="flex justify-between text-gray-800 font-semibold text-lg">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <Link href={`/cart/${cart._id}`}>
                    <button className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg">
                      Proceed to Checkout
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;