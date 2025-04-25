'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { getProducts } from '@/actions/products';
import CategoryItem from '@/components/CategoryItem'; 

// Skeleton Loader for Category Items
const SkeletonCategoryItem = () => (
  <div className="relative rounded-lg overflow-hidden h-[200px] animate-pulse">
    <div className="w-full h-full bg-gray-200" />
    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="w-32 h-6 bg-gray-300 rounded" />
    </div>
  </div>
);

const ShopByCategory = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["categoryProducts"],
    queryFn: () => getProducts(),
    onError: (error) => {
      toast.error(`Error fetching categories: ${error.message}`, {
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
      <div className="container py-16 bg-white">
        <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, index) => (
            <SkeletonCategoryItem key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-16 bg-white">
        <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6">
          Shop by Category
        </h2>
        <p className="text-center text-gray-600">Failed to load categories. Please try again later.</p>
      </div>
    );
  }

  const products = data?.products || [];

  const categoryMap = products.reduce((acc, product) => {
    const category = product.category;
    if (!acc[category]) {
      acc[category] = {
        name: category.split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' '),
        slug: category.toLowerCase(),
        image: product.mainImage,
      };
    }
    return acc;
  }, {});

  // Convert the category map to an array
  const categories = Object.values(categoryMap);

  return (
    <div className="container py-16 bg-white">
      <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6">
        Shop by Category
      </h2>
      {categories.length === 0 ? (
        <p className="text-center text-gray-600">No categories found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <CategoryItem
              key={index}
              imageSrc={category.image}
              altText={category.name}
              categoryName={category.name}
              slug={category.slug}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopByCategory;