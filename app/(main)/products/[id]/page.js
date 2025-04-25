"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import RelatedProducts from "@/components/RelatedProducts";
import { getProductById, getProducts, incrementPopularity } from "@/actions/products";
import { getWishlist, updateWishlist } from "@/actions/wishlist";
import { addToCart, getCart, updateCartQuantity } from "@/actions/cart-utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaStar, FaRegStar } from "react-icons/fa";

const ProductDetails = ({ params }) => {
  const { id } = params;
  const [quantity, setQuantity] = useState(1);
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const router = useRouter();

  // Fetch product details
  const { data, error, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    onError: (error) => {
      toast.error(`Error fetching product: ${error.message}`, {
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

  // Fetch related products
  const { data: relatedProducts, error: relatedError, isLoading: relatedLoading } = useQuery({
    queryKey: ["relatedProducts", id],
    queryFn: () => getProducts({ limit: 4, sort: "popularity", category: data?.product.category }),
    enabled: !!data?.product.category,
    onError: (error) => {
      toast.error(`Error fetching related products: ${error.message}`, {
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
        toast.error(`Error fetching cart: ${error.message}`, {
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

  // Cart mutation (for adding to cart)
  const cartMutation = useMutation({
    mutationFn: ({ productId, quantity }) => addToCart(productId, quantity),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["cart"]);
      toast.success("Product added to cart successfully!", {
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
        toast.error("Please log in to add to cart.", {
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

  // Update cart quantity mutation
  const updateCartQuantityMutation = useMutation({
    mutationFn: ({ productId, quantity }) => updateCartQuantity(productId, quantity),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["cart"]);
      toast.success("Cart updated successfully!", {
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
        toast.error("Please log in to manage your cart.", {
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

  // Check if the product is in the wishlist
  const isInWishlist = wishlistData?.wishlist?.some((item) => item._id.toString() === id);

  // Check if the product is in the cart and get its current quantity
  const cartItem = cartData?.cart?.items?.find((item) => item.product._id.toString() === id);
  const isInCart = !!cartItem;
  const cartQuantity = cartItem ? cartItem.quantity : 0;

  // Synchronize quantity state with cart quantity when cart data loads
  useEffect(() => {
    if (isInCart && cartQuantity > 0) {
      setQuantity(cartQuantity);
    }
  }, [isInCart, cartQuantity]);

  // Handle wishlist toggle
  const handleWishlistToggle = () => {
    if (!session) {
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

    if (wishlistLoading || wishlistMutation.isLoading) return;
    const action = isInWishlist ? "remove" : "add";
    wishlistMutation.mutate({ productId: id, action });
  };

  // Handle add to cart or update cart
  const handleCartAction = () => {
    if (!session) {
      toast.error("Please log in to add to cart.", {
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

    if (product.availability !== "In Stock") {
      toast.error(`${product.title} is out of stock.`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    const maxQuantity = product.inStock !== undefined ? product.inStock : 10;
    if (quantity > maxQuantity) {
      toast.warn(`Cannot add more than ${maxQuantity} items.`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    if (isInCart) {
      // Update quantity in cart
      if (updateCartQuantityMutation.isLoading) return;
      updateCartQuantityMutation.mutate({ productId: id, quantity });
    } else {
      // Add to cart
      if (cartMutation.isLoading) return;
      cartMutation.mutate({ productId: id, quantity });
    }
  };

  // Increment popularity on page load
  useEffect(() => {
    const increment = async () => {
      try {
        await incrementPopularity(id, 1);
      } catch (error) {
        console.error("Failed to increment popularity:", error);
      }
    };

    increment();
  }, [id]);

  // Handle quantity increase
  const handleIncreaseQuantity = (e) => {
    e.preventDefault();
    if (!session) {
      toast.error("Please log in to manage your cart.", {
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

    const maxQuantity = product.inStock !== undefined ? product.inStock : 10;
    const newQuantity = quantity + 1;

    if (newQuantity > maxQuantity) {
      toast.warn(`Cannot add more than ${maxQuantity} items.`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    setQuantity(newQuantity);
  };

  // Handle quantity decrease
  const handleDecreaseQuantity = (e) => {
    e.preventDefault();
    if (!session) {
      toast.error("Please log in to manage your cart.", {
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

    const newQuantity = quantity > 1 ? quantity - 1 : 1;
    if (newQuantity === quantity) return;

    setQuantity(newQuantity);
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
      <div className="min-h-screen flex items-center justify-center">
        <p>Failed to load product details. Please try again later.</p>
      </div>
    );
  }

  const product = data?.product;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Product not found.</p>
      </div>
    );
  }

  const maxQuantity = product.inStock !== undefined ? product.inStock : 10;

  return (
    <>
      {/* Main Product Section */}
      <div className="container grid grid-cols-1 md:grid-cols-2 gap-6 py-5">
        {/* Product Images Section */}
        <div>
          <Image
            src={product.mainImage}
            alt={product.title}
            width={500}
            height={500}
            className="w-full rounded-lg shadow-md"
          />
          <div className="grid grid-cols-5 gap-4 mt-4">
            {product.thumbnails.map((thumbnail, index) => (
              <Image
                key={index}
                src={thumbnail}
                alt={`Thumbnail ${index + 1}`}
                width={100}
                height={100}
                className="w-full cursor-pointer border rounded-lg shadow-sm hover:shadow-md transition"
              />
            ))}
          </div>
        </div>

        {/* Product Information Section */}
        <div>
          {/* Product Title */}
          <h2 className="text-3xl font-medium uppercase mb-2">{product.title}</h2>

          {/* Ratings */}
          <div className="flex items-center mb-4">
            <div className="flex gap-1 text-sm text-yellow-400">
              {Array.from({ length: 5 }, (_, index) => (
                <span key={index}>
                  {index < (product.rating || 0) ? <FaStar /> : <FaRegStar />}
                </span>
              ))}
            </div>
            <div className="text-xs text-gray-500 ml-3">
              ({product.reviewCount || 150} Reviews)
            </div>
          </div>

          {/* Product Metadata */}
          <div className="space-y-2">
            <p className="text-gray-800 font-semibold space-x-2">
              <span>Availability: </span>
              <span
                className={
                  product.availability === "In Stock" ? "text-green-600" : "text-red-600"
                }
              >
                {product.availability}
              </span>
            </p>
            <p className="space-x-2">
              <span className="text-gray-800 font-semibold">Brand: </span>
              <span className="text-gray-600">{product.brand}</span>
            </p>
            <p className="space-x-2">
              <span className="text-gray-800 font-semibold">Category: </span>
              <span className="text-gray-600">{product.category}</span>
            </p>
            <p className="space-x-2">
              <span className="text-gray-800 font-semibold">SKU: </span>
              <span className="text-gray-600">{product.sku}</span>
            </p>
          </div>

          {/* Price */}
          <div className="flex items-baseline mb-1 space-x-2 font-roboto mt-4">
            <p className="text-xl text-primary font-semibold">${product.price.toFixed(2)}</p>
            {product.originalPrice && (
              <p className="text-base text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </p>
            )}
          </div>

          {/* Description */}
          <p className="mt-4 text-gray-600">{product.description}</p>

          {/* Quantity Selector */}
          <div className="mt-4">
            <h3 className="text-sm text-gray-800 uppercase mb-1">Quantity</h3>
            <div className="flex border border-gray-300 text-gray-600 divide-x divide-gray-300 w-max">
              <button
                onClick={handleDecreaseQuantity}
                disabled={quantity === 1}
                className={`h-8 w-8 text-xl flex items-center justify-center select-none transition ${
                  quantity === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "cursor-pointer hover:bg-gray-100"
                }`}
              >
                -
              </button>
              <div className="h-8 w-8 text-base flex items-center justify-center">
                {quantity}
              </div>
              <button
                onClick={handleIncreaseQuantity}
                disabled={quantity >= maxQuantity}
                className={`h-8 w-8 text-xl flex items-center justify-center select-none transition ${
                  quantity >= maxQuantity
                    ? "text-gray-400 cursor-not-allowed"
                    : "cursor-pointer hover:bg-gray-100"
                }`}
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons (Add to Cart/Update Cart, Wishlist) */}
          <div className="mt-6 flex gap-3 border-b border-gray-200 pb-5 pt-5">
            <button
              onClick={handleCartAction}
              disabled={
                cartLoading ||
                cartMutation.isLoading ||
                updateCartQuantityMutation.isLoading ||
                product.availability !== "In Stock"
              }
              className={`border px-8 py-2 font-medium rounded uppercase flex items-center gap-2 transition ${
                cartMutation.isLoading ||
                updateCartQuantityMutation.isLoading ||
                cartLoading ||
                product.availability !== "In Stock"
                  ? "bg-primary opacity-50 cursor-not-allowed"
                  : isInCart
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-primary text-white hover:bg-transparent hover:text-primary border-primary"
              }`}
            >
              {(cartMutation.isLoading || updateCartQuantityMutation.isLoading) ? (
                <svg
                  className="animate-spin h-5 w-5 text-white mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <>
                  <i className="fa-solid fa-bag-shopping"></i>
                  {isInCart ? "Update Cart" : "Add to Cart"}
                </>
              )}
            </button>
            <button
              onClick={handleWishlistToggle}
              disabled={wishlistLoading || wishlistMutation.isLoading}
              className={`border px-8 py-2 font-medium rounded uppercase flex items-center gap-2 transition ${
                isInWishlist
                  ? "border-red-500 text-red-500 hover:bg-red-50"
                  : "border-gray-300 text-gray-600 hover:text-red-500 hover:border-red-500"
              } ${wishlistLoading || wishlistMutation.isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {wishlistMutation.isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <i
                  className={`fa-heart ${isInWishlist ? "fa-solid text-red-500" : "fa-regular"}`}
                ></i>
              )}
              {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            </button>
          </div>

          {/* Social Sharing */}
          <div className="flex gap-3 mt-4">
            {["facebook-f", "twitter", "instagram"].map((icon, index) => (
              <a
                key={index}
                href="#"
                className="text-gray-400 hover:text-gray-500 h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center"
              >
                <i className={`fa-brands fa-${icon}`}></i>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="container pb-16">
        <h3 className="border-b border-gray-200 font-roboto text-gray-800 pb-3 font-medium">
          Product Details
        </h3>
        <div className="w-3/5 pt-6 text-gray-600">
          <p>{product.description}</p>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts
        relatedProducts={relatedProducts}
        relatedError={relatedError}
        relatedLoading={relatedLoading}
      />
    </>
  );
};

export default ProductDetails;