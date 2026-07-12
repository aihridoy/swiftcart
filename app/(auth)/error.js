"use client";

import { useEffect } from "react";
import Image from "next/image";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <Image
        src="/images/swiftcart-logo.svg"
        alt="SwiftCart"
        width={160}
        height={40}
        priority
      />
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Something went wrong
        </h1>
        <p className="mt-2 text-gray-600">
          An unexpected error occurred. You can try again or head back home.
        </p>
      </div>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition hover:bg-red-700"
        >
          Try again
        </button>
        <a
          href="/"
          className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Back to home
        </a>
      </div>
    </div>
  );
}
