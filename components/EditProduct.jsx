"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { updateProduct, getProductById } from "@/actions/products";
import { toast } from "react-toastify";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Helper function to validate URLs
const isValidImageUrl = (url) => {
  // Check if the URL is a non-empty string
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

export default function EditProduct({ params }) {
  const productId = params.id;
  const queryClient = useQueryClient();
  const router = useRouter();

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

  const [message, setMessage] = useState("");

  // Fetch product data
  const { data: productData, isLoading: isLoadingProduct } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId),
    onSuccess: (data) => {
      if (data.product) {
        setFormData({
          title: data.product.title,
          availability: data.product.availability,
          brand: data.product.brand,
          category: data.product.category,
          sku: data.product.sku,
          price: data.product.price.toString(),
          originalPrice: data.product.originalPrice ? data.product.originalPrice.toString() : "",
          description: data.product.description,
          quantity: data.product.quantity,
          mainImage: data.product.mainImage,
          thumbnails: [...(data.product.thumbnails || []), "", "", "", "", ""].slice(0, 5),
        });
      }
    },
    onError: (error) => {
      toast.error(`Error fetching product: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
      router.push("/products");
    }
  });

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
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      
      // Redirect back to products page after successful update
      setTimeout(() => {
        router.push("/products");
      }, 2000);
    },
    onError: (error) => {
      setMessage(`Error: ${error.message}`);
      toast.error(`Error: ${error.message}`, {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    
    // Filter out empty thumbnail URLs
    const filteredThumbnails = formData.thumbnails.filter(url => url.trim() !== "");
    const dataToUpdate = {
      ...formData,
      thumbnails: filteredThumbnails
    };
    
    mutation.mutate(dataToUpdate);
  };

  if (isLoadingProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center py-10 bg-gradient-to-br from-teal-50 via-blue-50 to-pink-50">
        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-xl shadow-lg w-full max-w-4xl border border-gray-100">
          <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
            Edit Product
          </h1>
          {message && (
            <div
              className={`p-3 mb-4 text-center ${
                message.includes("success")
                  ? "text-green-700 bg-green-100"
                  : "text-red-700 bg-red-100"
              } rounded-lg`}
            >
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="block w-full border border-gray-200 rounded-lg p-3 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-teal-300 transition-all shadow-sm hover:shadow-md"
                placeholder="Enter product title"
                required
              />
            </div>

            {/* Availability Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Availability Status
              </label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className="block w-full border border-gray-200 rounded-lg p-3 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-teal-300 transition-all shadow-sm hover:shadow-md"
              >
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="block w-full border border-gray-200 rounded-lg p-3 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-teal-300 transition-all shadow-sm hover:shadow-md"
                placeholder="Enter brand name"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="block w-full border border-gray-200 rounded-lg p-3 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-teal-300 transition-all shadow-sm hover:shadow-md"
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="block w-full border border-gray-200 rounded-lg p-3 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-teal-300 transition-all shadow-sm hover:shadow-md"
                placeholder="Enter SKU"
                required
              />
            </div>

            {/* Price Display */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Display
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="block w-full border border-gray-200 rounded-lg p-3 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-teal-300 transition-all shadow-sm hover:shadow-md"
                placeholder="Enter price"
                required
              />
            </div>

            {/* Original Price Display */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Original Price Display
              </label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                className="block w-full border border-gray-200 rounded-lg p-3 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-teal-300 transition-all shadow-sm hover:shadow-md"
                placeholder="Enter original price"
              />
            </div>

            {/* Product Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="block w-full border border-gray-200 rounded-lg p-3 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-teal-300 transition-all shadow-sm hover:shadow-md"
                rows="4"
                placeholder="Enter product description"
                required
              />
            </div>

            {/* Quantity Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  className="bg-teal-100 text-teal-700 w-10 h-10 flex items-center justify-center rounded-full hover:bg-teal-200 transition-all shadow-sm"
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
                <input
                  type="text"
                  value={formData.quantity}
                  readOnly
                  className="w-16 text-center border border-gray-200 rounded-lg p-3 bg-gray-50/50 shadow-sm"
                />
                <button
                  type="button"
                  onClick={increaseQuantity}
                  className="bg-teal-100 text-teal-700 w-10 h-10 flex items-center justify-center rounded-full hover:bg-teal-200 transition-all shadow-sm"
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

            {/* Main Product Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Main Product Image URL
              </label>
              <input
                type="text"
                name="mainImage"
                value={formData.mainImage}
                onChange={handleChange}
                className="block w-full border border-gray-200 rounded-lg p-3 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-teal-300 transition-all shadow-sm hover:shadow-md"
                placeholder="Enter main image URL (e.g., https://images.unsplash.com/...)"
                required
              />
              {formData.mainImage && (
                <div className="mt-3">
                  {isValidImageUrl(formData.mainImage) ? (
                    <Image
                      width={500}
                      height={500}
                      src={formData.mainImage}
                      alt="Main Product Preview"
                      className="w-full h-64 object-cover rounded-lg shadow-md"
                    />
                  ) : (
                    <p className="text-red-500 text-sm">
                      Invalid image URL. Please use a valid URL from Unsplash, Google, or Facebook.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thumbnail Images (5 URLs)
              </label>
              <div className="space-y-3">
                {formData.thumbnails.map((thumbnail, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={thumbnail}
                      onChange={(e) =>
                        handleThumbnailChange(index, e.target.value)
                      }
                      className="block w-full border border-gray-200 rounded-lg p-3 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-teal-300 transition-all shadow-sm hover:shadow-md"
                      placeholder={`Thumbnail ${index + 1} URL (e.g., https://images.unsplash.com/...)`}
                    />
                    {thumbnail && (
                      <div>
                        {isValidImageUrl(thumbnail) ? (
                          <Image
                            width={100}
                            height={100}
                            src={thumbnail}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-16 h-16 object-cover rounded-lg shadow-sm hover:shadow-md transition-all"
                          />
                        ) : (
                          <p className="text-red-500 text-sm">
                            Invalid URL
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => router.push("/products")}
                className="bg-gray-300 text-gray-800 font-semibold px-8 py-3 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 hover:bg-gray-400"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className="bg-teal-500 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 hover:bg-teal-600"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Updating..." : "Update Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}