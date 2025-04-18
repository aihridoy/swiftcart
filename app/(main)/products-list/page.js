"use client";
import { getProducts, deleteProduct } from '@/actions/products';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';

const ProductsPage = () => {
  const [visibleProducts, setVisibleProducts] = useState(10);
  const queryClient = useQueryClient();

  // Fetch products
  const { data: products, error, isLoading } = useQuery({
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
      toast.error(`Error deleting produc client: ${error.message}`, {
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
    setVisibleProducts(prevCount => prevCount + 10);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(id);
    }
  };

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
      <h1 className="text-3xl font-bold mb-8">Product List</h1>
      
      <div className="divide-y divide-gray-200">
        {productList.slice(0, visibleProducts).map((product) => (
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
                  <p className="text-gray-600 text-sm">{product.brand} - {product.category}</p>
                </div>
                
                <div className="flex flex-col items-start md:items-end">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-gray-400 line-through text-sm">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <span className={`text-sm ${product.availability === 'In Stock' ? 'text-green-500' : 'text-red-500'}`}>
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
                  <button 
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md transition-colors duration-300"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => handleDeleteProduct(product._id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition-colors duration-300"
                    disabled={deleteProductMutation.isPending}
                  >
                    {deleteProductMutation.isPending && product._id === deleteProductMutation.variables ? 
                      'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
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