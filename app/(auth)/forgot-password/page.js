"use client";
import React, { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Password reset email sent! Please check your inbox.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setSubmitStatus("success");
        setEmail("");
      } else {
        throw new Error(result.error || "Failed to send password reset email");
      }
    } catch (error) {
      console.error("Error submitting forgot password request:", error);
      toast.error(error.message === "Email not found" ? "Email not found. Please try again." : "Failed to send password reset email. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg mx-auto shadow px-6 py-7 rounded bg-white">
        <h2 className="text-2xl uppercase font-medium mb-1 text-center">Forgot Password</h2>
        <p className="text-gray-600 mb-6 text-sm text-center">
          Enter your email address to receive a password reset link.
        </p>

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="text-gray-600 mb-2 block">
                Email address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                placeholder="youremail@domain.com"
                required
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`block w-full py-2 text-center text-white border rounded uppercase font-medium transition ${
                isSubmitting
                  ? "bg-gray-400 border-gray-400 cursor-not-allowed"
                  : "bg-primary border-primary hover:bg-transparent hover:text-primary"
              }`}
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>
          </div>
        </form>

        {submitStatus === "success" && (
          <p className="text-green-600 text-center mt-4">
            A password reset link has been sent to your email.
          </p>
        )}
        {submitStatus === "error" && (
          <p className="text-red-600 text-center mt-4">
            Failed to send reset link. Please try again.
          </p>
        )}

        <p className="mt-4 text-center text-gray-600 text-sm">
          Remember your password?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Login now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;