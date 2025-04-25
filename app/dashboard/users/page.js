"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getUsers } from "@/actions/user-utils";
import { toast } from "react-toastify";
import { 
  FaUser, 
  FaUsers, 
  FaUserShield, 
  FaEnvelope, 
  FaCalendarAlt, 
  FaAngleLeft, 
  FaAngleRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaSpinner,
  FaSearch,
  FaFilter,
  FaCrown,
  FaUserCog,
  FaExclamationTriangle,
  FaInfoCircle
} from "react-icons/fa";

const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="p-4">
      <div className="flex items-center">
        <div className="h-8 w-8 bg-gray-200 rounded-full mr-3"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    </td>
    <td className="p-4">
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </td>
    <td className="p-4">
      <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
    </td>
    <td className="p-4">
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
    </td>
    <td className="p-4">
      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
    </td>
  </tr>
);

const SkeletonSummaryCards = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 animate-pulse">
    {Array(3).fill().map((_, index) => (
      <div key={index} className="bg-white p-4 rounded-lg shadow-md flex items-center">
        <div className="bg-gray-200 p-3 rounded-full mr-4 w-12 h-12"></div>
        <div>
          <div className="h-4 w-20 bg-gray-200 rounded mb-1"></div>
          <div className="h-6 w-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    ))}
  </div>
);

const UserList = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const limit = 10;

  // Fetch users with React Query
  const { data, error, isLoading } = useQuery({
    queryKey: ["users", currentPage],
    queryFn: () => getUsers({ page: currentPage, limit }),
    onError: (error) => {
      if (error.message.includes("Unauthorized")) {
        toast.error("Please log in to view users.", {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        toast.error(`Error loading users: ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    },
  });

  const users = data?.users || [];
  const pagination = data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    limit,
  };

  // Filter users based on search term and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  // Get user counts by role
  const adminCount = users.filter(user => user.role === "admin").length;
  const regularUserCount = users.filter(user => user.role === "user").length;

  // Pagination controls
  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Generate page numbers for pagination
  const pageNumbers = [];
  const maxPagesToShow = 5;
  const startPage = Math.max(
    1,
    pagination.currentPage - Math.floor(maxPagesToShow / 2)
  );
  const endPage = Math.min(
    pagination.totalPages,
    startPage + maxPagesToShow - 1
  );

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // Get user role icon
  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <FaUserShield className="text-green-600" />;
      case "user":
        return <FaUser className="text-blue-600" />;
      default:
        return <FaUser className="text-gray-600" />;
    }
  };

  // Get initials for avatar placeholder
  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  };

  // Get random background color based on user ID
  const getAvatarColor = (userId) => {
    const colors = [
      "bg-blue-200 text-blue-800",
      "bg-green-200 text-green-800",
      "bg-purple-200 text-purple-800",
      "bg-yellow-200 text-yellow-800",
      "bg-pink-200 text-pink-800",
      "bg-indigo-200 text-indigo-800",
      "bg-red-200 text-red-800",
      "bg-teal-200 text-teal-800"
    ];
    
    // Use the last character of the ID to pick a color
    const lastChar = userId ? userId.toString().slice(-1) : "0";
    const colorIndex = parseInt(lastChar, 16) % colors.length;
    return colors[colorIndex];
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            <FaUsers className="mr-2 text-blue-600" />
            Users
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 bg-gray-200"></div>
            </div>
            <div className="relative">
              <div className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-32 bg-gray-200"></div>
            </div>
          </div>
        </div>
        <SkeletonSummaryCards />
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  <div className="flex items-center">
                    <FaUser className="mr-1 text-gray-500" />
                    Name
                  </div>
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  <div className="flex items-center">
                    <FaEnvelope className="mr-1 text-gray-500" />
                    Email
                  </div>
                </th>
                <th className="p-4 text-center text-sm font-semibold text-gray-600">
                  <div className="flex items-center justify-center">
                    <FaUserCog className="mr-1 text-gray-500" />
                    Role
                  </div>
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-1 text-gray-500" />
                    Created At
                  </div>
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array(5).fill().map((_, index) => (
                <SkeletonRow key={index} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-16 flex justify-center">
        <div className="bg-red-50 p-6 rounded-lg shadow-md flex items-center">
          <FaExclamationTriangle className="text-red-600 text-xl mr-2" />
          <p className="text-red-600">Failed to load users. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <FaUsers className="mr-2 text-blue-600" />
          Users
        </h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute right-3 top-3 text-gray-400" />
          </div>
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            <FaFilter className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <FaUsers className="text-blue-600 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-xl font-bold">{pagination.totalUsers}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <FaUserShield className="text-green-600 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Admins</p>
            <p className="text-xl font-bold">{adminCount}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <FaUser className="text-blue-600 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Regular Users</p>
            <p className="text-xl font-bold">{regularUserCount}</p>
          </div>
        </div>
      </div>
      
      {users.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center py-12">
          <FaUsers className="text-gray-400 text-5xl mb-4" />
          <p className="text-gray-600 text-lg">No users found.</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center py-12">
          <FaSearch className="text-gray-400 text-5xl mb-4" />
          <p className="text-gray-600 text-lg">No users match your search criteria.</p>
          <button 
            onClick={() => {
              setSearchTerm("");
              setRoleFilter("all");
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          {/* User Table */}
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">
                    <div className="flex items-center">
                      <FaUser className="mr-1 text-gray-500" />
                      Name
                    </div>
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">
                    <div className="flex items-center">
                      <FaEnvelope className="mr-1 text-gray-500" />
                      Email
                    </div>
                  </th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-600">
                    <div className="flex items-center justify-center">
                      <FaUserCog className="mr-1 text-gray-500" />
                      Role
                    </div>
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-1 text-gray-500" />
                      Created At
                    </div>
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr
                    key={user._id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-blue-50 transition-colors duration-200`}
                  >
                    <td className="p-4 text-gray-800">
                      <div className="flex items-center">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${getAvatarColor(user._id)}`}>
                          {getInitials(user.name)}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          {user.role === "admin" && (
                            <span className="flex items-center text-xs text-gray-500">
                              <FaCrown className="text-yellow-500 mr-1" />
                              Admin user
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-800">
                      <div className="flex items-center">
                        <FaEnvelope className="text-gray-400 mr-2" />
                        {user.email}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                          user.role === "admin"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {getRoleIcon(user.role)}
                        <span className="ml-1">{user.role}</span>
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-2 text-gray-400" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(user.createdAt).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => router.push(`/users/${user._id}`)}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition-colors flex items-center"
                        >
                          <FaInfoCircle className="mr-1" />
                          View
                        </button>
                        {/* {user.role !== "admin" && (
                          <button 
                            onClick={() => router.push(`/users/${user._id}/edit`)}
                            className="bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 transition-colors flex items-center"
                          >
                            <FaUserCog className="mr-1" />
                            Edit
                          </button>
                        )} */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="mt-6 flex justify-center items-center space-x-2">
              {/* First Page Button */}
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                } transition-colors duration-200 flex items-center`}
              >
                <FaAngleDoubleLeft className="text-xs" />
              </button>

              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                } transition-colors duration-200 flex items-center`}
              >
                <FaAngleLeft />
                <span className="ml-1">Prev</span>
              </button>

              {/* Page Numbers */}
              {startPage > 1 && (
                <>
                  <button
                    onClick={() => handlePageChange(1)}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 border border-gray-300"
                  >
                    1
                  </button>
                  {startPage > 2 && (
                    <span className="px-4 py-2 text-sm text-gray-500">...</span>
                  )}
                </>
              )}

              {pageNumbers.map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    currentPage === page
                      ? "bg-blue-600 text-white border border-blue-600"
                      : "text-gray-700 hover:bg-gray-100 border border-gray-300"
                  } transition-colors duration-200`}
                >
                  {page}
                </button>
              ))}

              {endPage < pagination.totalPages && (
                <>
                  {endPage < pagination.totalPages - 1 && (
                    <span className="px-4 py-2 text-sm text-gray-500">...</span>
                  )}
                  <button
                    onClick={() => handlePageChange(pagination.totalPages)}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 border border-gray-300"
                  >
                    {pagination.totalPages}
                  </button>
                </>
              )}

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  currentPage === pagination.totalPages
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                } transition-colors duration-200 flex items-center`}
              >
                <span className="mr-1">Next</span>
                <FaAngleRight />
              </button>

              {/* Last Page Button */}
              <button
                onClick={() => handlePageChange(pagination.totalPages)}
                disabled={currentPage === pagination.totalPages}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  currentPage === pagination.totalPages
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                } transition-colors duration-200 flex items-center`}
              >
                <FaAngleDoubleRight className="text-xs" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserList;