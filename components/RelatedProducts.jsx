"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCart, getCart } from "@/actions/cart-utils";
import { getWishlist, updateWishlist } from "@/actions/wishlist";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaEye, FaHeart, FaRegHeart, FaStar, FaRegStar } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const RelatedProducts = ({ relatedProducts, relatedError, relatedLoading }) => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; 

  // Fetch wishlist
  const { data: wishlistData, error: wishlistError, isLoading: wishlistLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
    enabled: !!session,
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

  // Wishlist mutation
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
      queryClient.invalidateQueries(["cart"]);
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

  // Check if a product is in the wishlist
  const isInWishlist = (productId) => {
    return wishlistData?.wishlist?.some((item) => item._id.toString() === productId) || false;
  };

  // Check if a product is in the cart
  const isInCart = (productId) => {
    return cartData?.cart?.items?.some((item) => item.product._id.toString() === productId) || false;
  };

  // Handle wishlist toggle
  const handleWishlistToggle = (productId, e) => {
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
    if (wishlistLoading || wishlistMutation.isLoading) return;

    const action = isInWishlist(productId) ? "remove" : "add";
    wishlistMutation.mutate({ productId, action });
  };

  // Handle add to cart or view cart
  const handleCartAction = (productId, e) => {
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

    if (isInCart(productId)) {
      router.push("/cart");
    } else {
      if (cartMutation.isLoading) return;
      cartMutation.mutate({ productId, quantity: 1 });
    }
  };

  // Pagination logic
  const products = relatedProducts?.products || [];
  const totalItems = products.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = products.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container pb-16">
      <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6">
        Related Products
      </h2>

      {/* Loading State */}
      {relatedLoading && (
        <div className="text-center text-gray-600">
          <p>Loading related products...</p>
          <div className="flex justify-center mt-4">
            <svg
              className="animate-spin h-8 w-8 text-primary"
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
          </div>
        </div>
      )}

      {/* Error State */}
      {relatedError && !relatedLoading && (
        <div className="text-center text-red-600">
          <p>Error loading related products: {relatedError}</p>
          <p>Please try again later.</p>
        </div>
      )}

      {/* Success State: Render Products */}
      {!relatedLoading && !relatedError && products.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedProducts.map((product) => {
              const productInCart = isInCart(product._id);
              return (
                <div
                  key={product._id}
                  className="bg-white shadow-md rounded-lg overflow-hidden h-[400px] w-full flex flex-col group"
                >
                  {/* Product Image with Hover Effect */}
                  <div className="relative w-full h-48">
                    <Link href={`/products/${product._id}`}>
                      <Image
                        src={product.mainImage}
                        alt={product.title}
                        width={500}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition">
                      <Link
                        href={`/products/${product._id}`}
                        className="text-white text-lg w-9 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-gray-800 transition"
                        title="View Product"
                      >
                        <FaEye />
                      </Link>
                      <button
                        onClick={(e) => handleWishlistToggle(product._id, e)}
                        disabled={wishlistLoading || (wishlistMutation.isLoading && wishlistMutation.variables?.productId === product._id)}
                        className={`text-white text-lg w-9 h-8 rounded-full flex items-center justify-center transition ${
                          isInWishlist(product._id)
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-primary hover:bg-gray-800"
                        } ${
                          wishlistLoading || (wishlistMutation.isLoading && wishlistMutation.variables?.productId === product._id)
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        title={isInWishlist(product._id) ? "Remove from Wishlist" : "Add to Wishlist"}
                      >
                        {wishlistMutation.isLoading && wishlistMutation.variables?.productId === product._id ? (
                          <svg
                            className="animate-spin h-5 w-5 text-white"
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
                        ) : isInWishlist(product._id) ? (
                          <FaHeart className="text-white" />
                        ) : (
                          <FaRegHeart className="text-white" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4 flex flex-col flex-grow">
                    <Link href={`/products/${product._id}`}>
                      <h4 className="font-medium text-base text-gray-800 uppercase mb-2 hover:text-primary transition line-clamp-2">
                        {product.title}
                      </h4>
                    </Link>
                    <div className="flex items-center mb-2">
                      <p className="text-lg text-primary font-semibold">
                        ${product.price.toFixed(2)}
                      </p>
                      {product.originalPrice && (
                        <p className="text-sm text-gray-400 line-through ml-2">
                          ${product.originalPrice.toFixed(2)}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center mb-2">
                      <div className="flex gap-1 text-sm text-yellow-400">
                        {Array.from({ length: 5 }, (_, index) => (
                          <span key={index}>
                            {index < (product.rating || 0) ? (
                              <FaStar />
                            ) : (
                              <FaRegStar />
                            )}
                          </span>
                        ))}
                      </div>
                      <div className="text-xs text-gray-500 ml-2">
                        ({product.reviewCount || 150})
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={(e) => handleCartAction(product._id, e)}
                      disabled={cartLoading || (cartMutation.isLoading && cartMutation.variables?.productId === product._id)}
                      className={`mt-auto block w-full py-2 text-center text-white rounded-lg font-medium uppercase transition ${
                        cartMutation.isLoading && cartMutation.variables?.productId === product._id
                          ? "bg-red-400 cursor-not-allowed"
                          : productInCart
                          ? "bg-blue-500 hover:bg-blue-600"
                          : "bg-red-500 hover:bg-red-600"
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
                        "Add to cart"
                      )}
                    </button>
                  </div>
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
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
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
                ))}

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

      {/* Empty State: No Products */}
      {!relatedLoading && !relatedError && (!products || products.length === 0) && (
        <div className="text-center text-gray-600">
          <p>No related products found.</p>
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;