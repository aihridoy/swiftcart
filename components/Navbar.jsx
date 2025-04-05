import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaBars } from "react-icons/fa";
import { session } from "@/actions/auth-utils";
import SignOut from "./SignOut";
import ActiveLink from "./ActiveLink";

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

const Navbar = async () => {
  const userSession = await session();
    
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/products" },
    { name: "About Us", path: "/about-us" },
    { name: "Contact Us", path: "/contact" }
  ];

  return (
    <nav className="bg-gray-800">
      <div className="container flex">
        <div className="px-8 py-4 bg-primary md:flex items-center cursor-pointer relative group hidden">
          <span className="text-white">
            <FaBars size={20} />
          </span>
          <span className="capitalize ml-2 text-white hidden">
            All Categories
          </span>
          <div className="absolute w-64 left-0 top-full bg-white shadow-md py-3 divide-y divide-gray-300 divide-dashed hidden group-hover:block transition duration-300 z-10">
            {categories.map((item, index) => (
              <DropdownItem key={index} {...item} />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between flex-grow md:pl-12 py-5">
          <div className="flex items-center space-x-6 capitalize">
            {navLinks.map((link) => (
              <ActiveLink key={link.path} href={link.path}>
                {link.name}
              </ActiveLink>
            ))}
          </div>
          {userSession?.user ? (
            <div className="flex items-center space-x-4">
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
                  <span className="text-gray-200">
                    Welcome, {userSession.user.name}!
                  </span>
                )}
              </div>
              <SignOut />
            </div>
          ) : (
            <ActiveLink href="/login">
              Login
            </ActiveLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;