"use client";

import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/actions/products";
import { useRouter } from "next/navigation";
import { session } from "@/actions/auth-utils";
import { getWishlist, toggleWishlist } from "@/actions/wishlist";
import { addToCart, getCart } from "@/actions/cart-utils";

const FeaturedSkeleton = () => (
  <section className="mx-auto max-w-screen-xl px-4 py-14">
    <div className="mb-8 text-center">
      <div className="mx-auto h-10 w-64 animate-pulse rounded-lg bg-gray-200" />
      <div className="mx-auto mt-2 h-4 w-48 animate-pulse rounded bg-gray-200" />
    </div>
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="relative h-80 w-full animate-pulse rounded-xl bg-gray-200 lg:h-96" />
      <div className="flex flex-col justify-center space-y-6">
        <div className="h-8 w-3/4 animate-pulse rounded-lg bg-gray-200" />
        <div className="space-y-3">
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-4/6 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="flex items-baseline gap-3">
          <div className="h-8 w-24 animate-pulse rounded bg-gray-200" />
          <div className="h-6 w-20 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="flex gap-4">
          <div className="h-12 w-32 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-12 w-28 animate-pulse rounded-lg bg-gray-200" />
        </div>
      </div>
    </div>
  </section>
);

const FeaturedProduct = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const res = await session();
      if (res) {
        setUser(res.user);
      }
    }
    fetchUser();
  }, []);

  // Products data
  const {
    data: productsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["featuredProduct"],
    queryFn: getProducts,
    onError: (err) =>
      toast.error(`Error fetching featured product: ${err.message}`, {
        position: "top-right",
        autoClose: 3000,
      }),
  });

  // Featured product
  const product =
    productsData?.products?.sort(
      (a, b) =>
        (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) ||
        (b.popularityScore || 0) - (a.popularityScore || 0)
    )?.[0] || null;

  // Wishlist data
  const {
    data: wishlistData,
    error: wishlistError,
    isLoading: wishlistLoading,
  } = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
    enabled: !!user,
    onError: (error) => {
      if (error.message.includes("Unauthorized")) {
        toast.error("Please log in to view your wishlist.", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error(`Error fetching wishlist: ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    },
  });

  // Cart data
  const { data: cartData, error: cartError, isLoading: cartLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: !!user,
    onError: (error) => {
      if (error.message.includes("Unauthorized")) {
        toast.error("Please log in to view your cart.", {
          position: "top-right",
          autoClose: 3000,
        });
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

  // Wishlist mutation
  const wishlistMutation = useMutation({
    mutationFn: (productId) => toggleWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries(["wishlist"]);
      toast.success(
        isInWishlist ? "Removed from wishlist" : "Added to wishlist",
        {
          position: "top-right",
          autoClose: 2000,
        }
      );
    },
    onError: (error) => {
      if (error.message.includes("Unauthorized")) {
        toast.error("Please log in to manage wishlist.", {
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

  const isInWishlist = wishlistData?.wishlist?.some(
    (item) => item._id.toString() === product?._id
  );

  const isInCart = cartData?.cart?.items?.some(
    (item) => item.product._id.toString() === product?._id
  ) || false;

  const handleCartAction = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to add to cart.", {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => router.push("/login"), 3000);
      return;
    }

    if (isInCart) {
      router.push("/cart");
    } else {
      if (cartMutation.isPending) return;
      cartMutation.mutate({ productId: product._id, quantity: 1 });
    }
  };

  const handleWishlistAction = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to manage wishlist.", {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => router.push("/login"), 3000);
      return;
    }

    if (wishlistMutation.isPending) return;
    wishlistMutation.mutate(product._id);
  };

  const calculateDiscount = () => {
    if (product?.originalPrice && product?.price) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return 0;
  };

  if (isLoading) return <FeaturedSkeleton />;

  if (!product) return null;

  const discount = calculateDiscount();

  return (
    <section className="mx-auto max-w-screen-xl px-4 pb-16">
      <div className="mb-12 text-center">
        <div className="mb-2 inline-block rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-1 text-sm font-semibold text-white shadow-lg">
          ✨ Hand-picked for you
        </div>
        <h2 className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
          Featured Product
        </h2>
        <p className="mt-2 text-lg text-gray-600">
          Discover our spotlight item of the week
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        <div className="group relative">
          <Link
            href={`/products/${product._id?.$oid || product._id}`}
            className="block overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 hover:shadow-3xl"
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100">
              <Image
                src={product.mainImage}
                alt={product.title}
                width={800}
                height={600}
                priority
                className="h-80 w-full object-cover transition-all duration-700 ease-out group-hover:scale-110 lg:h-96"
              />
              
              <div className="absolute left-4 top-4 flex flex-col gap-2">
                <span className="inline-flex items-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                  ⭐ Featured
                </span>
                {discount > 0 && (
                  <span className="inline-flex items-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                    -{discount}% OFF
                  </span>
                )}
              </div>

              <button
                onClick={handleWishlistAction}
                disabled={wishlistMutation.isPending}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white hover:scale-110 disabled:opacity-50"
              >
                {wishlistMutation.isPending ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-red-500" />
                ) : (
                  <svg
                    className={`h-5 w-5 transition-colors ${
                      isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"
                    }`}
                    fill={isInWishlist ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
              </button>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          </Link>
        </div>

        <div className="flex flex-col justify-center space-y-6">
          {/* Product Category */}
          {product.category && (
            <span className="inline-block w-fit rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
              {product.category}
            </span>
          )}

          <h3 className="text-3xl font-bold leading-tight text-gray-900 lg:text-4xl">
            {product.title}
          </h3>

          <p className="text-lg leading-relaxed text-gray-600 line-clamp-4">
            {product.description}
          </p>

          {product.rating && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-500">
                ({product.rating.toFixed(1)})
              </span>
              {product.reviewCount && (
                <span className="text-sm text-gray-500">
                  • {product.reviewCount} reviews
                </span>
              )}
            </div>
          )}
          <div className="flex items-baseline gap-4">
            <span className="text-4xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="text-xl font-medium text-gray-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
                <span className="rounded-full bg-green-100 px-2 py-1 text-sm font-semibold text-green-800">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </span>
              </>
            )}
          </div>

          {product.stock !== undefined && (
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-700' : 'text-red-700'}`}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>
          )}

          <div className="flex flex-col gap-4 pt-4 sm:flex-row">
            <button
              onClick={handleCartAction}
              disabled={cartMutation.isPending || (product.stock !== undefined && product.stock <= 0)}
              className={`group relative flex-1 overflow-hidden rounded-xl px-8 py-4 text-lg font-semibold transition-all duration-300 ${
                cartMutation.isPending
                  ? "cursor-not-allowed bg-gray-400"
                  : product.stock !== undefined && product.stock <= 0
                  ? "cursor-not-allowed bg-gray-300 text-gray-500"
                  : isInCart
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl hover:from-blue-700 hover:to-blue-800 hover:shadow-2xl hover:scale-105"
                  : "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-xl hover:from-red-700 hover:to-red-800 hover:shadow-2xl hover:scale-105"
              }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {cartMutation.isPending ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Adding...
                  </>
                ) : product.stock !== undefined && product.stock <= 0 ? (
                  "Out of Stock"
                ) : isInCart ? (
                  <>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View in Cart
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 2.5M7 13l2.5 2.5" />
                    </svg>
                    Add to Cart
                  </>
                )}
              </span>
              <div className="absolute inset-0 -z-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>

            <Link
              href={`/products/${product._id?.$oid || product._id}`}
              className="group flex items-center justify-center gap-2 rounded-xl border-2 border-gray-300 px-6 py-4 text-lg font-semibold text-gray-700 transition-all duration-300 hover:border-gray-400 hover:bg-gray-50 hover:scale-105 sm:flex-none"
            >
              <svg className="h-5 w-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Details
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center gap-4 pt-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Free Shipping
            </div>
            <div className="flex items-center gap-1">
              <svg className="h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Easy Returns
            </div>
            <div className="flex items-center gap-1">
              <svg className="h-4 w-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Secure Payment
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProduct;