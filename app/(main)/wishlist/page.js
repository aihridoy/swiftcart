"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import { FaTrash } from "react-icons/fa";
import { getWishlist, updateWishlist } from "@/actions/wishlist";

const Wishlist = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch wishlist
  const { data, error, isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
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
        window.location.href = "/login";
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

  // Mutation to remove item from wishlist
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
          window.location.href = "/login";
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

  // Handle removing an item from the wishlist
  const handleRemoveFromWishlist = (productId) => {
    if (mutation.isLoading) return;
    mutation.mutate({ productId, action: "remove" });
  };

  // Handle adding to cart (placeholder functionality)
  const handleAddToCart = (product) => {
    if (product.availability !== "In Stock") {
      toast.error("This product is out of stock.", {
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
    toast.success(`${product.title} added to cart!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
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
        <p className="text-center text-gray-600">Your wishlist is empty.</p>
      ) : (
        <>
          <div className="mx-auto space-y-4 max-w-6xl">
            {paginatedWishlist.map((product) => (
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
                  onClick={() => handleAddToCart(product)}
                  disabled={product.availability !== "In Stock"}
                  className={`px-6 py-2 text-center text-sm text-white border rounded transition uppercase font-roboto font-medium ${
                    product.availability === "In Stock"
                      ? "bg-primary border-primary hover:bg-transparent hover:text-primary"
                      : "bg-red-400 border-red-400 cursor-not-allowed"
                  }`}
                >
                  Add to Cart
                </button>
                <button
                  style={{border: "2px solid #red"}}
                  onClick={() => handleRemoveFromWishlist(product._id)}
                  disabled={mutation.isLoading}
                  className={`text-gray-600 cursor-pointer hover:text-primary transition ${
                    mutation.isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {mutation.isLoading &&
                  mutation.variables?.productId === product._id ? (
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