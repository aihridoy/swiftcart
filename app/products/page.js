// app/products/page.js
'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getProducts } from '@/actions/products';

const Products = () => {
  const [displayCount, setDisplayCount] = useState(20);

  // Fetch all products using React Query
  const { data, error, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
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

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading products...</p>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Failed to load products. Please try again later.</p>
      </div>
    );
  }

  const products = data?.products || [];

  // Handle case where no products are found
  if (products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No products found.</p>
      </div>
    );
  }

  // Function to handle "Show More" button click
  const handleShowMore = () => {
    setDisplayCount((prev) => prev + 20);
  };

  // Slice the products array to display only up to displayCount
  const displayedProducts = products.slice(0, displayCount);

  return (
    <>
      <Header />
      <Navbar />
      <div className="min-h-screen py-10 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          {/* Page Title */}
          <h1 className="text-2xl font-semibold text-gray-800 mb-8 text-center uppercase">
            All Products
          </h1>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {displayedProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white shadow-md rounded-lg overflow-hidden h-[400px] w-full flex flex-col"
              >
                {/* Product Image */}
                <Link href={`/products/${product._id}`}>
                  <div className="w-full h-48">
                    <Image
                      src={product.mainImage}
                      alt={product.title}
                      width={500}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>

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
                    Add to Cart
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Show More Button */}
          {displayCount < products.length && (
            <div className="text-center mt-10">
              <button
                onClick={handleShowMore}
                className="bg-primary text-white px-6 py-2 rounded-lg font-medium uppercase hover:bg-gray-800 transition"
              >
                Show More
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Products;