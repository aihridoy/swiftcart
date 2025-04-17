import { session } from "@/actions/auth-utils";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaUser, FaShoppingCart, FaHeart, FaBox } from "react-icons/fa";

export default async function UserProfile() {
  const userSession = await session();
  
  // Redirect to login if no session exists
  if (!userSession || !userSession.user) {
    redirect("/login");
  }
  
  const { user } = userSession;
  const hasProfileImage = !!user.image;
  
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
          <div className="flex items-center space-x-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-white">
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
                  <FaUser size={40} className="text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.name || "User"}</h1>
              <p className="text-blue-100">{user.email}</p>
            </div>
          </div>
        </div>
        
        {/* Profile Content */}
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Account Details</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{user.name || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="font-medium text-gray-600 text-sm">{user.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Type</p>
                  <p className="font-medium">{hasProfileImage ? "Google Account" : "Email & Password"}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* User Navigation Links */}
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Your Shopping</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/wishlist" className="group">
              <div className="bg-white border border-gray-200 hover:border-blue-500 hover:shadow-md rounded-lg p-4 flex flex-col items-center justify-center transition-all duration-200 h-32">
                <div className="p-2 bg-pink-50 rounded-full mb-2 group-hover:bg-pink-100 transition-colors duration-200">
                  <FaHeart size={24} className="text-pink-500" />
                </div>
                <h3 className="font-medium text-gray-800 group-hover:text-blue-600">My Wishlist</h3>
                <p className="text-sm text-gray-500">Items you saved for later</p>
              </div>
            </Link>
            
            <Link href="/cart" className="group">
              <div className="bg-white border border-gray-200 hover:border-blue-500 hover:shadow-md rounded-lg p-4 flex flex-col items-center justify-center transition-all duration-200 h-32">
                <div className="p-2 bg-blue-50 rounded-full mb-2 group-hover:bg-blue-100 transition-colors duration-200">
                  <FaShoppingCart size={24} className="text-blue-500" />
                </div>
                <h3 className="font-medium text-gray-800 group-hover:text-blue-600">Shopping Cart</h3>
                <p className="text-sm text-gray-500">Items ready for checkout</p>
              </div>
            </Link>
            
            <Link href="/orders" className="group">
              <div className="bg-white border border-gray-200 hover:border-blue-500 hover:shadow-md rounded-lg p-4 flex flex-col items-center justify-center transition-all duration-200 h-32">
                <div className="p-2 bg-green-50 rounded-full mb-2 group-hover:bg-green-100 transition-colors duration-200">
                  <FaBox size={24} className="text-green-500" />
                </div>
                <h3 className="font-medium text-gray-800 group-hover:text-blue-600">Order History</h3>
                <p className="text-sm text-gray-500">Track your orders</p>
              </div>
            </Link>
          </div>
        </div>
        
        {/* Profile Footer */}
        <div className="bg-gray-50 p-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Session expires: {new Date(userSession.expires).toLocaleString()}
            </p>
            <Link 
              href="/api/auth/signout" 
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 text-sm font-medium transition-colors duration-200"
            >
              Sign Out
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}