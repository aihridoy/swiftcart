"use client";

import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import { 
  FaTrash, 
  FaShoppingCart, 
  FaHeart, 
  FaArrowLeft, 
  FaArrowRight, 
  FaSpinner, 
  FaShoppingBag 
} from "react-icons/fa";
import { getWishlist, updateWishlist } from "@/actions/wishlist";
import { addToCart, getCart } from "@/actions/cart-utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { session } from "@/actions/auth-utils";

// Skeleton Loader for Wishlist Items
const SkeletonWishlistItem = () => (
  <div className="bg-white rounded-xl shadow-md p-4 animate-pulse">
    <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
    <div className="flex justify-between">
      <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
      <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
    </div>
  </div>
);

const Wishlist = () => {
  const queryClient = useQueryClient();
  const { data: userSession } = useSession();
  const router = useRouter();
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

  // Fetch wishlist
  const { data, error, isLoading } = useQuery({
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

  // Mutation to remove item from wishlist
  const wishlistMutation = useMutation({
    mutationFn: ({ productId, action }) => updateWishlist(productId, action),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["wishlist"]);
      toast.success(data.message, {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error) => {
      if (error.message.includes("Unauthorized")) {
        toast.error("Please log in to manage your wishlist.", {
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

  // Cart mutation
  const cartMutation = useMutation({
    mutationFn: ({ productId, quantity }) => addToCart(productId, quantity),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["cart"]);
      toast.success("Product added to cart successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error) => {
      if (error.message.includes("Unauthorized")) {
        toast.error("Please log in to add to cart.", {
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

  // Check if a product is in the cart
  const isInCart = (productId) => {
    return cartData?.cart?.items?.some(
      (item) => item.product._id.toString() === productId
    ) || false;
  };

  // Handle removing an item from the wishlist
  const handleRemoveFromWishlist = (productId, e) => {
    e.preventDefault();
    if (!userSession) {
      toast.error("Please log in to manage your wishlist.", {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => {
        router.push("/login");
      }, 3000);
      return;
    }
    if (wishlistMutation.isLoading) return;
    wishlistMutation.mutate({ productId, action: "remove" });
  };

  // Handle adding to cart or viewing cart
  const handleCartAction = (product, e) => {
    e.preventDefault();
    if (!userSession) {
      toast.error("Please log in to add to cart.", {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => {
        router.push("/login");
      }, 3000);
      return;
    }

    if (product.availability !== "In Stock") {
      toast.error(`${product.title} is out of stock.`, {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (isInCart(product._id)) {
      router.push("/cart");
    } else {
      if (cartMutation.isLoading) return;
      cartMutation.mutate({ productId: product._id, quantity: 1 });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-teal-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Summary Card Placeholder */}
          <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6 mb-6 flex items-center justify-between animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full" />
              <div>
                <div className="h-6 bg-gray-200 rounded w-32 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-16" />
              </div>
            </div>
            <div className="h-10 w-32 bg-gray-200 rounded-lg" />
          </div>
          {/* Skeleton Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonWishlistItem key={index} />
            ))}
          </div>
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
              <FaHeart className="mr-2 text-red-500" />
              Your Wishlist
            </h1>
          </div>
        </div>
        <div className="max-w-6xl mx-auto text-center bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6">
          <p className="text-red-600 text-lg">Failed to load wishlist. Please try again later.</p>
        </div>
      </div>
    );
  }

  const wishlist = data?.wishlist || [];

  // Pagination logic
  const totalItems = wishlist.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedWishlist = wishlist.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-teal-50 py-8 px-4">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        {/* Summary Card */}
        <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6 mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FaHeart className="text-red-500 text-2xl" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Wishlist Items</h2>
              <p className="text-gray-600">{totalItems} {totalItems === 1 ? "item" : "items"}</p>
            </div>
          </div>
          {wishlist.length > 0 && (
            <button
              onClick={() => {
                wishlist.forEach((product) => {
                  if (!isInCart(product._id) && product.availability === "In Stock") {
                    cartMutation.mutate({ productId: product._id, quantity: 1 });
                  }
                });
              }}
              disabled={cartMutation.isLoading}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold text-white transition-all duration-300 shadow-md ${
                cartMutation.isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
              }`}
            >
              <FaShoppingCart />
              <span>Add All to Cart</span>
            </button>
          )}
        </div>

        {/* Wishlist Items */}
        {wishlist.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-8 text-center">
            <FaHeart className="text-gray-400 text-6xl mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Your Wishlist is Empty</h2>
            <p className="text-gray-600 mb-6">Start adding your favorite products to your wishlist!</p>
            <Link
              href="/products"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <FaShoppingBag />
              <span>Browse Products</span>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedWishlist.map((product) => {
                const productInCart = isInCart(product._id);
                return (
                  <div
                    key={product._id}
                    className="bg-white/90 backdrop-blur-lg rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-300 group"
                  >
                    <Link href={`/products/${product._id}`}>
                      <div className="relative w-full h-48 mb-4">
                        <Image
                          width={300}
                          height={300}
                          src={product.mainImage}
                          alt={product.title}
                          className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                        />
                        <span
                          className={`absolute top-2 right-2 px-3 py-1 text-xs font-semibold rounded-full ${
                            product.availability === "In Stock"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.availability}
                        </span>
                      </div>
                    </Link>
                    <div className="space-y-2">
                      <Link href={`/products/${product._id}`}>
                        <h2 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                          {product.title}
                        </h2>
                      </Link>
                      <p className="text-blue-600 text-lg font-semibold">
                        ${product.price.toFixed(2)}
                      </p>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={(e) => handleCartAction(product, e)}
                          disabled={
                            cartLoading ||
                            product.availability !== "In Stock" ||
                            (cartMutation.isLoading && cartMutation.variables?.productId === product._id)
                          }
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 shadow-md ${
                            cartLoading ||
                            product.availability !== "In Stock" ||
                            (cartMutation.isLoading && cartMutation.variables?.productId === product._id)
                              ? "bg-gray-400 text-white cursor-not-allowed"
                              : productInCart
                              ? "bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg"
                              : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg"
                          }`}
                        >
                          {cartMutation.isLoading && cartMutation.variables?.productId === product._id ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            <FaShoppingCart />
                          )}
                          <span>{productInCart ? "View in Cart" : "Add to Cart"}</span>
                        </button>
                        <button
                          onClick={(e) => handleRemoveFromWishlist(product._id, e)}
                          disabled={
                            wishlistMutation.isLoading &&
                            wishlistMutation.variables?.productId === product._id
                          }
                          className={`p-2 rounded-full transition-all duration-300 ${
                            wishlistMutation.isLoading &&
                            wishlistMutation.variables?.productId === product._id
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-red-100 text-red-600 hover:bg-red-200 hover:shadow-md"
                          }`}
                        >
                          {wishlistMutation.isLoading &&
                          wishlistMutation.variables?.productId === product._id ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            <FaTrash />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    } transition-all duration-300 shadow-md`}
                  >
                    <FaArrowLeft />
                    <span>Previous</span>
                  </button>
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-lg font-semibold ${
                          currentPage === page
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        } transition-all duration-300`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 ${
                      currentPage === totalPages
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

export default Wishlist;