"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getProducts } from "@/actions/products";
import { addToCart, getCart } from "@/actions/cart-utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { getWishlist, updateWishlist } from "@/actions/wishlist";
import { session } from "@/actions/auth-utils";

const Products = () => {
  const queryClient = useQueryClient();
  const { data: userSession, status } = useSession();
  const router = useRouter();

  const [displayCount, setDisplayCount] = useState(20);
  const [sortOption, setSortOption] = useState("default");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [filters, setFilters] = useState({
    category: "all",
    rating: 0,
    inStock: false,
  });
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
          async function fetchUser() {
            const res = await session();
            if(res) {
              setUser(res.user);
            }
          }
          fetchUser();
        }, []);

  // Fetch products
  const { data, error, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
    onError: (error) => {
      toast.error(`Error fetching products: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    },
  });

  // Fetch cart
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

  // Cart mutation
  const cartMutation = useMutation({
    mutationFn: ({ productId, quantity }) => addToCart(productId, quantity),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["cart"]);
      toast.success("Product added to cart successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error) => {
      if (error.message.includes("Unauthorized")) {
        toast.error("Please log in to add to cart.", {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => router.push("/login"), 3000);
      } else {
        toast.error(`Error: ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    },
  });

  // Fetch wishlist
  const { data: wishlistData, error: wishlistError, isLoading: wishlistLoading } = useQuery({
      queryKey: ["wishlist"],
      queryFn: getWishlist,
      enabled: status === "authenticated", // Only run if user is authenticated
      onError: (error) => {
        if (error.message.includes("Unauthorized")) {
          toast.error("Please log in to view your wishlist.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        } else {
          toast.error(`Error fetching wishlist: ${error.message}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      },
    });

  // Wishlist mutation
    const wishlistMutation = useMutation({
      mutationFn: ({ productId, action }) => updateWishlist(productId, action),
      onSuccess: (data) => {
        queryClient.invalidateQueries(["wishlist"]);
        toast.success(data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      },
      onError: (error) => {
        if (error.message.includes("Unauthorized")) {
          toast.error("Please log in to manage your wishlist.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        } else {
          toast.error(`Error: ${error.message}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      },
    });

  const products = React.useMemo(() => data?.products || [], [data]);

  // Categories derived from products
  const categories = [
    "all",
    ...new Set(products.map((product) => product.category || "uncategorized")),
  ];

  // Apply sorting and filtering
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
    result = result.filter((product) => {
      const minValid = priceRange.min === "" || product.price >= Number(priceRange.min);
      const maxValid = priceRange.max === "" || product.price <= Number(priceRange.max);
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
        break;
    }

    setFilteredProducts(result);
  }, [products, sortOption, filters, priceRange]);

  // Check if a product is in the cart
  const isInCart = (productId) => {
    return cartData?.cart?.items?.some(
      (item) => item.product._id.toString() === productId
    ) || false;
  };

  // Handle add to cart or view cart
  const handleCartAction = (productId, e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to add to cart.", {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => router.push("/login"), 3000);
      return;
    }

    if (isInCart(productId)) {
      router.push("/cart");
    } else {
      if (cartMutation.isLoading) return;
      cartMutation.mutate({ productId, quantity: 1 });
    }
  };

  // Handle wishlist toggle
    const handleWishlistToggle = (productId, e) => {
      e.preventDefault();
      if (!user) {
        toast.error("Please log in to manage your wishlist.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          router.push("/login");
        }, 3000);
        return;
      }
      if (wishlistLoading || wishlistMutation.isPending) return;
  
      const isInWishlist = wishlistData?.wishlist?.some(
        (item) => item._id.toString() === productId
      );
      const action = isInWishlist ? "remove" : "add";
      wishlistMutation.mutate({ productId, action });
    };

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
    const processedValue = value === "" ? "" : Number(value);
    setPriceRange((prev) => ({ ...prev, [type]: processedValue }));
  };

  const resetFilters = () => {
    setFilters({ category: "all", rating: 0, inStock: false });
    setPriceRange({ min: "", max: "" });
    setSortOption("default");
  };

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    console.error("Error fetching products:", error);
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

            {/* Filters section */}
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
              <ProductCard
                key={product._id}
                product={product}
                wishlistData={wishlistData}
                wishlistLoading={wishlistLoading}
                mutation={wishlistMutation}
                handleWishlistToggle={handleWishlistToggle}
                cartData={cartData}
                cartLoading={cartLoading}
                cartMutation={cartMutation}
                handleCartAction={handleCartAction}
                isInCart={isInCart}
              />
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