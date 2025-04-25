"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { updateProduct, getProductById } from "@/actions/products";
import { session } from "@/actions/auth-utils";
import { toast } from "react-toastify";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  FaTag, 
  FaBox, 
  FaDollarSign, 
  FaImage, 
  FaList, 
  FaInfoCircle, 
  FaArrowLeft, 
  FaSave, 
  FaSpinner 
} from "react-icons/fa";

// Helper function to validate URLs
const isValidImageUrl = (url) => {
  if (!url || typeof url !== "string") return false;

  const urlPattern = /^https?:\/\//;
  if (!urlPattern.test(url)) return false;

  try {
    const { hostname } = new URL(url);
    const allowedHostnames = [
      "images.unsplash.com",
      "lh3.googleusercontent.com",
      "platform-lookaside.fbsbx.com",
    ];
    return allowedHostnames.includes(hostname);
  } catch (error) {
    return false;
  }
};

export default function EditProductPage({ params }) {
  const productId = params.id;
  const queryClient = useQueryClient();
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    availability: "In Stock",
    brand: "",
    category: "",
    sku: "",
    price: "",
    originalPrice: "",
    description: "",
    quantity: 0,
    mainImage: "",
    thumbnails: ["", "", "", "", ""],
  });

  // Fetch user session
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoadingSession(true);
        const res = await session();
        if (res) {
          setUser(res);
        } else {
          toast.error("Please log in to edit a product.", {
            position: "top-right",
            autoClose: 3000,
          });
          router.push("/login");
        }
      } catch (error) {
        toast.error(`Error fetching session: ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
        router.push("/login");
      } finally {
        setIsLoadingSession(false);
      }
    };
    fetchUser();
  }, [router]);

  // Fetch product data
  const { data: productData, isLoading: isLoadingProduct } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId),
    enabled: !!user && !isLoadingSession,
    onSuccess: (data) => {
      if (data.product) {
        if (user && data.product.user && user.id !== data.product.user) {
          toast.error("You can only edit your own products.", {
            position: "top-right",
            autoClose: 3000,
          });
          router.push("/products");
          return;
        }
      }
    },
    onError: (error) => {
      toast.error(`Error fetching product: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
      router.push("/products");
    },
  });

  // Update form data when product data changes
  useEffect(() => {
    if (productData?.product) {
      setFormData({
        title: productData.product.title || "",
        availability: productData.product.availability || "In Stock",
        brand: productData.product.brand || "",
        category: productData.product.category || "",
        sku: productData.product.sku || "",
        price: productData.product.price ? productData.product.price.toString() : "",
        originalPrice: productData.product.originalPrice
          ? productData.product.originalPrice.toString()
          : "",
        description: productData.product.description || "",
        quantity: productData.product.quantity || 0,
        mainImage: productData.product.mainImage || "",
        thumbnails: [...(productData.product.thumbnails || []), "", "", "", "", ""].slice(0, 5),
      });
    }
  }, [productData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (index, value) => {
    const updatedThumbnails = [...formData.thumbnails];
    updatedThumbnails[index] = value;
    setFormData((prev) => ({ ...prev, thumbnails: updatedThumbnails }));
  };

  const increaseQuantity = () => {
    setFormData((prev) => ({ ...prev, quantity: prev.quantity + 1 }));
  };

  const decreaseQuantity = () => {
    if (formData.quantity > 1) {
      setFormData((prev) => ({ ...prev, quantity: prev.quantity - 1 }));
    }
  };

  const mutation = useMutation({
    mutationFn: (data) => updateProduct(productId, data),
    onSuccess: (data) => {
      setMessage("Product updated successfully!");
      toast.success("Product updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      setTimeout(() => {
        router.push("/products");
      }, 2000);
    },
    onError: (error) => {
      setMessage(`Error: ${error.message}`);
      toast.error(`Error: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    const filteredThumbnails = formData.thumbnails.filter((url) => url.trim() !== "");
    const dataToUpdate = {
      ...formData,
      thumbnails: filteredThumbnails,
    };

    mutation.mutate(dataToUpdate);
  };

  // Loading state while fetching session
  if (isLoadingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  // If user is not authenticated, the redirect will already happen in useEffect
  if (!user) {
    return null;
  }

  if (isLoadingProduct || !productData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-teal-50 py-8 px-4">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md shadow-md p-6 rounded-b-xl mb-6">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <FaArrowLeft className="text-xl" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              Edit Product: {productData.product.title}
            </h1>
          </div>
          <button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-semibold text-white shadow-md transition-all duration-300 ${
              mutation.isPending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
            }`}
          >
            {mutation.isPending ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <FaSave />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2 bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6">
          {message && (
            <div
              className={`p-4 mb-6 rounded-lg text-center font-medium ${
                message.includes("success")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <FaInfoCircle className="mr-2 text-blue-500" />
                Basic Information
              </h2>
              {/* Product Title */}
              <div className="relative">
                <FaTag className="absolute top-4 left-4 text-gray-400" />
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm hover:shadow-md"
                  placeholder="Product Title"
                  required
                />
              </div>

              {/* Availability Status */}
              <div className="relative">
                <FaBox className="absolute top-4 left-4 text-gray-400" />
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm hover:shadow-md appearance-none"
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>

              {/* Brand */}
              <div className="relative">
                <FaTag className="absolute top-4 left-4 text-gray-400" />
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm hover:shadow-md"
                  placeholder="Brand Name"
                  required
                />
              </div>

              {/* Category */}
              <div className="relative">
                <FaList className="absolute top-4 left-4 text-gray-400" />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm hover:shadow-md appearance-none"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Bedroom">Bedroom</option>
                  <option value="Mattress">Mattress</option>
                  <option value="Outdoor">Outdoor</option>
                  <option value="Sofa">Sofa</option>
                  <option value="Living Room">Living Room</option>
                  <option value="Kitchen">Kitchen</option>
                </select>
              </div>

              {/* SKU */}
              <div className="relative">
                <FaTag className="absolute top-4 left-4 text-gray-400" />
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm hover:shadow-md"
                  placeholder="SKU"
                  required
                />
              </div>
            </div>

            {/* Pricing Section */}
            <div className="space-y-6 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <FaDollarSign className="mr-2 text-blue-500" />
                Pricing & Quantity
              </h2>
              {/* Price */}
              <div className="relative">
                <FaDollarSign className="absolute top-4 left-4 text-gray-400" />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm hover:shadow-md"
                  placeholder={`Current: $${productData.product.price?.toFixed(2)}`}
                  required
                />
              </div>

              {/* Original Price */}
              <div className="relative">
                <FaDollarSign className="absolute top-4 left-4 text-gray-400" />
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm hover:shadow-md"
                  placeholder={
                    productData.product.originalPrice
                      ? `Current: $${productData.product.originalPrice?.toFixed(2)}`
                      : "Original Price (Optional)"
                  }
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity (Current: {productData.product.quantity})
                </label>
                <div className="flex items-center space-x-4 bg-gray-50 rounded-lg p-2 shadow-sm">
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M20 12H4"
                      />
                    </svg>
                  </button>
                  <div className="w-16 text-center py-2 bg-white border border-gray-200 rounded-lg">
                    {formData.quantity}
                  </div>
                  <button
                    type="button"
                    onClick={increaseQuantity}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-6 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <FaInfoCircle className="mr-2 text-blue-500" />
                Description
              </h2>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-4 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm hover:shadow-md"
                rows="5"
                placeholder="Enter product description"
                required
              />
            </div>
          </form>
        </div>

        {/* Image Preview Sidebar */}
        <div className="lg:col-span-1 bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6 sticky top-32 h-fit">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
            <FaImage className="mr-2 text-blue-500" />
            Images
          </h2>

          {/* Main Image */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Main Image
            </label>
            <div className="relative mb-4">
              <input
                type="text"
                name="mainImage"
                value={formData.mainImage}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm hover:shadow-md"
                placeholder="Main Image URL"
                required
              />
            </div>
            {(formData.mainImage || productData.product.mainImage) && (
              <div className="mt-2">
                {isValidImageUrl(formData.mainImage) ? (
                  <Image
                    width={300}
                    height={300}
                    src={formData.mainImage}
                    alt="Main Product Preview"
                    className="w-full h-48 object-cover rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                  />
                ) : productData.product.mainImage && isValidImageUrl(productData.product.mainImage) ? (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Current Image:</p>
                    <Image
                      width={300}
                      height={300}
                      src={productData.product.mainImage}
                      alt="Current Main Product"
                      className="w-full h-48 object-cover rounded-lg shadow-md opacity-75 hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <p className="text-red-500 text-sm">
                    Invalid image URL. Use a valid URL from Unsplash, Google, or Facebook.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thumbnails (5 URLs)
            </label>
            <div className="space-y-4">
              {formData.thumbnails.map((thumbnail, index) => {
                const currentThumbnail = productData.product.thumbnails && productData.product.thumbnails[index];
                return (
                  <div key={index} className="space-y-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={thumbnail}
                        onChange={(e) => handleThumbnailChange(index, e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm hover:shadow-md"
                        placeholder={`Thumbnail ${index + 1} URL`}
                      />
                    </div>
                    {thumbnail ? (
                      <div>
                        {isValidImageUrl(thumbnail) ? (
                          <Image
                            width={100}
                            height={100}
                            src={thumbnail}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-lg shadow-sm hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <p className="text-red-500 text-sm">Invalid URL</p>
                        )}
                      </div>
                    ) : currentThumbnail && isValidImageUrl(currentThumbnail) ? (
                      <div>
                        <Image
                          width={100}
                          height={100}
                          src={currentThumbnail}
                          alt={`Current Thumbnail ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg shadow-sm opacity-75 hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}