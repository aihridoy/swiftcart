import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
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
        <p className="text-8xl font-bold text-red-600">404</p>
        <h1 className="mt-2 text-2xl font-semibold text-gray-900">
          Page not found
        </h1>
        <p className="mt-2 text-gray-600">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
      </div>
      <Link
        href="/"
        className="rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition hover:bg-red-700"
      >
        Back to home
      </Link>
    </div>
  );
}
