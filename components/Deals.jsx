"use client";

import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getProducts } from "@/actions/products";
import { getWishlist, updateWishlist } from "@/actions/wishlist";
import { addToCart, getCart } from "@/actions/cart-utils";
import { useRouter } from "next/navigation";
import ProductCard from "./ProductCard";
import { session } from "@/actions/auth-utils";

const SkeletonProductCard = () => (
  <div className="bg-white shadow-md rounded-lg overflow-hidden h-[400px] w-full flex flex-col animate-pulse">
    <div className="relative w-full h-48">
      <div className="w-full h-full bg-gray-200" />
    </div>
    <div className="p-4 flex flex-col flex-grow">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="flex items-center mb-2">
        <div className="h-5 bg-gray-200 rounded w-16 mr-2" />
        <div className="h-4 bg-gray-200 rounded w-12" />
      </div>
      <div className="flex items-center mb-2">
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="w-4 h-4 bg-gray-200 rounded-full" />
          ))}
        </div>
        <div className="h-3 bg-gray-200 rounded w-8 ml-2" />
      </div>
      <div className="mt-auto block w-full py-2 bg-gray-200 rounded-lg h-10" />
    </div>
  </div>
);

const Deals = () => {
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

  const { data: productsData, error: productsError, isLoading: productsLoading } = useQuery({
    queryKey: ["deals"],
    queryFn: () => getProducts({ limit: 8, discounted: true }),
  });

  const { data: wishlistData, isLoading: wishlistLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
    enabled: !!user,
  });

  const { data: cartData, isLoading: cartLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: !!user,
  });

  const wishlistMutation = useMutation({
    mutationFn: ({ productId, action }) => updateWishlist(productId, action),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["wishlist"]);
      toast.success(data.message, { position: "top-right", autoClose: 3000 });
    },
    onError: (error) => {
      if (error.message.includes("Unauthorized")) {
        toast.error("Please log in to manage your wishlist.", {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => router.push("/login"), 3000);
      } else {
        toast.error(`Error: ${error.message}`, { position: "top-right", autoClose: 3000 });
      }
    },
  });

  const cartMutation = useMutation({
    mutationFn: ({ productId, quantity }) => addToCart(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
      toast.success("Product added to cart successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error) => {
      if (error.message.includes("Unauthorized")) {
        toast.error("Please log in to add to cart.", { position: "top-right", autoClose: 3000 });
        setTimeout(() => router.push("/login"), 3000);
      } else {
        toast.error(`Error: ${error.message}`, { position: "top-right", autoClose: 3000 });
      }
    },
  });

  const handleWishlistToggle = (productId, e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to manage your wishlist.", {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => router.push("/login"), 3000);
      return;
    }
    if (wishlistLoading || wishlistMutation.isPending) return;

    const isInWishlist = wishlistData?.wishlist?.some(
      (item) => item._id.toString() === productId
    );
    wishlistMutation.mutate({ productId, action: isInWishlist ? "remove" : "add" });
  };

  const isInCart = (productId) =>
    cartData?.cart?.items?.some((item) => item.product._id.toString() === productId) || false;

  const handleCartAction = (productId, e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to add to cart.", { position: "top-right", autoClose: 3000 });
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

  if (productsLoading) {
    return (
      <div className="container pb-16">
        <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6">
          Deals of the Week
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonProductCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (productsError) {
    return null;
  }

  const products = productsData?.products || [];

  // No products currently discounted - skip the section instead of
  // showing an empty "Deals" block.
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="container pb-16 bg-gray-50">
      <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6 pt-10">
        Deals of the Week
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pb-4">
        {products.map((product) => (
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
    </div>
  );
};

export default Deals;
