'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import Image from 'next/image';
import Link from 'next/link';
import { getProducts } from '@/actions/products';
import ProductCard from './ProductCard';

const Trending = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["trendingProducts"],
    queryFn: () => getProducts({ limit: 4, sort: "-popularityScore" }), 
    onError: (error) => {
      toast.error(`Error fetching trending products: ${error.message}`, {
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
          Trending Products
        </h2>
        <p>Loading trending products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container pb-16">
        <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6">
          Trending Products
        </h2>
        <p>Failed to load trending products. Please try again later.</p>
      </div>
    );
  }

  const products = data?.products || [];

  return (
    <div className="container pb-16">
      <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6">
        Trending Products
      </h2>
      {products.length === 0 ? (
        <p className="text-center text-gray-600">No trending products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Trending;