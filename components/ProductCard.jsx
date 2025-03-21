// components/ProductCard.js
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaEye, FaHeart } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden h-[400px] w-full flex flex-col group">
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
            {Array(5)
              .fill()
              .map((_, i) => (
                <span key={i}>
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
  );
};

export default ProductCard;