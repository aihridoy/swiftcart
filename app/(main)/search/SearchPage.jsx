"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Link from "next/link";
import { searchProducts } from "@/actions/products";
import { getWishlist, updateWishlist } from "@/actions/wishlist";
import { addToCart, getCart } from "@/actions/cart-utils";
import { useSession } from "next-auth/react";
import ProductCard from "@/components/ProductCard";

const SearchPage = () => {
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  // Fetch search results
  const { data: searchResults, isLoading, error } = useQuery({
    queryKey: ["search", query],
    queryFn: () => searchProducts(query),
    enabled: !!query,
    onError: (error) => {
      toast.error(`Error fetching search results: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    },
  });

  // Fetch wishlist
  const { data: wishlistData, error: wishlistError, isLoading: wishlistLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
    enabled: !!session,
    onError: (error) => {
      if (error.message.includes("Unauthorized")) {
        toast.error("Please log in to view your wishlist.", {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => router.push("/login"), 3000);
      } else {
        toast.error(`Error fetching wishlist: ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    },
  });

  // Fetch cart
  const { data: cartData, error: cartError, isLoading: cartLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: !!session,
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

  // Wishlist mutation
  const mutation = useMutation({
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
        setTimeout(() => router.push("/login"), 3000);
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
        setTimeout(() => router.push("/login"), 3000);
      } else {
        toast.error(`Error: ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    },
  });

  // Handle wishlist toggle
  const handleWishlistToggle = (productId, e) => {
    e.preventDefault();
    if (status !== "authenticated") {
      toast.error("Please log in to manage your wishlist.", {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => router.push("/login"), 3000);
      return;
    }
    if (wishlistLoading || mutation.isPending) return;

    const action = wishlistData?.wishlist?.some(
      (item) => item._id.toString() === productId
    ) ? "remove" : "add";
    mutation.mutate({ productId, action });
  };

  // Check if a product is in the cart
  const isInCart = (productId) => {
    return cartData?.cart?.items?.some(
      (item) => item.product._id.toString() === productId
    ) || false;
  };

  // Handle add to cart or view cart
  const handleCartAction = (productId, e) => {
    e.preventDefault();
    if (status !== "authenticated") {
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
      if (cartMutation.isPending) return;
      cartMutation.mutate({ productId, quantity: 1 });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-16 flex justify-center">
        <p>Failed to load search results. Please try again later.</p>
      </div>
    );
  }

  const products = searchResults?.products || [];

  return (
    <div className="container py-16 bg-white">
      <h1 className="text-2xl font-medium text-gray-800 mb-6">
        Search Results for &quot;{query}&quot;
      </h1>
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-center text-gray-600 text-lg mb-4">
            No products found for your search.
          </p>
          <Link
            href="/products"
            className="px-6 py-2 text-center text-sm text-white bg-primary border border-primary rounded hover:bg-transparent hover:text-primary transition uppercase font-roboto font-medium"
          >
            Browse All Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              wishlistData={wishlistData}
              wishlistLoading={wishlistLoading}
              mutation={mutation}
              handleWishlistToggle={handleWishlistToggle}
              cartData={cartData}
              cartLoading={cartLoading}
              cartMutation={cartMutation}
              handleCartAction={handleCartAction}
              isInCart={isInCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;