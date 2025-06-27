"use client";

import React, { useState, useEffect } from "react";

const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  // Animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById("newsletter-section");
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    // Enhanced validation
    if (!email.trim()) {
      setError("Please enter your email address");
      setIsSubmitting(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setSuccess(
        "🎉 Welcome aboard! Check your inbox for a special welcome offer."
      );
      setEmail("");
      setIsSubmitting(false);

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(""), 5000);
    }, 1500);
  };

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    if (error) setError(""); // Clear error when user starts typing
  };

  return (
    <section
      id="newsletter-section"
      className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-20 px-4 sm:px-6 lg:px-8"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating orbs */}
        <div className="absolute top-10 left-10 h-20 w-20 rounded-full bg-blue-400/20 blur-xl animate-pulse" />
        <div className="absolute top-32 right-20 h-32 w-32 rounded-full bg-purple-400/20 blur-xl animate-pulse animation-delay-1000" />
        <div className="absolute bottom-20 left-1/4 h-24 w-24 rounded-full bg-pink-400/20 blur-xl animate-pulse animation-delay-2000" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>

      <div
        className={`relative max-w-4xl mx-auto text-center transition-all duration-1000 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            Join 50,000+ Happy Subscribers
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">
            Never Miss a
            <span className="block bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
              Great Deal
            </span>
          </h2>

          <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Get exclusive offers, new arrivals & home decor inspiration
            delivered to your inbox weekly
          </p>
        </div>

        {/* Enhanced Form */}
        <form
          onSubmit={handleSubmit}
          className="mb-8"
          aria-label="Newsletter subscription form"
        >
          <div className="max-w-md mx-auto sm:max-w-lg">
            <div className="relative group">
              {/* Input Container */}
              <div className="relative flex items-center">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>

                <input
                  type="email"
                  required
                  value={email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  className={`w-full pl-12 pr-32 sm:pr-40 py-4 text-lg bg-white/95 backdrop-blur-sm border-2 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-white/25 focus:border-white/50 transition-all duration-300 placeholder-gray-500 ${
                    error
                      ? "border-red-400 focus:border-red-400 focus:ring-red-400/25"
                      : success
                        ? "border-green-400 focus:border-green-400 focus:ring-green-400/25"
                        : "border-white/30 hover:border-white/50"
                  }`}
                  aria-label="Email address"
                  aria-invalid={error ? "true" : "false"}
                  aria-describedby={
                    error
                      ? "email-error"
                      : success
                        ? "email-success"
                        : undefined
                  }
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`absolute right-2 top-2 bottom-2 px-6 sm:px-8
  bg-red-500 hover:bg-red-600
  text-white font-semibold rounded-xl
  transition-all duration-300 transform hover:scale-105
  focus:outline-none focus:ring-4 focus:ring-primary/50
  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
  shadow-lg ${isSubmitting ? "animate-pulse" : ""}`}
                  aria-label="Subscribe to newsletter"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4"
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
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span className="hidden sm:inline">Joining...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>Subscribe</span>
                      <svg
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              </div>

              {/* Status Messages */}
              {error && (
                <div
                  id="email-error"
                  className="mt-3 p-3 bg-red-100/90 backdrop-blur-sm border border-red-200 rounded-lg"
                >
                  <div className="flex items-center gap-2 text-red-700">
                    <svg
                      className="h-4 w-4 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                </div>
              )}

              {success && (
                <div
                  id="email-success"
                  className="mt-3 p-4 bg-green-100/90 backdrop-blur-sm border border-green-200 rounded-lg animate-fade-in"
                >
                  <div className="flex items-center gap-2 text-green-800">
                    <svg
                      className="h-5 w-5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-medium">{success}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 max-w-3xl mx-auto">
          <div className="flex flex-col items-center text-center group">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 group-hover:bg-white/20 transition-colors">
              <svg
                className="w-6 h-6 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-1">Exclusive Deals</h3>
            <p className="text-white/70 text-sm">
              Up to 40% off subscriber-only offers
            </p>
          </div>

          <div className="flex flex-col items-center text-center group">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 group-hover:bg-white/20 transition-colors">
              <svg
                className="w-6 h-6 text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-1">Weekly Updates</h3>
            <p className="text-white/70 text-sm">
              New arrivals & trending products
            </p>
          </div>

          <div className="flex flex-col items-center text-center group">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 group-hover:bg-white/20 transition-colors">
              <svg
                className="w-6 h-6 text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-1">Design Tips</h3>
            <p className="text-white/70 text-sm">
              Expert home decor inspiration
            </p>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-white/60">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>100% Privacy Protected</span>
          </div>
          <div className="hidden sm:block w-1 h-1 bg-white/30 rounded-full" />
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-blue-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>No Spam, Ever</span>
          </div>
          <div className="hidden sm:block w-1 h-1 bg-white/30 rounded-full" />
          <button
            className="underline hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
            onClick={() => {
              /* Handle unsubscribe */
            }}
          >
            Unsubscribe anytime
          </button>
        </div>
      </div>

      <style jsx>{`
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </section>
  );
};

export default NewsLetter;
