import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaBars } from "react-icons/fa";

const categories = [
  { name: "Sofa", icon: "/images/icons/sofa.svg" },
  { name: "Terrace", icon: "/images/icons/terrace.svg" },
  { name: "Bed", icon: "/images/icons/bed.svg" },
  { name: "Office", icon: "/images/icons/office.svg" },
  { name: "Outdoor", icon: "/images/icons/outdoor-cafe.svg" },
  { name: "Mattress", icon: "/images/icons/bed-2.svg" },
];

const DropdownItem = ({ name, icon }) => (
  <Link
    href="#"
    className="flex items-center px-6 py-3 hover:bg-gray-100 transition"
  >
    <Image
      src={icon}
      alt={name}
      width={20}
      height={20}
      className="object-contain"
    />
    <span className="ml-6 text-gray-600 text-sm">{name}</span>
  </Link>
);

const Navbar = () => {
  return (
    <nav className="bg-gray-800">
      <div className="container flex">
        {/* Categories Dropdown */}
        <div className="px-8 py-4 bg-primary md:flex items-center cursor-pointer relative group hidden">
          <span className="text-white">
            <FaBars size={20} />
          </span>
          <span className="capitalize ml-2 text-white hidden">
            All Categories
          </span>

          {/* Dropdown */}
          <div className="absolute w-64 left-0 top-full bg-white shadow-md py-3 divide-y divide-gray-300 divide-dashed hidden group-hover:block transition duration-300 z-10">
            {categories.map((item, index) => (
              <DropdownItem key={index} {...item} />
            ))}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center justify-between flex-grow md:pl-12 py-5">
          <div className="flex items-center space-x-6 capitalize">
            <Link
              href="/"
              className="text-gray-200 hover:text-white transition"
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="text-gray-200 hover:text-white transition"
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="text-gray-200 hover:text-white transition"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="text-gray-200 hover:text-white transition"
            >
              Contact Us
            </Link>
          </div>

          <Link
            href="/login"
            className="text-gray-200 hover:text-white transition"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
