import React from "react";
import Link from "next/link";
import { FaExclamationTriangle } from "react-icons/fa";

const ErrorPage = ({ errorMessage = "Oops! Something went wrong." }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-teal-50 py-8 px-4 flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-8 text-center max-w-md w-full">
        {/* Error Icon */}
        <div className="mb-6">
          <FaExclamationTriangle className="text-red-500 text-6xl mx-auto" />
        </div>

        {/* Error Message */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">{errorMessage}</h2>
        <p className="text-gray-600 mb-6">
          We’re sorry for the inconvenience. Let’s get you back on track!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <span>Go to Homepage</span>
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg bg-gray-100 text-gray-800 font-semibold hover:bg-gray-200 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <span>Browse Products</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;