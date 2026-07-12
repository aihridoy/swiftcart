"use client";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full bg-red-500/20 blur-xl animate-pulse" />
        <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-red-600 border-r-red-600 animate-spin" />
        <div className="absolute inset-2 rounded-full border-[3px] border-transparent border-b-red-400 animate-spin-slow" />
      </div>

      <div className="flex gap-1.5">
        <span className="h-2 w-2 rounded-full bg-red-600 animate-bounce [animation-delay:-0.3s]" />
        <span className="h-2 w-2 rounded-full bg-red-600 animate-bounce [animation-delay:-0.15s]" />
        <span className="h-2 w-2 rounded-full bg-red-600 animate-bounce" />
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          to {
            transform: rotate(-360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 1.4s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-spin,
          .animate-spin-slow,
          .animate-bounce,
          .animate-pulse {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
