"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import { FaEye, FaHeart, FaRegHeart, FaStar, FaRegStar } from "react-icons/fa";
import { getProducts } from "@/actions/products";
import { getWishlist, updateWishlist } from "@/actions/wishlist";
import { addToCart, getCart } from "@/actions/cart-utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const CategoryPage = ({ params }) => {
  const { slug } = params;
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; 

  const decodedSlug = decodeURIComponent(slug);

  const formattedCategoryName = decodedSlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  // Fetch products
  const { data, error, isLoading } = useQuery({
    queryKey: ["categoryProducts", slug],
    queryFn: () => getProducts({ category: decodedSlug }),
    onError: (error) => {
      toast.error(`Error fetching products: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    },
  });

  // Fetch wishlist
  const { data: wishlistData, error: wishlistError, isLoading: wishlistLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
    enabled: status === "authenticated",
    onError: (error) => {
      if (!error.message.includes("Unauthorized")) {
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
    enabled: status === "authenticated",
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

  // Mutation to add/remove product from wishlist
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
  const wishlist = wishlistData?.wishlist || [];
  const isInWishlist = (productId) => wishlist.some((item) => item._id === productId);

  // Check if a product is in the cart
  const isInCart = (productId) => {
    return cartData?.cart?.items?.some(
      (item) => item.product._id.toString() === productId
    ) || false;
  };

  // Handle adding/removing from wishlist
  const handleToggleWishlist = (productId, e) => {
    e.preventDefault();
    if (status !== "authenticated") {
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
    if (status !== "authenticated") {
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

  // Reset to first page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Failed to load products. Please try again later.</p>
      </div>
    );
  }

  const products = data?.products || [];

  // Pagination logic
  const totalItems = products.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  
  // Ensure current page is within valid range
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  if (validCurrentPage !== currentPage) {
    setCurrentPage(validCurrentPage);
  }
  
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedProducts = products.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page numbers for pagination display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show a limited set of pages with ellipsis
      if (validCurrentPage <= 3) {
        // Near the start
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (validCurrentPage >= totalPages - 2) {
        // Near the end
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Middle area
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = validCurrentPage - 1; i <= validCurrentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  return (
    <>
      {/* <Navbar /> */}
      <div className="min-h-screen py-10 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="text-2xl font-semibold text-gray-800 mb-8 text-center uppercase">
            {formattedCategoryName}
          </h1>
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-center text-gray-600 text-lg mb-4">
                No products found in this category.
              </p>
              <Link
                href="/products"
                className="px-6 py-2 text-center text-sm text-white bg-primary border border-primary rounded hover:bg-transparent hover:text-primary transition uppercase font-roboto font-medium"
              >
                Browse All Products
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-4 text-gray-600">
                Showing {startIndex + 1}-{endIndex} of {totalItems} products
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {paginatedProducts.map((product) => {
                  const productInCart = isInCart(product._id);
                  return (
                    <div
                      key={product._id}
                      className="bg-white shadow-md rounded-lg overflow-hidden h-[400px] w-full flex flex-col group"
                    >
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
                            onClick={(e) => handleToggleWishlist(product._id, e)}
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
                            {wishlistMutation.isPending && wishlistMutation.variables?.productId === product._id ? (
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
                          {cartMutation.isPending && cartMutation.variables?.productId === product._id ? (
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

              {/* Pagination Controls - Improved */}
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
                    {getPageNumbers().map((page, index) => (
                      page === '...' ? (
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
                    ))}

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
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CategoryPage;