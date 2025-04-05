"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/actions/products";

const Products = () => {
  const [displayCount, setDisplayCount] = useState(20);
  const [sortOption, setSortOption] = useState("default");
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [filters, setFilters] = useState({
    category: "all",
    rating: 0,
    inStock: false,
  });
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

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

  const products = React.useMemo(() => data?.products || [], [data]);

  // Categories derived from products
  const categories = [
    "all",
    ...new Set(products.map((product) => product.category || "uncategorized")),
  ];

  // Apply sorting and filtering whenever products, sort option, or filters change
  useEffect(() => {
    if (products.length === 0) return;

    let result = [...products];

    // Apply category filter
    if (filters.category !== "all") {
      result = result.filter(
        (product) => product.category === filters.category
      );
    }

    // Apply rating filter
    if (filters.rating > 0) {
      result = result.filter(
        (product) => (product.rating || 0) >= filters.rating
      );
    }

    // Apply price range filter
    result = result.filter(product => {
      const minValid = priceRange.min === '' || product.price >= Number(priceRange.min);
      const maxValid = priceRange.max === '' || product.price <= Number(priceRange.max);
      return minValid && maxValid;
    });

    // Apply in-stock filter
    if (filters.inStock) {
      result = result.filter((product) => product.inStock !== false);
    }

    // Apply sorting
    switch (sortOption) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        // Default sorting (newest or featured)
        break;
    }

    setFilteredProducts(result);
  }, [products, sortOption, filters, priceRange]);

  const handleShowMore = () => {
    setDisplayCount((prev) => prev + 20);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handlePriceRangeChange = (type, value) => {
    const processedValue = value === '' ? '' : Number(value);
  setPriceRange(prev => ({ ...prev, [type]: processedValue }));
  };

  const resetFilters = () => {
    setFilters({ category: "all", rating: 0, inStock: false });
    setPriceRange({ min: '', max: '' });
    setSortOption("default");
  };

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

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

  if (products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No products found.</p>
      </div>
    );
  }

  const displayedProducts = filteredProducts.slice(0, displayCount);

  // Calculate the highest price in the product list for max range
  const maxProductPrice = Math.max(
    ...products.map((product) => product.price),
    1000
  );

  return (
    <>
      <div className="min-h-screen py-10 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          {/* Page Title */}
          <h1 className="text-2xl font-semibold text-gray-800 mb-8 text-center uppercase">
            All Products
          </h1>

          {/* Filter and Sort Controls */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
              {/* Sort dropdown */}
              <div className="w-full md:w-auto">
                <label
                  htmlFor="sort"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={sortOption}
                  onChange={handleSortChange}
                  className="block w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                >
                  <option value="default">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A-Z</option>
                  <option value="name-desc">Name: Z-A</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              {/* Mobile filter toggle button */}
              <div className="md:hidden w-full">
                <button
                  onClick={toggleFilters}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-md flex items-center justify-center"
                >
                  <span>Filters</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`ml-2 h-5 w-5 transition-transform ${
                      showFilters ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>

              {/* Search results count */}
              <div className="hidden md:block text-sm text-gray-500">
                Showing {displayedProducts.length} of {filteredProducts.length}{" "}
                products
              </div>
            </div>

            {/* Filters section - visible on desktop or when toggled on mobile */}
            <div
              className={`${
                showFilters || "hidden md:block"
              } bg-gray-50 p-4 rounded-lg`}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Category filter */}
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    value={filters.category}
                    onChange={(e) =>
                      handleFilterChange("category", e.target.value)
                    }
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rating filter */}
                <div>
                  <label
                    htmlFor="rating"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Minimum Rating
                  </label>
                  <select
                    id="rating"
                    value={filters.rating}
                    onChange={(e) =>
                      handleFilterChange("rating", Number(e.target.value))
                    }
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                  >
                    <option value={0}>Any Rating</option>
                    <option value={1}>1+ Star</option>
                    <option value={2}>2+ Stars</option>
                    <option value={3}>3+ Stars</option>
                    <option value={4}>4+ Stars</option>
                    <option value={5}>5 Stars</option>
                  </select>
                </div>

                {/* Price range filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Range
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="relative rounded-md shadow-sm flex-1">
                      <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-xs">$</span>
                      </div>
                      <input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) =>
                          handlePriceRangeChange("min", e.target.value)
                        }
                        className="block w-full pl-5 pr-2 py-2 text-sm border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        placeholder="Min"
                        min="0"
                      />
                    </div>
                    <span className="text-gray-500 text-sm">to</span>
                    <div className="relative rounded-md shadow-sm flex-1">
                      <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-xs">$</span>
                      </div>
                      <input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) =>
                          handlePriceRangeChange("max", e.target.value)
                        }
                        className="block w-full pl-5 pr-2 py-2 text-sm border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        placeholder="Max"
                        min="0"
                        max={maxProductPrice}
                      />
                    </div>
                  </div>
                </div>

                {/* Availability filter */}
                <div className="flex items-end">
                  <div className="flex items-center h-12">
                    <input
                      id="inStock"
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) =>
                        handleFilterChange("inStock", e.target.checked)
                      }
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label
                      htmlFor="inStock"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      In Stock Only
                    </label>
                  </div>

                  <button
                    onClick={resetFilters}
                    className="ml-auto px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile search results count */}
            <div className="mt-4 md:hidden text-sm text-gray-500">
              Showing {displayedProducts.length} of {filteredProducts.length}{" "}
              products
            </div>
          </div>

          {/* No results message */}
          {displayedProducts.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-4">
                No products match your filters.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
              >
                Reset All Filters
              </button>
            </div>
          )}

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
                          <i
                            className={`fa-${
                              index < (product.rating || 0)
                                ? "solid"
                                : "regular"
                            } fa-star`}
                          ></i>
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500 ml-2">
                      ({product.reviewCount || 0})
                    </div>
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
          {displayCount < filteredProducts.length && (
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
    </>
  );
};

export default Products;
