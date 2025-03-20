'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RelatedProducts from '@/components/RelatedProducts';
import { getProductById } from '@/actions/products';

const ProductDetails = ({ params }) => {
  const { id } = params;
  const [quantity, setQuantity] = useState(1); 

  const { data, error, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    onError: (error) => {
      toast.error(`Error fetching product: ${error.message}`, {
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
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Failed to load product details. Please try again later.</p>
      </div>
    );
  }

  const product = data?.product;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Product not found.</p>
      </div>
    );
  }

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <>
      <Header />
      <Navbar />

      {/* Main Product Section */}
      <div className="container grid grid-cols-1 md:grid-cols-2 gap-6 py-5">
        {/* Product Images Section */}
        <div>
          <Image
            src={product.mainImage}
            alt={product.title}
            width={500}
            height={500}
            className="w-full rounded-lg shadow-md"
          />
          <div className="grid grid-cols-5 gap-4 mt-4">
            {product.thumbnails.map((thumbnail, index) => (
              <Image
                key={index}
                src={thumbnail}
                alt={`Thumbnail ${index + 1}`}
                width={100}
                height={100}
                className="w-full cursor-pointer border rounded-lg shadow-sm hover:shadow-md transition"
              />
            ))}
          </div>
        </div>

        {/* Product Information Section */}
        <div>
          {/* Product Title */}
          <h2 className="text-3xl font-medium uppercase mb-2">{product.title}</h2>

          {/* Ratings */}
          <div className="flex items-center mb-4">
            <div className="flex gap-1 text-sm text-yellow-400">
              {Array.from({ length: 5 }, (_, index) => (
                <span key={index}>
                  <i className="fa-solid fa-star"></i>
                </span>
              ))}
            </div>
            <div className="text-xs text-gray-500 ml-3">(150 Reviews)</div>
          </div>

          {/* Product Metadata */}
          <div className="space-y-2">
            <p className="text-gray-800 font-semibold space-x-2">
              <span>Availability: </span>
              <span className={product.availability === "In Stock" ? "text-green-600" : "text-red-600"}>
                {product.availability}
              </span>
            </p>
            <p className="space-x-2">
              <span className="text-gray-800 font-semibold">Brand: </span>
              <span className="text-gray-600">{product.brand}</span>
            </p>
            <p className="space-x-2">
              <span className="text-gray-800 font-semibold">Category: </span>
              <span className="text-gray-600">{product.category}</span>
            </p>
            <p className="space-x-2">
              <span className="text-gray-800 font-semibold">SKU: </span>
              <span className="text-gray-600">{product.sku}</span>
            </p>
          </div>

          {/* Price */}
          <div className="flex items-baseline mb-1 space-x-2 font-roboto mt-4">
            <p className="text-xl text-primary font-semibold">${product.price.toFixed(2)}</p>
            {product.originalPrice && (
              <p className="text-base text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </p>
            )}
          </div>

          {/* Description */}
          <p className="mt-4 text-gray-600">{product.description}</p>

          {/* Quantity Selector */}
          <div className="mt-4">
            <h3 className="text-sm text-gray-800 uppercase mb-1">Quantity</h3>
            <div className="flex border border-gray-300 text-gray-600 divide-x divide-gray-300 w-max">
              <button
                onClick={handleDecreaseQuantity}
                className="h-8 w-8 text-xl flex items-center justify-center cursor-pointer select-none"
              >
                -
              </button>
              <div className="h-8 w-8 text-base flex items-center justify-center">{quantity}</div>
              <button
                onClick={handleIncreaseQuantity}
                className="h-8 w-8 text-xl flex items-center justify-center cursor-pointer select-none"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons (Add to Cart, Wishlist) */}
          <div className="mt-6 flex gap-3 border-b border-gray-200 pb-5 pt-5">
            <a
              href="#"
              className="bg-primary border border-primary text-white px-8 py-2 font-medium rounded uppercase flex items-center gap-2 hover:bg-transparent hover:text-primary transition"
            >
              <i className="fa-solid fa-bag-shopping"></i> Add to cart
            </a>
            <a
              href="#"
              className="border border-gray-300 text-gray-600 px-8 py-2 font-medium rounded uppercase flex items-center gap-2 hover:text-primary transition"
            >
              <i className="fa-solid fa-heart"></i> Wishlist
            </a>
          </div>

          {/* Social Sharing */}
          <div className="flex gap-3 mt-4">
            {["facebook-f", "twitter", "instagram"].map((icon, index) => (
              <a
                key={index}
                href="#"
                className="text-gray-400 hover:text-gray-500 h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center"
              >
                <i className={`fa-brands fa-${icon}`}></i>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="container pb-16">
        <h3 className="border-b border-gray-200 font-roboto text-gray-800 pb-3 font-medium">
          Product Details
        </h3>
        <div className="w-3/5 pt-6 text-gray-600">
          <p>{product.description}</p>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts />

      <Footer />
    </>
  );
};

export default ProductDetails;