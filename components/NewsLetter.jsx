"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaEnvelope,
  FaTag,
  FaCalendarAlt,
  FaHeart,
  FaLock,
  FaCheckCircle,
  FaSpinner,
  FaArrowRight,
} from "react-icons/fa";

const BENEFITS = [
  {
    icon: FaTag,
    title: "Exclusive Deals",
    description: "Up to 40% off subscriber-only offers",
  },
  {
    icon: FaCalendarAlt,
    title: "Weekly Updates",
    description: "New arrivals & trending products",
  },
  {
    icon: FaHeart,
    title: "Design Tips",
    description: "Expert home decor inspiration",
  },
];

const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isVisible, setIsVisible] = useState(false);

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

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Something went wrong. Please try again.");
        setIsSubmitting(false);
        return;
      }

      setSuccess("Welcome aboard! You'll get our regular welcome offers.");
      setEmail("");
      setIsSubmitting(false);
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  return (
    <section id="newsletter-section" className="container py-16 bg-white">
      <div
        className={`mx-auto max-w-2xl text-center transition-all duration-1000 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
          <FaEnvelope />
          Join 50,000+ Happy Subscribers
        </div>

        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 uppercase mb-3">
          Never Miss a Great Deal
        </h2>

        <p className="text-gray-600 mb-8">
          Get exclusive offers, new arrivals & home decor inspiration
          delivered to your inbox weekly
        </p>

        <form
          onSubmit={handleSubmit}
          className="mb-10"
          aria-label="Newsletter subscription form"
        >
          <div className="mx-auto max-w-md sm:max-w-lg">
            <div className="flex">
              <input
                type="email"
                required
                value={email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                className={`flex-1 min-w-0 rounded-l-md border border-r-0 px-4 py-3 text-sm sm:text-base focus:outline-none ${
                  error ? "border-red-400" : "border-primary"
                }`}
                aria-label="Email address"
                aria-invalid={error ? "true" : "false"}
                aria-describedby={
                  error ? "email-error" : success ? "email-success" : undefined
                }
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-r-md border border-primary bg-primary px-6 sm:px-8 font-medium uppercase text-white transition hover:bg-transparent hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Subscribe to newsletter"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span className="hidden sm:inline">Joining...</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <FaArrowRight className="hidden sm:inline" />
                  </>
                )}
              </button>
            </div>

            {error && (
              <div
                id="email-error"
                className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700"
              >
                {error}
              </div>
            )}

            {success && (
              <div
                id="email-success"
                className="mt-3 rounded-md border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-700"
              >
                {success}
              </div>
            )}
          </div>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 mx-auto max-w-xl">
          {BENEFITS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col items-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <FaLock className="text-primary" />
            <span>100% Privacy Protected</span>
          </div>
          <div className="hidden sm:block h-1 w-1 rounded-full bg-gray-300" />
          <div className="flex items-center gap-2">
            <FaCheckCircle className="text-primary" />
            <span>No Spam, Ever</span>
          </div>
          <div className="hidden sm:block h-1 w-1 rounded-full bg-gray-300" />
          <Link
            href="/unsubscribe"
            className="underline hover:text-primary transition-colors"
          >
            Unsubscribe anytime
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsLetter;
