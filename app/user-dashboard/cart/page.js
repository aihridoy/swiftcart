"use client";  

import { session } from '@/actions/auth-utils';
import { getCart, removeFromCart, updateCartQuantity } from '@/actions/cart-utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BsCart3, BsTrash3, BsPlus, BsDash } from 'react-icons/bs';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { AiOutlineShoppingCart } from 'react-icons/ai';

const UserCart = () => {
  const queryClient = useQueryClient();
  const { data: userSession, status } = useSession();
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      const res = await session();
      if(res) {
        setUser(res.user);
      }
      if(!res?.user) {
        router.push("/");
      }
    }
    fetchUser();
  }, [router]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch cart
  const { data, error, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: !!userSession,
    onError: (error) => {
      if (!error.message.includes("Unauthorized")) {
        toast.error(`Error fetching cart: ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    },
  });

  // Mutation to remove item from cart
  const removeMutation = useMutation({
    mutationFn: (productId) => removeFromCart(productId),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["cart"]);
      toast.success(data.message, {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error) => {
      if (error.message.includes("Unauthorized")) {
        toast.error("Please log in to manage your cart.", {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        toast.error(`Error: ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    },
  });

  // Mutation to update quantity in cart
  const updateQuantityMutation = useMutation({
    mutationFn: ({ productId, quantity }) => updateCartQuantity(productId, quantity),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["cart"]);
      toast.success("Quantity updated successfully", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error) => {
      if (error.message.includes("Unauthorized")) {
        toast.error("Please log in to manage your cart.", {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        toast.error(`Error: ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    },
  });

  // Handle remove from cart
  const handleRemoveFromCart = (productId, e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to manage your cart.", {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => {
        router.push("/login");
      }, 3000);
      return;
    }
    if (removeMutation.isLoading) return;
    removeMutation.mutate(productId);
  };

  // Handle quantity increase
  const handleIncreaseQuantity = (productId, currentQuantity, productStock, e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to manage your cart.", {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => {
        router.push("/login");
      }, 3000);
      return;
    }

    const maxQuantity = productStock !== undefined ? productStock : 10;
    const newQuantity = currentQuantity + 1;

    if (newQuantity > maxQuantity) {
      toast.warn(`Cannot add more than ${maxQuantity} items.`, {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (updateQuantityMutation.isLoading) return;
    updateQuantityMutation.mutate({ productId, quantity: newQuantity });
  };

  // Handle quantity decrease
  const handleDecreaseQuantity = (productId, currentQuantity, e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to manage your cart.", {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => {
        router.push("/login");
      }, 3000);
      return;
    }

    const newQuantity = currentQuantity > 1 ? currentQuantity - 1 : 1;
    if (newQuantity === currentQuantity) return;
    if (updateQuantityMutation.isLoading) return;
    updateQuantityMutation.mutate({ productId, quantity: newQuantity });
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page numbers for pagination display
  const getPageNumbers = (totalPages, currentPage) => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const handleProceed = (cartId) => {
    router.push(`/cart/${cartId}`);
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
          </div>
          <div className="bg-white rounded-lg shadow-sm">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center p-4 border-b border-gray-100 animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-8 bg-gray-200 rounded w-8"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 mb-2">
              <BsCart3 className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Error Loading Cart</h3>
              <p className="text-sm">{error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const cart = data?.cart || {};
  const items = cart.items || [];
  
  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Pagination logic
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = items.slice(startIndex, endIndex);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                <BsCart3 className="w-7 h-7 text-blue-600" />
                Shopping Cart
              </h1>
              <p className="text-gray-600 mt-1">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            
            {items.length > 0 && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Subtotal</p>
                <p className="text-2xl font-bold text-gray-900">${subtotal.toFixed(2)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 text-center">
            <AiOutlineShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Add some products to get started!</p>
            <button
              onClick={() => router.push('/products')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items List */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              {/* List Header - Hidden on mobile */}
              <div className="hidden md:flex items-center p-4 bg-gray-50 border-b border-gray-200 font-medium text-gray-700">
                <div className="flex-1">Product</div>
                <div className="w-24 text-center">Quantity</div>
                <div className="w-24 text-right">Price</div>
                <div className="w-24 text-right">Total</div>
                <div className="w-12"></div>
              </div>

              {/* Cart Items */}
              {paginatedItems.map((item, index) => (
                <div key={item._id} className={`flex flex-col md:flex-row md:items-center p-4 ${index !== paginatedItems.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  {/* Product Info */}
                  <div className="flex items-center flex-1 mb-4 md:mb-0">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg mr-4 overflow-hidden flex-shrink-0">
                      {item.product?.mainImage ? (
                        <img
                          src={item.product.mainImage}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/api/placeholder/64/64';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <BsCart3 className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {item.product?.title || 'Product Name'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item.product?.brand || 'Brand'}
                      </p>
                      <p className="text-xs text-gray-400">
                        SKU: {item.product?.sku || 'N/A'}
                      </p>
                      {item.product?.availability && (
                        <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                          item.product.availability === 'In Stock' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.product.availability}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Mobile Layout */}
                  <div className="md:hidden flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={(e) => handleDecreaseQuantity(item.product._id, item.quantity, e)}
                          disabled={item.quantity <= 1 || updateQuantityMutation.isLoading}
                          className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <BsDash className="w-3 h-3" />
                        </button>
                        <span className="px-3 py-1 min-w-[2rem] text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={(e) => handleIncreaseQuantity(item.product._id, item.quantity, item.product?.quantity, e)}
                          disabled={updateQuantityMutation.isLoading}
                          className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <BsPlus className="w-3 h-3" />
                        </button>
                      </div>
                      
                      {/* Price and Total */}
                      <div className="text-right">
                        <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-xs text-gray-500">${item.price.toFixed(2)} each</p>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={(e) => handleRemoveFromCart(item.product._id, e)}
                      disabled={removeMutation.isLoading}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Remove from cart"
                    >
                      <BsTrash3 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden md:flex md:items-center md:space-x-4">
                    {/* Quantity Controls */}
                    <div className="w-24 flex justify-center">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={(e) => handleDecreaseQuantity(item.product._id, item.quantity, e)}
                          disabled={item.quantity <= 1 || updateQuantityMutation.isLoading}
                          className="p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <BsDash className="w-3 h-3" />
                        </button>
                        <span className="px-2 py-1 min-w-[2rem] text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={(e) => handleIncreaseQuantity(item.product._id, item.quantity, item.product?.quantity, e)}
                          disabled={updateQuantityMutation.isLoading}
                          className="p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <BsPlus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="w-24 text-right">
                      <span className="font-medium">${item.price.toFixed(2)}</span>
                    </div>

                    {/* Total */}
                    <div className="w-24 text-right">
                      <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>

                    {/* Remove Button */}
                    <div className="w-12 flex justify-center">
                      <button
                        onClick={(e) => handleRemoveFromCart(item.product._id, e)}
                        disabled={removeMutation.isLoading}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Remove from cart"
                      >
                        <BsTrash3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mb-6">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <IoChevronBack className="w-4 h-4" />
                  </button>

                  <div className="flex gap-1">
                    {getPageNumbers(totalPages, currentPage).map((page, index) => (
                      <button
                        key={index}
                        onClick={() => typeof page === 'number' && handlePageChange(page)}
                        disabled={page === '...'}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          page === currentPage
                            ? 'bg-blue-600 text-white'
                            : page === '...'
                            ? 'cursor-default'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <IoChevronForward className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Cart Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    Total: <span className="text-blue-600">${subtotal.toFixed(2)}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    {totalItems} {totalItems === 1 ? 'item' : 'items'} • Taxes calculated at checkout
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => router.push('/products')}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={() => handleProceed(cart._id)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserCart;