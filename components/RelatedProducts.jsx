import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaEye, FaHeart } from "react-icons/fa";

const RelatedProducts = ({relatedProducts, relatedError, relatedLoading}) => {
  console.log(relatedProducts)
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
      {!relatedLoading && !relatedError && relatedProducts?.products?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts?.products?.map((product) => (
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
                <a
                  href="#"
                  className="text-white text-lg w-9 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-gray-800 transition"
                  title="Add to Wishlist"
                >
                  <FaHeart />
                </a>
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
                      <i className="fa-solid fa-star"></i>
                    </span>
                  ))}
                </div>
                <div className="text-xs text-gray-500 ml-2">(150)</div>
              </div>

              {/* Add to Cart Button */}
              <a
                href="#"
                className="mt-auto block w-full py-2 text-center text-white bg-red-500 rounded-lg font-medium uppercase hover:bg-red-600 transition"
              >
                Add to cart
              </a>
            </div>
          </div>
          ))}
        </div>
      )}

      {/* Empty State: No Products */}
      {!relatedLoading && !relatedError && (!relatedProducts || relatedProducts.length === 0) && (
        <div className="text-center text-gray-600">
          <p>No related products found.</p>
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;
