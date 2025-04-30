"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import RelatedProducts from "@/components/RelatedProducts";
import { getProductById, getProducts, incrementPopularity } from "@/actions/products";
import { getWishlist, updateWishlist } from "@/actions/wishlist";
import { addToCart, getCart, updateCartQuantity } from "@/actions/cart-utils";
import { addReview, getReviewsByProductId } from "@/actions/review-utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaStar, FaRegStar } from "react-icons/fa";
import { session } from "@/actions/auth-utils";

const ProductDetails = ({ params }) => {
  const { id } = params;
  const [quantity, setQuantity] = useState(1);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();
  const { data: userSession } = useSession();
  const router = useRouter();

  useEffect(() => {
        async function fetchUser() {
          const res = await session();
          if(res) {
            setUser(res.user);
          }
        }
        fetchUser();
      }, []);

  // Fetch product details
  const { data: productData, error: productError, isLoading: productLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    onError: (error) => {
      toast.error(`Error fetching product: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    },
  });

  // Fetch related products
  const { data: relatedProducts, error: relatedError, isLoading: relatedLoading } = useQuery({
    queryKey: ["relatedProducts", id],
    queryFn: () => getProducts({ limit: 4, sort: "popularity", category: productData?.product.category }),
    enabled: !!productData?.product.category,
    onError: (error) => {
      toast.error(`Error fetching related products: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    },
  });

  // Fetch wishlist
  const { data: wishlistData, error: wishlistError, isLoading: wishlistLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
    enabled: !!userSession,
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
    enabled: !!userSession,
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

  // Fetch reviews
  const { data: reviewsData, error: reviewsError, isLoading: reviewsLoading } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () => getReviewsByProductId(id),
    onError: (error) => {
      toast.error(`Error fetching reviews: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
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

  // Cart mutation (for adding to cart)
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

  // Update cart quantity mutation
  const updateCartQuantityMutation = useMutation({
    mutationFn: ({ productId, quantity }) => updateCartQuantity(productId, quantity),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["cart"]);
      toast.success("Cart updated successfully!", {
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
        setTimeout(() => router.push("/login"), 3000);
      } else {
        toast.error(`Error: ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    },
  });

  // Add review mutation
  const reviewMutation = useMutation({
    mutationFn: ({ productId, review, rating }) => addReview({ productId, review, rating }),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["reviews", id]);
      setReviewText("");
      setRating(0);
      toast.success(data.message, {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error) => {
      if (error) {
        toast.error(`${error.message}`, {
          position: "top-right",
          autoClose: 3000,
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
    if (!user) {
      toast.error("Please log in to manage your wishlist.", {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => router.push("/login"), 3000);
      return;
    }

    if (wishlistLoading || wishlistMutation.isPending) return;
    const action = isInWishlist ? "remove" : "add";
    wishlistMutation.mutate({ productId: id, action });
  };

  // Handle add to cart or update cart
  const handleCartAction = () => {
    if (!user) {
      toast.error("Please log in to add to cart.", {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => router.push("/login"), 3000);
      return;
    }

    if (product.availability !== "In Stock") {
      toast.error(`${product.title} is out of stock.`, {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const maxQuantity = product.inStock !== undefined ? product.inStock : 10;
    if (quantity > maxQuantity) {
      toast.warn(`Cannot add more than ${maxQuantity} items.`, {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (isInCart) {
      if (updateCartQuantityMutation.isPending) return;
      updateCartQuantityMutation.mutate({ productId: id, quantity });
    } else {
      if (cartMutation.isPending) return;
      cartMutation.mutate({ productId: id, quantity });
    }
  };

  // Handle review submission
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to submit a review.", {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => router.push("/login"), 3000);
      return;
    }

    if (!reviewText || rating < 1) {
      toast.warn("Please provide a review and rating.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (reviewMutation.isPending) return;
    reviewMutation.mutate({ productId: id, review: reviewText, rating });
  };

  // Handle star rating click
  const handleRatingClick = (value) => {
    setRating(value);
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
    if (!user) {
      toast.error("Please log in to manage your cart.", {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => router.push("/login"), 3000);
      return;
    }

    const maxQuantity = product.inStock !== undefined ? product.inStock : 10;
    const newQuantity = quantity + 1;

    if (newQuantity > maxQuantity) {
      toast.warn(`Cannot add more than ${maxQuantity} items.`, {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    setQuantity(newQuantity);
  };

  // Handle quantity decrease
  const handleDecreaseQuantity = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to manage your cart.", {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => router.push("/login"), 3000);
      return;
    }

    const newQuantity = quantity > 1 ? quantity - 1 : 1;
    if (newQuantity === quantity) return;
    setQuantity(newQuantity);
  };

  if (productLoading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (productError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Failed to load product details. Please try again later.</p>
      </div>
    );
  }

  const product = productData?.product;
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Product not found.</p>
      </div>
    );
  }

  const reviews = reviewsData || [];
  // Calculate average rating and total reviews
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? Number((reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1))
    : 0;

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
          <h2 className="text-3xl font-medium uppercase mb-2">{product.title}</h2>
          <div className="flex items-center mb-4">
            <div className="flex gap-1 text-sm text-yellow-400">
              {Array.from({ length: 5 }, (_, index) => (
                <span key={index}>
                  {index < averageRating ? <FaStar /> : <FaRegStar />}
                </span>
              ))}
            </div>
            <div className="text-xs text-gray-500 ml-3">
              ({totalReviews} Reviews)
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-gray-800 font-semibold space-x-2">
              <span>Availability: </span>
              <span className={product.availability === "In Stock" ? "text-green-600" : "text-red-600"}>
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
          <div className="flex items-baseline mb-1 space-x-2 font-roboto mt-4">
            <p className="text-xl text-primary font-semibold">${product.price.toFixed(2)}</p>
            {product.originalPrice && (
              <p className="text-base text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </p>
            )}
          </div>
          <p className="mt-4 text-gray-600">{product.description}</p>
          <div className="mt-4">
            <h3 className="text-sm text-gray-800 uppercase mb-1">Quantity</h3>
            <div className="flex border border-gray-300 text-gray-600 divide-x divide-gray-300 w-max">
              <button
                onClick={handleDecreaseQuantity}
                disabled={quantity === 1}
                className={`h-8 w-8 text-xl flex items-center justify-center select-none transition ${
                  quantity === 1 ? "text-gray-400 cursor-not-allowed" : "cursor-pointer hover:bg-gray-100"
                }`}
              >
                -
              </button>
              <div className="h-8 w-8 text-base flex items-center justify-center">{quantity}</div>
              <button
                onClick={handleIncreaseQuantity}
                disabled={quantity >= maxQuantity}
                className={`h-8 w-8 text-xl flex items-center justify-center select-none transition ${
                  quantity >= maxQuantity ? "text-gray-400 cursor-not-allowed" : "cursor-pointer hover:bg-gray-100"
                }`}
              >
                +
              </button>
            </div>
          </div>
          <div className="mt-6 flex gap-3 border-b border-gray-200 pb-5 pt-5">
            <button
              onClick={handleCartAction}
              disabled={
                cartLoading ||
                cartMutation.isPending ||
                updateCartQuantityMutation.isPending ||
                product.availability !== "In Stock"
              }
              className={`border px-8 py-2 font-medium rounded uppercase flex items-center gap-2 transition ${
                cartMutation.isPending ||
                updateCartQuantityMutation.isLoading ||
                cartLoading ||
                product.availability !== "In Stock"
                  ? "bg-primary opacity-50 cursor-not-allowed"
                  : isInCart
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-primary text-white hover:bg-transparent hover:text-primary border-primary"
              }`}
            >
              {(cartMutation.isPending || updateCartQuantityMutation.isPending) ? (
                <svg
                  className="animate-spin h-5 w-5 text-white mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
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
              disabled={wishlistLoading || wishlistMutation.isPending}
              className={`border px-8 py-2 font-medium rounded uppercase flex items-center gap-2 transition ${
                isInWishlist
                  ? "border-red-500 text-red-500 hover:bg-red-50"
                  : "border-gray-300 text-gray-600 hover:text-red-500 hover:border-red-500"
              } ${wishlistLoading || wishlistMutation.isPending ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {wishlistMutation.isPending ? (
                <svg
                  className="animate-spin h-5 w-5 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <i className={`fa-heart ${isInWishlist ? "fa-solid text-red-500" : "fa-regular"}`}></i>
              )}
              {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            </button>
          </div>
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
        <div className="w-full md:w-3/5 pt-6 text-gray-600">
          <p>{product.description}</p>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <h3 className="border-b border-gray-200 font-roboto text-gray-800 pb-3 font-medium">
            Reviews ({totalReviews})
          </h3>

          {/* Add Review Form */}
          <div className="mt-6">
            <h4 className="text-lg font-medium text-gray-800 mb-4">Write a Review</h4>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <div className="flex gap-1 text-xl text-gray-400">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleRatingClick(value)}
                      className={`focus:outline-none ${
                        value <= rating ? "text-yellow-400" : "text-gray-400"
                      }`}
                    >
                      {value <= rating ? <FaStar /> : <FaRegStar />}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Review
                </label>
                <textarea
                  id="review"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows="4"
                  placeholder="Share your thoughts about this product..."
                  maxLength={500}
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={reviewMutation.isPending}
                className={`bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-dark transition ${
                  reviewMutation.isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {reviewMutation.isPending ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white mx-auto"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "Submit Review"
                )}
              </button>
            </form>
          </div>

          {/* Display Reviews */}
          <div className="mt-8">
            {reviewsLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
              </div>
            ) : reviewsError ? (
              <p className="text-red-600">Failed to load reviews. Please try again later.</p>
            ) : reviews.length === 0 ? (
              <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review._id} className="border-b border-gray-200 pb-4">
                    <div className="flex items-center mb-2">
                      <div className="flex gap-1 text-sm text-yellow-400">
                        {Array.from({ length: 5 }, (_, index) => (
                          <span key={index}>
                            {index < review.rating ? <FaStar /> : <FaRegStar />}
                          </span>
                        ))}
                      </div>
                      <span className="ml-3 text-sm text-gray-500">
                        by {review.userId?.name || "Anonymous"} on{" "}
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600">{review.review}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
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