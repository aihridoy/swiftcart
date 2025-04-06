import ResetPasswordPage from "@/components/ResetPassword";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="text-gray-600 text-lg">Loading...</div>
        </div>
      }
    >
      <ResetPasswordPage />
    </Suspense>
  );
};

export default page;

export const dynamic = "force-dynamic";
