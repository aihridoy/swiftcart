"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import { FaTrash } from "react-icons/fa";
import { getWishlist, updateWishlist } from "@/actions/wishlist";
import { addToCart, getCart } from "@/actions/cart-utils"; // Import cart actions
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Wishlist = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch wishlist
  const { data, error, isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
    enabled: !!session, // Only fetch if user is authenticated
    onError: (error) => {
      if (error.message.includes("Unauthorized")) {
        toast.error("Please log in to view your wishlist.", {
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
        toast.error(`Error fetching wishlist: ${error.message}`, {
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

  // Fetch cart
  const { data: cartData, error: cartError, isLoading: cartLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: !!session,
    onError: (error) => {
      if (error.message.includes("Unauthorized")) {
        toast.error("Please log in to view your cart.", {
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

  // Mutation to remove item from wishlist
  const wishlistMutation = useMutation({
    mutationFn: ({ productId, action }) => updateWishlist(productId, action),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["wishlist"]);
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
        toast.error("Please log in to manage your wishlist.", {
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

  // Cart mutation
  const cartMutation = useMutation({
    mutationFn: ({ productId, quantity }) => addToCart(productId, quantity),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["cart"]); // Update cart count in Header
      toast.success("Product added to cart successfully!", {
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
        toast.error("Please log in to add to cart.", {
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

  // Check if a product is in the cart
  const isInCart = (productId) => {
    return cartData?.cart?.items?.some(
      (item) => item.product._id.toString() === productId
    ) || false;
  };

  // Handle removing an item from the wishlist
  const handleRemoveFromWishlist = (productId, e) => {
    e.preventDefault();
    if (!session) {
      toast.error("Please log in to manage your wishlist.", {
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
    if (wishlistMutation.isLoading) return;
    wishlistMutation.mutate({ productId, action: "remove" });
  };

  // Handle adding to cart or viewing cart
  const handleCartAction = (product, e) => {
    e.preventDefault();
    if (!session) {
      toast.error("Please log in to add to cart.", {
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

    // Check stock availability
    if (product.availability !== "In Stock") {
      toast.error(`${product.title} is out of stock.`, {
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

    if (isInCart(product._id)) {
      // If product is already in cart, redirect to cart page
      router.push("/cart");
    } else {
      // If product is not in cart, add it
      if (cartMutation.isLoading) return;
      cartMutation.mutate({ productId: product._id, quantity: 1 });
    }
  };

  if (isLoading) {
    return (
      <div className="container pt-4 pb-16">
        <h1 className="text-2xl font-semibold text-gray-800 mb-8 text-center uppercase">
          Your Wishlist
        </h1>
        <p className="text-center">Loading wishlist...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container pt-4 pb-16">
        <h1 className="text-2xl font-semibold text-gray-800 mb-8 text-center uppercase">
          Your Wishlist
        </h1>
        <p className="text-center">Failed to load wishlist. Please try again later.</p>
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
    <div className="container gap-6 pt-4 pb-16 min-h-[calc(100vh-200px)]">
      <h1 className="text-2xl font-semibold text-gray-800 mb-8 text-center uppercase">
        Your Wishlist
      </h1>
      {wishlist.length === 0 ? (
        <div className="text-center text-gray-600">
          <p className="mb-4">Your wishlist is empty.</p>
          <Link
            href="/products"
            className="px-6 py-2 text-center text-sm text-white bg-primary border border-primary rounded hover:bg-transparent hover:text-primary transition uppercase font-roboto font-medium"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          <div className="mx-auto space-y-4 max-w-6xl">
            {paginatedWishlist.map((product) => {
              const productInCart = isInCart(product._id);
              return (
                <div
                  key={product._id}
                  className="flex items-center justify-between border gap-6 p-4 border-gray-200 rounded"
                >
                  <div className="w-28 h-28 flex-shrink-0">
                    <Link href={`/products/${product._id}`}>
                      <Image
                        width={112}
                        height={112}
                        src={product.mainImage}
                        alt={product.title}
                        className="w-full h-full object-cover rounded"
                      />
                    </Link>
                  </div>
                  <div className="w-1/3">
                    <Link href={`/products/${product._id}`}>
                      <h2 className="text-gray-800 text-xl font-medium uppercase hover:text-primary transition">
                        {product.title}
                      </h2>
                    </Link>
                    <p className="text-gray-500 text-sm">
                      Availability:{" "}
                      <span
                        className={
                          product.availability === "In Stock"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {product.availability}
                      </span>
                    </p>
                  </div>
                  <div className="text-primary text-lg font-semibold">
                    ${product.price.toFixed(2)}
                  </div>
                  <button
                    onClick={(e) => handleCartAction(product, e)}
                    disabled={cartLoading || product.availability !== "In Stock" || (cartMutation.isLoading && cartMutation.variables?.productId === product._id)}
                    className={`px-6 py-2 text-center text-sm text-white border rounded transition uppercase font-roboto font-medium ${
                      cartLoading || product.availability !== "In Stock" || (cartMutation.isLoading && cartMutation.variables?.productId === product._id)
                        ? "bg-red-400 border-red-400 cursor-not-allowed"
                        : productInCart
                        ? "bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600"
                        : "bg-primary border-primary hover:bg-transparent hover:text-primary"
                    }`}
                  >
                    {cartMutation.isLoading && cartMutation.variables?.productId === product._id ? (
                      <svg
                        className="animate-spin h-5 w-5 text-white mx-auto"
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
                    ) : productInCart ? (
                      "View In Cart"
                    ) : (
                      "Add to Cart"
                    )}
                  </button>
                  <button
                    onClick={(e) => handleRemoveFromWishlist(product._id, e)}
                    disabled={wishlistMutation.isLoading && wishlistMutation.variables?.productId === product._id}
                    className={`text-gray-600 cursor-pointer hover:text-primary transition border-2 border-red-500 rounded-full p-2 ${
                      wishlistMutation.isLoading && wishlistMutation.variables?.productId === product._id
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {wishlistMutation.isLoading && wishlistMutation.variables?.productId === product._id ? (
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
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 text-sm font-medium rounded ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-primary text-white hover:bg-primary-dark"
                  }`}
                >
                  Previous
                </button>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 text-sm font-medium rounded ${
                        currentPage === page
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
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 text-sm font-medium rounded ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-primary text-white hover:bg-primary-dark"
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Wishlist;