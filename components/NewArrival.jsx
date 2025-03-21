"use client";

import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import { FaEye, FaHeart } from "react-icons/fa";
import { getProducts } from "@/actions/products";

const NewArrival = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts({ limit: 8, sort: "-createdAt" }),
    onError: (error) => {
      toast.error(`Error fetching new arrivals: ${error.message}`, {
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

  if (isLoading) {
    return (
      <div className="container pb-16">
        <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6">
          Top New Arrival
        </h2>
        <p>Loading new arrivals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container pb-16">
        <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6">
          Top New Arrival
        </h2>
        <p>Failed to load new arrivals. Please try again later.</p>
      </div>
    );
  }

  const products = data?.products || [];

  return (
    <div className="container py-16 bg-white">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-medium text-gray-800 uppercase">
      Top New Arrival
    </h2>
    <Link href="/products">
      <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
        See All Products
      </button>
    </Link>
  </div>
  {products.length === 0 ? (
    <p className="text-center text-gray-600">No new arrivals found.</p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {products.map((product) => (
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
</div>
  );
};

export default NewArrival;
