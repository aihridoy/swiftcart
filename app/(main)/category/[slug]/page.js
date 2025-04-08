"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import { FaEye, FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import { getProducts } from "@/actions/products";
import { getWishlist, updateWishlist } from "@/actions/wishlist";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const CategoryPage = ({ params }) => {
  const { slug } = params;
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const router = useRouter();

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
    enabled: !!session, // Only fetch if user is authenticated
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

  // Mutation to add/remove product from wishlist
  const mutation = useMutation({
    mutationFn: ({ productId, action }) => updateWishlist(productId, action),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["wishlist"]); // Update wishlist count in Header
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

  // Check if a product is in the wishlist
  const wishlist = wishlistData?.wishlist || [];
  const isInWishlist = (productId) => wishlist.some((item) => item._id === productId);

  // Handle adding/removing from wishlist
  const handleToggleWishlist = (productId, e) => {
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
    const action = isInWishlist(productId) ? "remove" : "add";
    mutation.mutate({ productId, action });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading products...</p>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {products.map((product) => (
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
                        disabled={wishlistLoading || (mutation.isLoading && mutation.variables?.productId === product._id)}
                        className={`text-white text-lg w-9 h-8 rounded-full flex items-center justify-center transition ${
                          isInWishlist(product._id)
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-primary hover:bg-gray-800"
                        } ${
                          wishlistLoading || (mutation.isLoading && mutation.variables?.productId === product._id)
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        title={isInWishlist(product._id) ? "Remove from Wishlist" : "Add to Wishlist"}
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
                            <FaStar />
                          </span>
                        ))}
                      </div>
                      <div className="text-xs text-gray-500 ml-2">(150)</div>
                    </div>
                    <a
                      href="#"
                      className="mt-auto block w-full py-2 text-center text-white bg-red-500 rounded-lg font-medium uppercase hover:bg-red-600 transition"
                    >
                      Add to Cart
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CategoryPage;