/* eslint-disable react/no-unescaped-entities */
"use client";

import Link from "next/link";
import { signIn } from 'next-auth/react';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { registerUser } from "@/actions/register";

const RegisterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreement: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setIsSubmitting(false);
      return;
    }

    if (!formData.agreement) {
      toast.error("You must agree to the terms and conditions", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "user"
      });

      if (result.success) {
        toast.success("Registration successful! Redirecting to login...", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          agreement: false,
        });
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        toast.error(result.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Unexpected error during registration:", error);
      toast.error("An unexpected error occurred. Please try again.", {
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

  const handleGoogleSignIn = async () => {
    try {
      const result = await signIn("google", { redirect: false, callbackUrl: "/" });
      if (result?.error) {
        toast.error(`Google sign-in failed: ${result.error}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.success("Google sign-in successful! Redirecting...", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      toast.error("Failed to sign in with Google. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-16 bg-gray-100">
      <div className="max-w-lg w-full mx-auto shadow px-6 py-7 rounded overflow-hidden bg-white">
        <h2 className="text-2xl uppercase font-medium mb-1">Create an account</h2>
        <p className="text-gray-600 mb-6 text-sm">Register as a new customer</p>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="text-gray-600 mb-2 block">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                placeholder="Ashraful Islam"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="text-gray-600 mb-2 block">
                Email address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                placeholder="youremail@domain.com"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="text-gray-600 mb-2 block">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                placeholder="*******"
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="text-gray-600 mb-2 block">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                placeholder="*******"
                required
              />
            </div>
          </div>
          <div className="mt-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="agreement"
                id="agreement"
                checked={formData.agreement}
                onChange={handleChange}
                className="text-primary focus:ring-0 rounded-sm cursor-pointer"
              />
              <label htmlFor="agreement" className="text-gray-600 ml-3 cursor-pointer">
                I have read and agree to the{" "}
                <Link href="terms-conditions" className="text-primary">
                  terms & conditions
                </Link>
              </label>
            </div>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`block w-full py-2 text-center text-white border rounded uppercase font-medium transition ${
                isSubmitting
                  ? "bg-gray-400 border-gray-400 cursor-not-allowed"
                  : "bg-primary border-primary hover:bg-transparent hover:text-primary"
              }`}
            >
              {isSubmitting ? "Registering..." : "Create Account"}
            </button>
          </div>
          {submitStatus === "success" && (
            <p className="text-green-600 text-center mt-4">
              Registration successful! Redirecting to login...
            </p>
          )}
          {submitStatus === "error" && (
            <p className="text-red-600 text-center mt-4">
              Registration failed. Please try again.
            </p>
          )}
        </form>

        <div className="mt-6 flex justify-center relative">
          <div className="text-gray-600 uppercase px-3 bg-white z-10 relative">
            Or sign up with
          </div>
          <div className="absolute left-0 top-3 w-full border-b-2 border-gray-200"></div>
        </div>
        <div className="mt-4 flex gap-4">
          {/* <a
            href="#"
            className="w-1/2 py-2 text-center text-white bg-blue-800 rounded uppercase font-medium text-sm hover:bg-blue-700"
          >
            Facebook
          </a> */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full py-3 text-center text-white bg-red-600 rounded uppercase font-medium text-sm hover:bg-red-500"
          >
            Google
          </button>
        </div>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-primary">
            Login now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;