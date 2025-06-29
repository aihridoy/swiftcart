/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaSearch, FaTimes } from "react-icons/fa";

import { getProducts, deleteProduct } from "@/actions/products";
import { session } from "@/actions/auth-utils";

const ProductsPage = () => {
  const [visibleProducts, setVisibleProducts] = useState(10);
  const [user, setUser] = useState(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  
  const queryClient = useQueryClient();
  const router = useRouter();

  // Debounce function
  const debounce = useCallback((func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  }, []);

  // Debounce search term
  useEffect(() => {
    const debouncedSetSearchTerm = debounce((value) => {
      setDebouncedSearchTerm(value);
    }, 800);
    debouncedSetSearchTerm(searchTerm);
  }, [searchTerm, debounce]);

  if(user && user?.user?.role !== "admin") {
    router.push('/');
  }

  // Fetch session
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoadingSession(true);
        const res = await session();
        if(res?.user?.role !== "admin") {
          router.push('/');
        }

        if (!res) {
          toast.error("Please log in to view products.");
          router.push("/login");
        } else {
          setUser(res);
        }
      } catch (error) {
        toast.error(`Error fetching session: ${error.message}`);
      } finally {
        setIsLoadingSession(false);
      }
    };

    fetchUser();
  }, [router]);

  // Products query
  const {
    data: products,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts({ sort: "-createdAt" }),
    enabled: !!user && !isLoadingSession,
    onError: (error) =>
      toast.error(`Error fetching products: ${error.message}`),
  });

  // Mutation for deleting a product
  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully");
    },
    onError: (error) => toast.error(`Error deleting product: ${error.message}`),
  });

  // Filter user products
  const userProducts =
    products?.products?.filter((product) => product.user === user?.user?.id) ||
    [];

  // Filter products based on search term
  const filteredProducts = userProducts.filter((product) => {
    if (!debouncedSearchTerm) return true;
    
    const searchLower = debouncedSearchTerm.toLowerCase();
    return (
      product.title.toLowerCase().includes(searchLower) ||
      product.brand.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower) ||
      product.sku.toLowerCase().includes(searchLower)
    );
  });

  const handleShowMore = () => setVisibleProducts((prev) => prev + 10);

  const handleDeleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(id);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
  };

  // Reset visible products when search changes
  useEffect(() => {
    setVisibleProducts(10);
  }, [debouncedSearchTerm]);

  // Loading UI
  if (isLoadingSession || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user || error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">Error loading products</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mb-12 sm:mb-0">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Product List</h1>
        <Link
          href="/dashboard/add-product"
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md shadow-md transition-colors duration-300 text-center"
        >
          Add Product
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 right-3 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search products by name, brand, category, or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {searchTerm && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                onClick={handleClearSearch}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <FaTimes className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
        
        {/* Search Results Info */}
        {debouncedSearchTerm && (
          <div className="mt-2 text-sm text-gray-600">
            {filteredProducts.length === 0 ? (
              <span className="text-red-500">No products found for "{debouncedSearchTerm}"</span>
            ) : (
              <span>
                Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} 
                {debouncedSearchTerm && ` for "${debouncedSearchTerm}"`}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="divide-y divide-gray-200">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col justify-center items-center min-h-[200px] text-gray-500">
            {debouncedSearchTerm ? (
              <>
                <div className="text-lg mb-2">No products found</div>
                <div className="text-sm">Try adjusting your search terms</div>
              </>
            ) : (
              <div>No products available</div>
            )}
          </div>
        ) : (
          filteredProducts.slice(0, visibleProducts).map((product) => {
            const isOwner =
              user && product.user && user?.user.id === product.user;

            return (
              <div
                key={product._id}
                className="py-6 flex flex-col md:flex-row items-center md:items-start gap-6 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="relative h-40 w-40 flex-shrink-0">
                  <Image
                    src={product.mainImage}
                    alt={product.title}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>

                <div className="flex-grow w-full">
                  <div className="flex flex-col gap-2">
                    <div className="text-center md:text-left">
                      <h2 className="text-xl font-semibold">{product.title}</h2>
                      <p className="text-gray-600 text-sm">
                        {product.brand} - {product.category}
                      </p>
                    </div>

                    <div className="flex justify-center md:justify-start items-center gap-2 mt-2 md:mt-0">
                      <span className="font-bold text-lg">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.originalPrice &&
                        product.originalPrice > product.price && (
                          <span className="text-gray-400 line-through text-sm">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      <span
                        className={`ml-2 text-sm ${
                          product.availability === "In Stock"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {product.availability}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-700 mt-2 mb-4 text-center md:text-left">
                    {product.description}
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
                    <div className="text-sm text-gray-500 mb-3 sm:mb-0">
                      SKU: {product.sku}
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 w-full sm:w-auto">
                      <Link
                        href={`/products/${product._id}`}
                        className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-md transition-all duration-300 text-center"
                      >
                        View Details
                      </Link>
                      {isOwner && (
                        <>
                          <Link
                            href={`/edit-product/${product._id}`}
                            className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 font-medium rounded-md transition-colors duration-300 text-center"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 font-medium rounded-md transition-colors duration-300"
                            disabled={deleteProductMutation.isPending}
                          >
                            {deleteProductMutation.isPending &&
                            product._id === deleteProductMutation.variables
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {filteredProducts.length > visibleProducts && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleShowMore}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-md transition-colors duration-300 w-full sm:w-auto"
          >
            Show More ({filteredProducts.length - visibleProducts} remaining)
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;