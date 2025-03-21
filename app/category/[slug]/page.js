'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import Image from 'next/image';
import Link from 'next/link';
import { FaEye, FaHeart } from "react-icons/fa";
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getProducts } from '@/actions/products';

const CategoryPage = ({ params }) => {
  const { slug } = params;

  const decodedSlug = decodeURIComponent(slug);

  const formattedCategoryName = decodedSlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  const { data, error, isLoading } = useQuery({
    queryKey: ["products", slug],
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
      <Header />
      <Navbar />
      <div className="min-h-screen py-10 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="text-2xl font-semibold text-gray-800 mb-8 text-center uppercase">
            {formattedCategoryName}
          </h1>
          {products.length === 0 ? (
            <p className="text-center text-gray-600">No products found in this category.</p>
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
                      <a
                        href="#"
                        className="text-white text-lg w-9 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-gray-800 transition"
                        title="Add to Wishlist"
                      >
                        <FaHeart />
                      </a>
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
                            <i className="fa-solid fa-star"></i>
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
      <Footer />
    </>
  );
};

export default CategoryPage;