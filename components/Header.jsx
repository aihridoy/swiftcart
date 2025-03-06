import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaSearch, FaHeart, FaShoppingBag, FaUser } from "react-icons/fa";

const Header = () => {
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
          <NavItem href="#" icon={<FaHeart />} label="Wishlist" count={8} />
          <NavItem href="#" icon={<FaShoppingBag />} label="Cart" count={2} />
          <NavItem href="#" icon={<FaUser />} label="Account" />
        </div>
      </div>
    </header>
  );
};

const NavItem = ({ href, icon, label, count }) => (
  <Link href={href} className="relative text-center text-gray-700 hover:text-primary transition">
    <div className="text-2xl">{icon}</div>
    <div className="text-xs leading-3">{label}</div>
    {count !== undefined && (
      <div className="absolute right-0 -top-1 w-5 h-5 rounded-full flex items-center justify-center bg-primary text-white text-xs">
        {count}
      </div>
    )}
  </Link>
);

export default Header;
