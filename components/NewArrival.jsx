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
    <div className="container pb-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-medium text-gray-800 uppercase">
          Top New Arrival
        </h2>
        <Link href="/products">
          <button className="bg-primary text-white px-4 py-2 rounded hover:bg-gray-800 transition">
            See All Products
          </button>
        </Link>
      </div>
      {products.length === 0 ? (
        <p className="text-center text-gray-600">No new arrivals found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white shadow rounded overflow-hidden group"
            >
              <div className="relative pt-[60%]">
                <Image
                  src={product.mainImage}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-fill absolute inset-0"
                />
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
              <div className="pt-4 pb-3 px-4">
                <Link href={`/products/${product._id}`}>
                  <h4 className="uppercase font-medium text-xl mb-2 text-gray-800 hover:text-primary transition">
                    {product.title}
                  </h4>
                </Link>
                <div className="flex items-baseline mb-1 space-x-2">
                  <p className="text-xl text-primary font-semibold">
                    ${product.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-400 line-through">
                    {product.originalPrice
                      ? `$${product.originalPrice.toFixed(2)}`
                      : ""}
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="flex gap-1 text-sm text-yellow-400">
                    <span>
                      <i className="fa-solid fa-star"></i>
                    </span>
                    <span>
                      <i className="fa-solid fa-star"></i>
                    </span>
                    <span>
                      <i className="fa-solid fa-star"></i>
                    </span>
                    <span>
                      <i className="fa-solid fa-star"></i>
                    </span>
                    <span>
                      <i className="fa-solid fa-star"></i>
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 ml-3">(150)</div>
                </div>
              </div>
              <a
                href="#"
                className="block w-full py-1 text-center text-white bg-primary border border-primary rounded-b hover:bg-transparent hover:text-primary transition"
              >
                Add to cart
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewArrival;
