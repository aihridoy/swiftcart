"use client";

import { getProducts, deleteProduct } from "@/actions/products";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import Link from "next/link";
import { session } from "@/actions/auth-utils";
import { useRouter } from "next/navigation";

const ProductsPage = () => {
  const [visibleProducts, setVisibleProducts] = useState(10);
  const [user, setUser] = useState(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const queryClient = useQueryClient();
  const router = useRouter();

  // Fetch user session
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoadingSession(true);
        const res = await session();
        if (res) {
          setUser(res);
        } else {
          toast.error("Please log in to view products.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          router.push("/login");
        }
      } catch (error) {
        toast.error(`Error fetching session: ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        router.push("/login");
      } finally {
        setIsLoadingSession(false);
      }
    };
    fetchUser();
  }, [router]);

  // Fetch products
  const {
    data: products,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
    enabled: !!user && !isLoadingSession,
    onError: (error) => {
      toast.error(`Error fetching products: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    },
    onError: (error) => {
      toast.error(`Error deleting product: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    },
  });

  const { products: productList } = products || {};

  const handleShowMore = () => {
    setVisibleProducts((prevCount) => prevCount + 10);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(id);
    }
  };

  // Loading state while fetching session
  if (isLoadingSession) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If user is not authenticated, the redirect will already happen in useEffect
  if (!user) {
    return null; // Render nothing while redirecting
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">Error loading products</div>
      </div>
    );
  }

  if (!productList || productList.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">No products available</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold mb-8">Product List</h1>
        <Link
          href="/add-product"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md shadow-md transition-colors duration-300"
        >
          Add Product
        </Link>
      </div>

      <div className="divide-y divide-gray-200">
        {productList.slice(0, visibleProducts).map((product) => {
          const canDelete = user && product.user && user?.user.id === product.user;

          return (
            <div
              key={product._id}
              className="py-6 flex flex-col md:flex-row items-start gap-6 hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="relative h-40 w-40 flex-shrink-0">
                <Image
                  src={product.mainImage}
                  alt={product.title}
                  fill
                  className="object-cover rounded-md"
                />
              </div>

              <div className="flex-grow">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                  <div>
                    <h2 className="text-xl font-semibold">{product.title}</h2>
                    <p className="text-gray-600 text-sm">
                      {product.brand} - {product.category}
                    </p>
                  </div>

                  <div className="flex flex-col items-start md:items-end">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.originalPrice &&
                        product.originalPrice > product.price && (
                          <span className="text-gray-400 line-through text-sm">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                    </div>
                    <span
                      className={`text-sm ${product.availability === "In Stock" ? "text-green-500" : "text-red-500"}`}
                    >
                      {product.availability}
                    </span>
                  </div>
                </div>

                <p className="text-gray-700 mt-2 mb-4">{product.description}</p>

                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500">
                    SKU: {product.sku}
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/products/${product._id}`}
                      className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-6 rounded-md transition-all duration-300"
                    >
                      View Details
                    </Link>
                    {canDelete && (
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
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {productList.length > visibleProducts && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleShowMore}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-md transition-colors duration-300"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;