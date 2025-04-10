"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaSearch, FaHeart, FaShoppingBag, FaUser } from "react-icons/fa";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getWishlist } from "@/actions/wishlist";
import { getCart } from "@/actions/cart-utils";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const Header = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: session, status } = useSession();

  // Fetch wishlist
  const { data: wishlistData, error: wishlistError } = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
    enabled: !!session, // Only fetch if user is authenticated
    onError: (error) => {
      if (error.message.includes("Unauthorized")) {
        // Do nothing, handled by handleProtectedNavigation
      } else {
        toast.error(`Error fetching wishlist: ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    },
  });

  // Fetch cart
  const { data: cartData, error: cartError } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: !!session, // Only fetch if user is authenticated
    onError: (error) => {
      if (error.message.includes("Unauthorized")) {
        // Do nothing, handled by handleProtectedNavigation
      } else {
        toast.error(`Error fetching cart: ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    },
  });

  // Handle logout
  const handleLogout = async () => {
    await signOut({ redirect: false });
    queryClient.invalidateQueries(["wishlist"]);
    queryClient.invalidateQueries(["cart"]); // Invalidate cart on logout
    toast.success("Logged out successfully!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    router.push("/login");
  };

  // Wishlist count
  const wishlistCount = wishlistData?.wishlist?.length || 0;

  // Cart count
  const cartCount = cartData?.cart?.items?.length || 0;

  // Handle navigation for protected routes
  const handleProtectedNavigation = (href) => {
    if (!session) {
      const destination = href === "/wishlist" ? "wishlist" : href === "/cart" ? "cart" : "account";
      toast.error(`Please log in to access your ${destination}.`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      router.push("/login");
      return false;
    }
    return true;
  };

  return (
    <header className="py-4 shadow-sm bg-white">
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/images/logo.svg"
            alt="Logo"
            width={128}
            height={40}
            className="w-32"
          />
        </Link>

        {/* Search Bar */}
        <div className="w-full max-w-xl relative flex">
          <span className="absolute left-4 top-3 text-lg text-gray-400">
            <FaSearch />
          </span>
          <input
            type="text"
            name="search"
            id="search"
            className="w-full border border-primary border-r-0 pl-12 py-3 pr-3 rounded-l-md focus:outline-none"
            placeholder="Search"
          />
          <button className="bg-primary border border-primary text-white px-8 rounded-r-md hover:bg-transparent hover:text-primary transition">
            Search
          </button>
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-4">
          <NavItem
            href="/wishlist"
            icon={<FaHeart />}
            label="Wishlist"
            count={wishlistCount}
            onClick={() => handleProtectedNavigation("/wishlist")}
          />
          <NavItem
            href="/cart"
            icon={<FaShoppingBag />}
            label="Cart"
            count={cartCount} // Use dynamic cart count
            onClick={() => handleProtectedNavigation("/cart")} // Add navigation protection
          />
          <NavItem
            href={session ? "#" : "/login"}
            icon={<FaUser />}
            label={session ? "Logout" : "Account"}
            onClick={(e) => {
              if (session) {
                e.preventDefault();
                handleLogout();
              }
            }}
          />
        </div>
      </div>
    </header>
  );
};

const NavItem = ({ href, icon, label, count, onClick }) => (
  <Link
    href={href}
    onClick={(e) => {
      if (onClick && !onClick()) {
        e.preventDefault();
      }
    }}
    className="relative text-center text-gray-700 hover:text-primary transition"
  >
    <div className="text-2xl">{icon}</div>
    <div className="text-xs leading-3">{label}</div>
    {count !== undefined && count > 0 && (
      <div className="absolute right-0 -top-1 w-5 h-5 rounded-full flex items-center justify-center bg-primary text-white text-xs">
        {count}
      </div>
    )}
  </Link>
);

export default Header;