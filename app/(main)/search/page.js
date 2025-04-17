"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { searchProducts } from "@/actions/products";

const SearchPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const { data: searchResults, isLoading, error } = useQuery({
    queryKey: ["search", query],
    queryFn: () => searchProducts(query),
    enabled: !!query,
    onError: (error) => {
      toast.error(`Error fetching search results: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    },
  });

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
    <div className="container py-16">
      <h1 className="text-2xl font-medium mb-6">
        Search Results for &quot;{query}&quot;
      </h1>
      {products.length === 0 ? (
        <p className="text-gray-600">No products found for your search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product._id}
              href={`/products/${product._id}`}
              className="border border-gray-200 rounded p-4 hover:shadow-lg transition"
            >
              {product.mainImage && (
                <Image
                  src={product.mainImage}
                  alt={product.title}
                  width={200}
                  height={200}
                  className="w-full h-48 object-cover rounded"
                />
              )}
              <h3 className="text-gray-800 font-medium mt-2">{product.title}</h3>
              <p className="text-gray-500 text-sm">
                {product.brand} - {product.category}
              </p>
              <p className="text-primary font-medium mt-1">
                ${product.price.toFixed(2)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;