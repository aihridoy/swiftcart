"use client";
import { SessionProvider } from "next-auth/react";

export default function AuthLayout({ children }) {
  return (
    <SessionProvider>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-lg mx-auto">
          {children}
        </div>
      </div>
    </SessionProvider>
  );
}
