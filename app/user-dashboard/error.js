"use client";

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 min-h-[50vh] flex-col items-center justify-center gap-6 px-4 py-20 text-center">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Something went wrong
        </h1>
        <p className="mt-2 text-gray-600">
          An unexpected error occurred loading this page.
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
          href="/user-dashboard"
          className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Back to dashboard
        </a>
      </div>
    </div>
  );
}
