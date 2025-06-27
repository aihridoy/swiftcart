"use client";

import { session } from '@/actions/auth-utils';
import { addToCart, getCart } from '@/actions/cart-utils';
import { getWishlist, updateWishlist } from '@/actions/wishlist';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { BsCart3, BsEye, BsTrash3 } from 'react-icons/bs';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import Image from 'next/image';

const UserWishlist = () => {
  const queryClient = useQueryClient();
  const { data: userSession, status } = useSession();
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    async function fetchUser() {
      const res = await session();
      if(res) {
        setUser(res.user);
      }
      if (!res?.user) {
        router.push("/");
      }
    }
    fetchUser();
  }, [router]);

  // Fetch wishlist
  const { data, error, isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
    enabled: !!userSession,
    onError: (error) => {
      if (error.message.includes("Unauthorized")) {
        toast.error("Please log in to view your wishlist.", {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        toast.error(`Error fetching wishlist: ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    },
  });

  // Fetch cart
  const {
    data: cartData,
    error: cartError,
    isLoading: cartLoading,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: !!userSession,
    onError: (error) => {
      if (error.message.includes("Unauthorized")) {
        toast.error("Please log in to view your cart.", {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        toast.error(`Error fetching cart: ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    },
  });

  // Mutation to remove item from wishlist
  const wishlistMutation = useMutation({
    mutationFn: ({ productId, action }) => updateWishlist(productId, action),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["wishlist"]);
      toast.success(data.message, {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error) => {
      if (error.message.includes("Unauthorized")) {
        toast.error("Please log in to manage your wishlist.", {
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

  // Check if a product is in the cart
  const isInCart = (productId) => {
    return (
      cartData?.cart?.items?.some(
        (item) => item.product._id.toString() === productId
      ) || false
    );
  };

  // Handle removing an item from the wishlist
  const handleRemoveFromWishlist = (productId, e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to manage your wishlist.", {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => {
        router.push("/login");
      }, 3000);
      return;
    }
    if (wishlistMutation.isPending) return;
    wishlistMutation.mutate({ productId, action: "remove" });
  };

  // Handle adding to cart or viewing cart
  const handleCartAction = (product, e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to add to cart.", {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => {
        router.push("/login");
      }, 3000);
      return;
    }

    if (product.availability !== "In Stock") {
      toast.error(`${product.title} is out of stock.`, {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (isInCart(product._id)) {
      router.push("/cart");
    } else {
      if (cartMutation.isPending) return;
      cartMutation.mutate({ productId: product._id, quantity: 1 });
    }
  };

  // Handle view product details
  const handleViewProduct = (productId) => {
    router.push(`/products/${productId}`);
  };

  const wishlist = data?.wishlist;
  
  // Pagination logic
  const totalItems = wishlist?.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = wishlist?.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                <AiFillHeart className="w-7 h-7 text-red-500" />
                My Wishlist
              </h1>
              <p className="text-gray-600 mt-1">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} in your wishlist
              </p>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {wishlist?.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 md:p-12 text-center">
            <AiOutlineHeart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-6">Start adding products you love to your wishlist!</p>
            <button
              onClick={() => router.push('/products')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <>
            {/* Products List */}
            <ul className="space-y-4">
              {paginatedProducts?.map((product) => (
                <li key={product._id} className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between hover:shadow-lg transition-shadow duration-300">
                  {/* Product Image */}
                  <div className="w-24 h-24 flex-shrink-0 bg-gray-100">
                    {product.mainImage ? (
                        <div className="relative h-24 w-24 flex-shrink-0">
                      <Image 
                        src={product.mainImage}
                        alt={product.title || product.name}
                        fill
                        className="object-cover"
                      />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-sm">No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 ml-4">
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-1 line-clamp-2">
                      {product.title || product.name}
                    </h3>
                    {product.brand && (
                      <p className="text-gray-500 text-xs mb-2">{product.brand}</p>
                    )}
                    <div className="mb-2">
                      {product.salePrice ? (
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-red-600">
                            ${product.salePrice}
                          </span>
                          {product.regularPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              ${product.regularPrice}
                            </span>
                          )}
                        </div>
                      ) : product.regularPrice ? (
                        <span className="text-lg font-bold text-gray-900">
                          ${product.regularPrice}
                        </span>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">
                          ${product.price}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleCartAction(product, e)}
                        disabled={cartMutation.isPending || product.availability !== 'In Stock'}
                        className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          isInCart(product._id)
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <BsCart3 className="w-4 h-4" />
                          <span className="hidden sm:inline">
                            {isInCart(product._id) ? 'View Cart' : 'Add to Cart'}
                          </span>
                        </div>
                      </button>
                      <button
                        onClick={() => handleViewProduct(product._id)}
                        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        title="View details"
                      >
                        <BsEye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={(e) => handleRemoveFromWishlist(product._id, e)}
                    disabled={wishlistMutation.isPending}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                    title="Remove from wishlist"
                  >
                    <BsTrash3 className="w-4 h-4" />
                  </button>

                  {/* Stock Status Badge */}
                  {product.availability && (
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.availability === 'In Stock' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.availability}
                    </div>
                  )}
                </li>
              ))}
            </ul>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <IoChevronBack className="w-4 h-4" />
                  </button>

                  <div className="flex gap-1">
                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      const isCurrentPage = page === currentPage;
                      
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isCurrentPage
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
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
          </>
        )}
      </div>
    </div>
  );
};

export default UserWishlist;