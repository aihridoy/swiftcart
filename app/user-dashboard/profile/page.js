import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { FaUser, FaShoppingCart, FaHeart, FaBox } from "react-icons/fa";
import { session } from "@/actions/auth-utils";
import { getUserForViewer } from "@/lib/get-user";

export default async function UserProfile() {
  const userSession = await session();
  if (!userSession?.user) {
    redirect("/login");
  }

  const result = await getUserForViewer(userSession.user.id);
  if (result.status === "unauthorized") {
    redirect("/login");
  }
  if (result.status === "notfound") {
    notFound();
  }

  const user = result.user;
  const hasProfileImage = !!user.image;

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6 mb-12 sm:mb-0">
      <div className="container bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-primary p-4 sm:p-8 text-white">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative w-20 h-20 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white">
              {hasProfileImage ? (
                <Image
                  src={user.image}
                  alt={user.name || "Profile picture"}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-200">
                  <FaUser size={40} className="text-gray-400 sm:text-50" />
                </div>
              )}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold">
                {user.name || "User"}
              </h1>
              <p className="text-base sm:text-lg text-blue-100">
                {user.email || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Account Details
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-lg">
                    {user.name || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-lg break-all">
                    {user.email || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="font-medium text-gray-600 text-md">
                    {user._id || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Type</p>
                  <p className="font-medium text-md">
                    {hasProfileImage ? "Google Account" : "Email & Password"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Your Shopping
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <Link href="/user-dashboard/wishlist" className="group">
              <div className="bg-white border border-gray-200 hover:border-primary/50 hover:shadow-md rounded-lg p-6 flex flex-col items-center justify-center transition-all duration-200 h-48">
                <div className="p-3 bg-pink-50 rounded-full mb-4 group-hover:bg-pink-100 transition-colors duration-200">
                  <FaHeart size={30} className="text-pink-500" />
                </div>
                <h3 className="font-medium text-xl text-gray-800 group-hover:text-primary">
                  My Wishlist
                </h3>
                <p className="text-md text-gray-500 text-center">
                  Items you saved for later
                </p>
              </div>
            </Link>

            <Link href="/user-dashboard/cart" className="group">
              <div className="bg-white border border-gray-200 hover:border-primary/50 hover:shadow-md rounded-lg p-6 flex flex-col items-center justify-center transition-all duration-200 h-48">
                <div className="p-3 bg-blue-50 rounded-full mb-4 group-hover:bg-blue-100 transition-colors duration-200">
                  <FaShoppingCart size={30} className="text-blue-500" />
                </div>
                <h3 className="font-medium text-xl text-gray-800 group-hover:text-primary">
                  Shopping Cart
                </h3>
                <p className="text-md text-gray-500 text-center">
                  Items ready for checkout
                </p>
              </div>
            </Link>

            <Link href="/user-dashboard/orders" className="group">
              <div className="bg-white border border-gray-200 hover:border-primary/50 hover:shadow-md rounded-lg p-6 flex flex-col items-center justify-center transition-all duration-200 h-48">
                <div className="p-3 bg-green-50 rounded-full mb-4 group-hover:bg-green-100 transition-colors duration-200">
                  <FaBox size={30} className="text-green-500" />
                </div>
                <h3 className="font-medium text-xl text-gray-800 group-hover:text-primary">
                  Order History
                </h3>
                <p className="text-md text-gray-500 text-center">
                  Track your orders
                </p>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-gray-50 p-8 border-t border-gray-200">
          <div className="flex justify-between items-center flex-col md:flex-row gap-4">
            <p className="text-md text-gray-500">
              Account Created:{" "}
              {user.createdAt
                ? new Date(user.createdAt).toLocaleString()
                : "N/A"}
            </p>
            <Link
              href="/api/auth/signout"
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 text-md font-medium transition-colors duration-200"
            >
              Sign Out
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
