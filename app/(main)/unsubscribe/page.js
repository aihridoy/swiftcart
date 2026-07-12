"use client";

import React, { useState } from "react";

const UnsubscribePage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/newsletter", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Something went wrong. Please try again.");
        setIsSubmitting(false);
        return;
      }

      setSuccess("You've been unsubscribed. Sorry to see you go!");
      setEmail("");
      setIsSubmitting(false);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-lg px-4 py-20">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Unsubscribe from our newsletter
      </h1>
      <p className="text-gray-600 mb-8">
        Enter the email address you subscribed with, and we&apos;ll remove it
        from our list.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError("");
          }}
          placeholder="Enter your email address"
          className={`w-full px-4 py-3 text-base border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
            error
              ? "border-red-400 focus:ring-red-400/25"
              : "border-gray-300 focus:border-primary focus:ring-primary/25"
          }`}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Unsubscribing..." : "Unsubscribe"}
        </button>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}
      </form>
    </section>
  );
};

export default UnsubscribePage;
