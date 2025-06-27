"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FaUser, FaShoppingCart, FaHeart, FaBox } from "react-icons/fa";
import { getUserById } from "@/actions/user-utils";

const SkeletonProfile = () => (
  <div className="w-full p-6 animate-pulse">
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8">
        <div className="flex items-center space-x-8">
          <div className="w-32 h-32 rounded-full bg-gray-300 border-4 border-white"></div>
          <div className="space-y-3">
            <div className="h-8 w-64 bg-gray-300 rounded"></div>
            <div className="h-6 w-80 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
      <div className="p-8">
        <div className="mb-8">
          <div className="h-8 w-56 bg-gray-200 rounded mb-3"></div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div>
                <div className="h-5 w-24 bg-gray-200 rounded mb-2"></div>
                <div className="h-5 w-40 bg-gray-200 rounded"></div>
              </div>
              <div>
                <div className="h-5 w-24 bg-gray-200 rounded mb-2"></div>
                <div className="h-5 w-64 bg-gray-200 rounded"></div>
              </div>
              <div>
                <div className="h-5 w-24 bg-gray-200 rounded mb-2"></div>
                <div className="h-5 w-48 bg-gray-200 rounded"></div>
              </div>
              <div>
                <div className="h-5 w-24 bg-gray-200 rounded mb-2"></div>
                <div className="h-5 w-40 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-8 w-56 bg-gray-200 rounded mb-4"></div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {Array(4).fill().map((_, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 h-40 flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full mb-3"></div>
              <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-40 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-50 p-8 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="h-5 w-56 bg-gray-200 rounded"></div>
          <div className="h-10 w-24 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    </div>
  </div>
);

export default function UserProfile({ params }) {
  const id = params?.id;
  const router = useRouter();

  const { data, error, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!id,
  });

  useEffect(() => {
    if (error) {
      if (error.message.includes("User not found") || error.message.includes("Invalid user ID format")) {
        toast.error("User not found.", {
          position: "top-right",
          autoClose: 3000,
        });
        router.push("/404");
      } else if (error.message.includes("Unauthorized")) {
        toast.error("Please log in to view this profile.", {
          position: "top-right",
          autoClose: 3000,
        });
        router.push("/login");
      } else {
        toast.error(`Error loading profile: ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  }, [error, router]);

  const user = data?.user || {};

  const hasProfileImage = !!user.image;

  if (isLoading) {
    return <SkeletonProfile />;
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6">
      <div className="max-w-full mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-white">
          <div className="flex items-center space-x-8">
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white">
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
                  <FaUser size={50} className="text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{user.name || "User"}</h1>
              <p className="text-lg text-blue-100">{user.email || "Not provided"}</p>
            </div>
          </div>
        </div>
        
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Details</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-lg">{user.name || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-lg break-all">{user.email || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="font-medium text-gray-600 text-md">{user._id || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Type</p>
                  <p className="font-medium text-md">{hasProfileImage ? "Google Account" : "Email & Password"}</p>
                </div>
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Shopping</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <Link href="/wishlist" className="group">
              <div className="bg-white border border-gray-200 hover:border-blue-500 hover:shadow-md rounded-lg p-6 flex flex-col items-center justify-center transition-all duration-200 h-48">
                <div className="p-3 bg-pink-50 rounded-full mb-4 group-hover:bg-pink-100 transition-colors duration-200">
                  <FaHeart size={30} className="text-pink-500" />
                </div>
                <h3 className="font-medium text-xl text-gray-800 group-hover:text-blue-600">My Wishlist</h3>
                <p className="text-md text-gray-500 text-center">Items you saved for later</p>
              </div>
            </Link>
            
            <Link href="/cart" className="group">
              <div className="bg-white border border-gray-200 hover:border-blue-500 hover:shadow-md rounded-lg p-6 flex flex-col items-center justify-center transition-all duration-200 h-48">
                <div className="p-3 bg-blue-50 rounded-full mb-4 group-hover:bg-blue-100 transition-colors duration-200">
                  <FaShoppingCart size={30} className="text-blue-500" />
                </div>
                <h3 className="font-medium text-xl text-gray-800 group-hover:text-blue-600">Shopping Cart</h3>
                <p className="text-md text-gray-500 text-center">Items ready for checkout</p>
              </div>
            </Link>
            
            <Link href="/orders" className="group">
              <div className="bg-white border border-gray-200 hover:border-blue-500 hover:shadow-md rounded-lg p-6 flex flex-col items-center justify-center transition-all duration-200 h-48">
                <div className="p-3 bg-green-50 rounded-full mb-4 group-hover:bg-green-100 transition-colors duration-200">
                  <FaBox size={30} className="text-green-500" />
                </div>
                <h3 className="font-medium text-xl text-gray-800 group-hover:text-blue-600">Order History</h3>
                <p className="text-md text-gray-500 text-center">Track your orders</p>
              </div>
            </Link>
            
            {/* <Link href="/settings" className="group">
              <div className="bg-white border border-gray-200 hover:border-blue-500 hover:shadow-md rounded-lg p-6 flex flex-col items-center justify-center transition-all duration-200 h-48">
                <div className="p-3 bg-purple-50 rounded-full mb-4 group-hover:bg-purple-100 transition-colors duration-200">
                  <FaUser size={30} className="text-purple-500" />
                </div>
                <h3 className="font-medium text-xl text-gray-800 group-hover:text-blue-600">Account Settings</h3>
                <p className="text-md text-gray-500 text-center">Manage your profile</p>
              </div>
            </Link> */}
          </div>
        </div>
        
        <div className="bg-gray-50 p-8 border-t border-gray-200">
          <div className="flex justify-between items-center flex-col md:flex-row gap-4">
            <p className="text-md text-gray-500">
              Account Created: {user.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A"}
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