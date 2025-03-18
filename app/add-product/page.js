"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { addProduct } from "@/actions/products";

export default function AddProduct() {
  const [formData, setFormData] = useState({
    title: "",
    availability: "In Stock",
    brand: "",
    category: "",
    sku: "",
    price: "",
    originalPrice: "",
    description: "",
    quantity: 4,
    mainImage: "",
    thumbnails: ["", "", "", "", ""],
  });

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
      setFormData({
        title: "",
        availability: "In Stock",
        brand: "",
        category: "",
        sku: "",
        price: "",
        originalPrice: "",
        description: "",
        quantity: 4,
        mainImage: "",
        thumbnails: ["", "", "", "", ""],
      }); // Reset form
    },
    onError: (error) => {
      setMessage(`Error: ${error.message}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(""); 
    mutation.mutate(formData); // Trigger the mutation
  };

  return (
    <>
      <Header />
      <Navbar />
      <div className="min-h-screen flex items-center justify-center py-10 bg-gradient-to-br from-teal-50 via-blue-50 to-pink-50">
        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-xl shadow-lg w-full max-w-4xl border border-gray-100">
          <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
            Add New Product
          </h1>
          {message && (
            <div
              className={`p-3 mb-4 text-center ${
                message.includes("success") ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"
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
                placeholder="Enter main image URL"
                required
              />
              {formData.mainImage && (
                <div className="mt-3">
                  <img
                    src={formData.mainImage}
                    alt="Main Product Preview"
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                  />
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
                      placeholder={`Thumbnail ${index + 1} URL`}
                    />
                    {thumbnail && (
                      <img
                        src={thumbnail}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-lg shadow-sm hover:shadow-md transition-all"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="bg-teal-400 font-semibold px-8 py-3 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                onClick={() => console.log("Button clicked")}
                disabled={mutation.isLoading} // Disable button while loading
              >
                {mutation.isLoading ? "Adding..." : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}