"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { FaEye, FaHeart, FaRegHeart, FaStar, FaRegStar } from "react-icons/fa";
import { getReviewsByProductId } from "@/actions/review-utils";

const ProductCard = ({
  product,
  wishlistData,
  wishlistLoading,
  mutation,
  handleWishlistToggle,
  cartData,
  cartLoading,
  cartMutation,
  handleCartAction,
  isInCart,
}) => {
  // Check if the product is in the wishlist
  const isInWishlist = wishlistData?.wishlist?.some(
    (item) => item._id.toString() === product._id
  );

  // Check if the product is in the cart
  const productInCart = isInCart(product._id);

  // Fetch reviews for this product
  const { data: reviewsData, error: reviewsError, isLoading: reviewsLoading } = useQuery({
    queryKey: ["reviews", product._id],
    queryFn: () => getReviewsByProductId(product._id),
    enabled: !!product._id,
    onError: (error) => {
      console.error(`Error fetching reviews for product ${product._id}:`, error);
    },
  });

  // Calculate average rating and total reviews
  const reviews = reviewsData || [];
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? Number((reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1))
    : 0;

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden h-[400px] w-full flex flex-col group">
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
            disabled={
              wishlistLoading ||
              (mutation.isPending && mutation.variables?.productId === product._id)
            }
            className={`text-white text-lg w-9 h-8 rounded-full flex items-center justify-center transition ${
              isInWishlist
                ? "bg-red-500 hover:bg-red-600"
                : "bg-primary hover:bg-gray-800"
            } ${
              wishlistLoading ||
              (mutation.isPending && mutation.variables?.productId === product._id)
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            {mutation.isPending && mutation.variables?.productId === product._id ? (
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
          {reviewsLoading ? (
            <div className="flex gap-1 text-sm text-gray-300">
              {Array.from({ length: 5 }, (_, index) => (
                <FaStar key={index} />
              ))}
            </div>
          ) : reviewsError ? (
            <div className="flex gap-1 text-sm text-gray-300">
              {Array.from({ length: 5 }, (_, index) => (
                <FaRegStar key={index} />
              ))}
            </div>
          ) : (
            <div className="flex gap-1 text-sm text-yellow-400">
              {Array.from({ length: 5 }, (_, index) => (
                <span key={index}>
                  {index < averageRating ? <FaStar /> : <FaRegStar />}
                </span>
              ))}
            </div>
          )}
          <div className="text-xs text-gray-500 ml-2">({totalReviews})</div>
        </div>

        {/* Add to Cart / View Cart Button */}
        <button
          onClick={(e) => handleCartAction(product._id, e)}
          disabled={
            cartLoading ||
            (cartMutation.isPending && cartMutation.variables?.productId === product._id)
          }
          className={`mt-auto block w-full py-2 text-center text-white rounded-lg font-medium uppercase transition ${
            cartLoading ||
            (cartMutation.isPending && cartMutation.variables?.productId === product._id)
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
};

export default ProductCard;