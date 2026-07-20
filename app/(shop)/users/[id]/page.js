import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { FaUser } from "react-icons/fa";
import { getUserForViewer } from "@/lib/get-user";

export default async function UserProfile({ params }) {
  const { id } = params;
  const result = await getUserForViewer(id);

  if (result.status === "unauthorized") {
    redirect("/login");
  }
  if (result.status === "notfound") {
    notFound();
  }

  const user = result.user;
  const hasProfileImage = !!user.image;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
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
                  <p className="font-medium">{user.email || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="font-medium text-gray-600 text-sm">{user._id || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Type</p>
                  <p className="font-medium">{hasProfileImage ? "Google Account" : "Email & Password"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Account Created: {user.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A"}
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
