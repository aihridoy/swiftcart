/* eslint-disable react/no-unescaped-entities */
"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { login } from "@/actions/auth-utils";

const LoginPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    try {
      const result = await login(formData);

      if (result) {
        toast.success("Login successful! Redirecting...", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 2000);
      } 
    } catch (error) {
      console.error("Unexpected error during login:", error);
      toast.error("An unexpected error occurred. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
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

  const handleFacebookSignIn = async () => {
    try {
      const result = await signIn("facebook", { redirect: false, callbackUrl: "/" });

      if (result?.error) {
        console.error("Facebook sign-in error:", result.error);
        toast.error(`Facebook sign-in failed: ${result.error}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.success("Facebook sign-in successful! Redirecting...", {
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
      console.error("Error during Facebook sign-in:", error);
      toast.error("Failed to sign in with Facebook. Please try again.", {
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg mx-auto shadow px-6 py-7 rounded bg-white">
        <h2 className="text-2xl uppercase font-medium mb-1 text-center">Login</h2>
        <p className="text-gray-600 mb-6 text-sm text-center">Welcome back, customer</p>

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
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                placeholder="*******"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="remember"
                id="remember"
                className="text-primary focus:ring-0 rounded-sm cursor-pointer"
              />
              <label htmlFor="remember" className="text-gray-600 ml-2 cursor-pointer">
                Remember me
              </label>
            </div>
            <Link href="/forgot-password" className="text-primary text-sm hover:underline">
              Forgot password?
            </Link>
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
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>

        <div className="mt-6 flex justify-center relative">
          <div className="text-gray-600 uppercase px-3 bg-white z-10 relative text-sm">
            Or login with
          </div>
          <div className="absolute left-0 top-3 w-full border-b-2 border-gray-200"></div>
        </div>

        <div className="mt-4 flex gap-4">
          {/* <button 
            onClick={handleFacebookSignIn}
            className="w-1/2 py-2 text-center text-white bg-blue-800 rounded uppercase font-medium text-sm hover:bg-blue-700"
          >
            Facebook
          </button> */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full py-3 text-center text-white bg-red-600 rounded uppercase font-medium text-sm hover:bg-red-500"
          >
            Google
          </button>
        </div>

        <p className="mt-4 text-center text-gray-600 text-sm">
          Don't have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;