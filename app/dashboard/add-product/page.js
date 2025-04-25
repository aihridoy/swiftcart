"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addProduct } from "@/actions/products";
import { toast } from "react-toastify";
import Image from "next/image";

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

export default function AddProduct() {
  const queryClient = useQueryClient();

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

  const [activeTab, setActiveTab] = useState('basic'); // 'basic' or 'media'
  const [message, setMessage] = useState("");

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
    mutationFn: addProduct,
    onSuccess: (data) => {
      setMessage("Product added successfully!");
      toast.success("Product added successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setFormData({
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

      queryClient.invalidateQueries({ queryKey: ["products"] });
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
    mutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-purple-100">
          <div className="flex items-center justify-between bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
            <h1 className="text-3xl font-bold text-white">Add New Product</h1>
            <div className="flex space-x-1">
              <button 
                onClick={() => setActiveTab('basic')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  activeTab === 'basic' 
                    ? 'bg-white text-indigo-700' 
                    : 'bg-indigo-500/20 text-white hover:bg-indigo-500/40'
                }`}
              >
                Basic Info
              </button>
              <button 
                onClick={() => setActiveTab('media')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  activeTab === 'media' 
                    ? 'bg-white text-indigo-700' 
                    : 'bg-indigo-500/20 text-white hover:bg-indigo-500/40'
                }`}
              >
                Media & Images
              </button>
            </div>
          </div>

          {message && (
            <div
              className={`mx-6 mt-4 p-4 ${
                message.includes("success")
                  ? "bg-green-100 text-green-800 border-l-4 border-green-500"
                  : "bg-red-100 text-red-800 border-l-4 border-red-500"
              } rounded-md flex items-center`}
            >
              <svg 
                className={`w-5 h-5 mr-2 ${message.includes("success") ? "text-green-500" : "text-red-500"}`} 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                {message.includes("success") ? (
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                )}
              </svg>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6">
            {activeTab === 'basic' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Product Title */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-indigo-600 transition-colors">
                      Product Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="block w-full border border-gray-200 rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all group-hover:border-indigo-300 shadow-sm"
                      placeholder="Enter product title"
                      required
                    />
                  </div>

                  {/* Brand */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-indigo-600 transition-colors">
                      Brand
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      className="block w-full border border-gray-200 rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all group-hover:border-indigo-300 shadow-sm"
                      placeholder="Enter brand name"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-indigo-600 transition-colors">
                      Category
                    </label>
                    <div className="relative">
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="block appearance-none w-full border border-gray-200 rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all group-hover:border-indigo-300 shadow-sm pr-10"
                      >
                        <option value="">Select a category</option>
                        <option value="Bedroom">Bedroom</option>
                        <option value="Mattress">Mattress</option>
                        <option value="Outdoor">Outdoor</option>
                        <option value="Sofa">Sofa</option>
                        <option value="Living Room">Living Room</option>
                        <option value="Kitchen">Kitchen</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* SKU */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-indigo-600 transition-colors">
                      SKU
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      className="block w-full border border-gray-200 rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all group-hover:border-indigo-300 shadow-sm"
                      placeholder="Enter SKU"
                      required
                    />
                  </div>

                  {/* Availability Status */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-indigo-600 transition-colors">
                      Availability Status
                    </label>
                    <div className="relative">
                      <select
                        name="availability"
                        value={formData.availability}
                        onChange={handleChange}
                        className="block appearance-none w-full border border-gray-200 rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all group-hover:border-indigo-300 shadow-sm pr-10"
                      >
                        <option value="In Stock">In Stock</option>
                        <option value="Out of Stock">Out of Stock</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Price Display */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-indigo-600 transition-colors">
                      Price Display ($)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="block w-full border border-gray-200 rounded-lg pl-8 p-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all group-hover:border-indigo-300 shadow-sm"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>

                  {/* Original Price Display */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-indigo-600 transition-colors">
                      Original Price Display ($)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                      <input
                        type="number"
                        name="originalPrice"
                        value={formData.originalPrice}
                        onChange={handleChange}
                        className="block w-full border border-gray-200 rounded-lg pl-8 p-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all group-hover:border-indigo-300 shadow-sm"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-indigo-600 transition-colors">
                      Quantity
                    </label>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={decreaseQuantity}
                        className="bg-indigo-100 text-indigo-700 w-10 h-10 flex items-center justify-center rounded-full hover:bg-indigo-200 transition-all shadow-sm"
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
                        className="w-16 text-center border border-gray-200 rounded-lg p-3 bg-white shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={increaseQuantity}
                        className="bg-indigo-100 text-indigo-700 w-10 h-10 flex items-center justify-center rounded-full hover:bg-indigo-200 transition-all shadow-sm"
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

                  {/* Product Description */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-indigo-600 transition-colors">
                      Product Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="block w-full border border-gray-200 rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all group-hover:border-indigo-300 shadow-sm"
                      rows="4"
                      placeholder="Enter product description"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'media' && (
              <div className="space-y-8">
                {/* Main Product Image */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-indigo-600 transition-colors">
                    Main Product Image URL
                  </label>
                  <input
                    type="text"
                    name="mainImage"
                    value={formData.mainImage}
                    onChange={handleChange}
                    className="block w-full border border-gray-200 rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all group-hover:border-indigo-300 shadow-sm"
                    placeholder="Enter main image URL (e.g., https://images.unsplash.com/...)"
                    required
                  />
                  {formData.mainImage && (
                    <div className="mt-4">
                      {isValidImageUrl(formData.mainImage) ? (
                        <div className="relative overflow-hidden rounded-xl shadow-lg border-2 border-indigo-100 group-hover:border-indigo-300 transition-all">
                          <Image
                            width={500}
                            height={500}
                            src={formData.mainImage}
                            alt="Main Product Preview"
                            className="w-full h-64 object-cover transition-transform hover:scale-105 duration-300"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-900/70 p-3 text-white text-sm font-medium">
                            Main Product Image
                          </div>
                        </div>
                      ) : (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-2 rounded-md">
                          <div className="flex items-center">
                            <svg className="h-5 w-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <p className="text-red-700 text-sm">
                              Invalid image URL. Please use a valid URL from Unsplash, Google, or Facebook.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-indigo-600 transition-colors">
                    Thumbnail Images
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.thumbnails.map((thumbnail, index) => (
                      <div key={index} className="flex space-x-3 items-start">
                        <div className="flex-grow">
                          <div className="relative">
                            <input
                              type="text"
                              value={thumbnail}
                              onChange={(e) =>
                                handleThumbnailChange(index, e.target.value)
                              }
                              className="block w-full border border-gray-200 rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all group-hover:border-indigo-300 shadow-sm"
                              placeholder={`Thumbnail ${index + 1} URL`}
                            />
                            <div className="absolute inset-y-0 right-2 flex items-center">
                              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded">
                                #{index + 1}
                              </span>
                            </div>
                          </div>
                        </div>
                        {thumbnail && (
                          <div className="flex-shrink-0">
                            {isValidImageUrl(thumbnail) ? (
                              <div className="relative w-16 h-16 overflow-hidden rounded-lg shadow-md border border-indigo-200 hover:border-indigo-400 transition-all">
                                <Image
                                  width={100}
                                  height={100}
                                  src={thumbnail}
                                  alt={`Thumbnail ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="flex items-center justify-center w-16 h-16 bg-red-50 rounded-lg border border-red-200">
                                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-10 pt-6 border-t border-gray-200 flex justify-between items-center">
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {activeTab === 'basic' ? (
                  <span>Fill in basic information, then move to Media tab</span>
                ) : (
                  <span>Add product images to complete your listing</span>
                )}
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={mutation.isLoading}
              >
                {mutation.isPending ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding Product...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Add Product
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}