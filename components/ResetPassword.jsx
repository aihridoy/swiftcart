"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { resetPassword } from "@/actions/password-utils";

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing token. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      router.push("/forgot-password");
    }
  }, [token, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match. Please try again.", {
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
      const result = await resetPassword(token, newPassword);
      if (result.success) {
        toast.success("Password reset successful! Redirecting to login...", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setSubmitStatus("success");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        throw new Error(result.error || "Failed to reset password");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error(
        error.message === "Invalid or expired token"
          ? "Invalid or expired token. Please request a new reset link."
          : "Failed to reset password. Please try again.",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg mx-auto shadow px-6 py-7 rounded bg-white">
        <h2 className="text-2xl uppercase font-medium mb-1 text-center">
          Reset Password
        </h2>
        <p className="text-gray-600 mb-6 text-sm text-center">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="text-gray-600 mb-2 block">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                placeholder="*******"
                required
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="text-gray-600 mb-2 block"
              >
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                placeholder="*******"
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
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </form>

        {submitStatus === "success" && (
          <p className="text-green-600 text-center mt-4">
            Password reset successful! Redirecting to login...
          </p>
        )}
        {submitStatus === "error" && (
          <p className="text-red-600 text-center mt-4">
            Failed to reset password. Please try again.
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

export default ResetPasswordPage;
