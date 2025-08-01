import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaBars } from "react-icons/fa";
import { session } from "@/actions/auth-utils";
import SignOut from "./SignOut";
import ActiveLink from "./ActiveLink";
import api from "@/lib/axios";
import MobileMenu from "./MobileMenu";

const DropdownItem = ({ name, slug, image }) => (
  <Link
    href={`/category/${slug}`}
    className="flex items-center px-6 py-3 hover:bg-gray-100 transition"
  >
    <Image
      src={image}
      alt={name}
      width={20}
      height={20}
      className="object-contain"
    />
    <span className="ml-6 text-gray-600 text-sm">{name}</span>
  </Link>
);

const Navbar = async () => {
  const userSession = await session();
  const productsData = await api
    .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching products:", error);
      return null;
    });

  const categoryMap = productsData?.products?.reduce((acc, product) => {
    const category = product.category;
    if (!acc[category]) {
      acc[category] = {
        name: category
          .split(" ")
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" "),
        slug: category.toLowerCase(),
        image: product.mainImage,
      };
    }
    return acc;
  }, {});

  const categories = categoryMap ? Object.values(categoryMap) : [];

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/products" },
    { name: "About Us", path: "/about-us" },
    { name: "Contact Us", path: "/contact" },
  ];

  if (userSession?.user?.role === "admin") {
    navLinks.push({ name: "Dashboard", path: "/dashboard" });
  }

  if (userSession?.user && userSession?.user?.role !== "admin") {
    navLinks.push({ name: "My Dashboard", path: "/user-dashboard" });
  }

  return (
    <nav className="bg-gray-800 relative">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        
        {/* Left side: Categories for desktop only */}
        <div className="hidden md:flex items-center relative group">
          <div className="flex items-center px-4 py-2 bg-primary text-white cursor-pointer">
            <FaBars size={20} />
            <span className="ml-2 hidden lg:block">Categories</span>
          </div>
          <div className="absolute w-64 left-0 top-full bg-white shadow-md py-3 divide-y divide-gray-300 divide-dashed hidden group-hover:block transition duration-300 z-10">
            {categories.map((item, index) => (
              <DropdownItem key={index} {...item} />
            ))}
          </div>
        </div>

        {/* Center Nav Links for desktop */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <ActiveLink key={link.path} href={link.path}>
              {link.name}
            </ActiveLink>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {userSession?.user ? (
            <div className="flex items-center space-x-2">
              {userSession.user.image ? (
                <Image
                  src={userSession.user.image}
                  alt={userSession.user.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <span className="text-gray-200 text-sm">
                  Welcome, {userSession.user.name}!
                </span>
              )}
              <SignOut />
            </div>
          ) : (
            <div className="hidden md:block">
              <ActiveLink href="/login">Login</ActiveLink>
            </div>
          )}
          
          {/* Mobile Hamburger Menu */}
          <MobileMenu navLinks={navLinks} isLoggedIn={!!userSession?.user} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;