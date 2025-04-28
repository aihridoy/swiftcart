"use client";

import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Link from "next/link";
import { getProducts } from "@/actions/products";
import { getWishlist } from "@/actions/wishlist";
import { getCart } from "@/actions/cart-utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ProductCard from "./ProductsCard";

// Skeleton Loader for Product Cards
const SkeletonProductCard = () => (
  <div className="bg-white shadow-md rounded-lg overflow-hidden h-[400px] w-full flex flex-col animate-pulse">
    <div className="relative w-full h-48">
      <div className="w-full h-full bg-gray-200" />
    </div>
    <div className="p-4 flex flex-col flex-grow">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="flex items-center mb-2">
        <div className="h-5 bg-gray-200 rounded w-16 mr-2" />
        <div className="h-4 bg-gray-200 rounded w-12" />
      </div>
      <div className="flex items-center mb-2">
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="w-4 h-4 bg-gray-200 rounded-full" />
          ))}
        </div>
        <div className="h-3 bg-gray-200 rounded w-8 ml-2" />
      </div>
      <div className="mt-auto block w-full py-2 bg-gray-200 rounded-lg h-10" />
    </div>
  </div>
);

const NewArrival = () => {
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  const router = useRouter();

  // Fetch new arrival products (no dependency on user session)
  const { data: productsData, error: productsError, isLoading: productsLoading } = useQuery({
    queryKey: ["newArrivalProducts"],
    queryFn: () => getProducts({ limit: 8, sort: "-createdAt" }),
    onError: (error) => {
      toast.error(`Error fetching new arrivals: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    },
  });

  // Fetch wishlist (only when authenticated)
  const { data: wishlistData, error: wishlistError, isLoading: wishlistLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
    enabled: status === "authenticated",
    onError: (error) => {
      if (error.message.includes("Unauthorized")) {
        toast.error("Please log in to view your wishlist.", {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => router.push("/login"), 3000);
      } else {
        toast.error(`Error fetching wishlist: ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    },
  });

  // Fetch cart (only when authenticated)
  const { data: cartData, error: cartError, isLoading: cartLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: status === "authenticated",
    onError: (error) => {
      if (error.message.includes("Unauthorized")) {
        toast.error("Please log in to view your cart.", {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => router.push("/login"), 3000);
      } else {
        toast.error(`Error fetching cart: ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    },
  });

  // Loading state for products
  if (productsLoading) {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonProductCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  // Error state for products
  if (productsError) {
    return (
      <div className="container pb-16">
        <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6">
          Top New Arrival
        </h2>
        <p>Failed to load new arrivals. Please try again later.</p>
      </div>
    );
  }

  const products = productsData?.products || [];

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
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-center text-gray-600 text-lg mb-4">
            No new arrivals found.
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
            <ProductCard
              key={product._id}
              product={product}
              wishlistData={wishlistData}
              cartData={cartData}
              queryClient={queryClient}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewArrival;