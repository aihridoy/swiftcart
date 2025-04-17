"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import { FaEye, FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import { searchProducts } from "@/actions/products";
import { getWishlist, updateWishlist } from "@/actions/wishlist";
import { addToCart, getCart } from "@/actions/cart-utils";
import { useSession } from "next-auth/react";

const SearchPage = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  // Fetch search results
  const { data: searchResults, isLoading, error } = useQuery({
    queryKey: ["search", query],
    queryFn: () => searchProducts(query),
    enabled: !!query,
    onError: (error) => {
      toast.error(`Error fetching search results: ${error.message}`, {
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
  const mutation = useMutation({
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
    if (wishlistLoading || mutation.isLoading) return;

    const isInWishlist = wishlistData?.wishlist?.some(
      (item) => item._id.toString() === productId
    );
    const action = isInWishlist ? "remove" : "add";
    mutation.mutate({ productId, action });
  };

  // Check if a product is in the cart
  const isInCart = (productId) => {
    return cartData?.cart?.items?.some(
      (item) => item.product._id.toString() === productId
    ) || false;
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
      // If product is already in cart, redirect to cart page
      router.push("/cart");
    } else {
      // If product is not in cart, add it
      if (cartMutation.isLoading) return;
      cartMutation.mutate({ productId, quantity: 1 });
    }
  };

  if (isLoading) {
    return (
      <div className="container py-16 flex justify-center">
        <p>Loading search results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-16 flex justify-center">
        <p>Failed to load search results. Please try again later.</p>
      </div>
    );
  }

  const products = searchResults?.products || [];

  return (
    <div className="container py-16 bg-white">
      <h1 className="text-2xl font-medium text-gray-800 mb-6">
        Search Results for &quot;{query}&quot;
      </h1>
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-center text-gray-600 text-lg mb-4">
            No products found for your search.
          </p>
          <Link
            href="/products"
            className="px-6 py-2 text-center text-sm text-white bg-primary border border-primary rounded hover:bg-transparent hover:text-primary transition uppercase font-roboto font-medium"
          >
            Browse All Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            // Check if the product is in the wishlist
            const isInWishlist = wishlistData?.wishlist?.some(
              (item) => item._id.toString() === product._id
            );

            // Check if the product is in the cart
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
                      disabled={wishlistLoading || (mutation.isLoading && mutation.variables?.productId === product._id)}
                      className={`text-white text-lg w-9 h-8 rounded-full flex items-center justify-center transition ${
                        isInWishlist
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-primary hover:bg-gray-800"
                      } ${
                        wishlistLoading || (mutation.isLoading && mutation.variables?.productId === product._id)
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                      {mutation.isLoading && mutation.variables?.productId === product._id ? (
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
                      ) : isInWishlist ? (
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
                          <FaStar />
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500 ml-2">(150)</div>
                  </div>

                  {/* Add to Cart / View Cart Button */}
                  <button
                    onClick={(e) => handleCartAction(product._id, e)}
                    disabled={cartMutation.isLoading && cartMutation.variables?.productId === product._id}
                    className={`mt-auto block w-full py-2 text-center text-white rounded-lg font-medium uppercase transition ${
                      cartMutation.isLoading && cartMutation.variables?.productId === product._id
                        ? "bg-red-400 cursor-not-allowed"
                        : productInCart
                        ? "bg-blue-500 hover:bg-blue-600" // Different color for "View Cart"
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
      )}
    </div>
  );
};

export default SearchPage;