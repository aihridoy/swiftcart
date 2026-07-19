"use client";

// Every failed fetch in the app used to dead-end on a line of red text, so the
// only way forward was for the visitor to work out that a reload fixes it.
// ponytail: reload is the blunt version of refetch; pass onRetry where a
// component already has one to hand.
const LoadError = ({ message, onRetry }) => (
  <div className="flex flex-col items-center gap-4 py-8">
    <p className="text-red-600 text-lg text-center">{message}</p>
    <button
      type="button"
      onClick={() => (onRetry ? onRetry() : window.location.reload())}
      className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
    >
      Try again
    </button>
  </div>
);

export default LoadError;
