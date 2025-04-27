"use client";

import { useState } from "react";
import Link from "next/link";
import { HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi";
import ActiveLink from "./ActiveLink";

const MobileMenu = ({ navLinks, isLoggedIn }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="md:hidden flex items-center">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="text-white focus:outline-none"
      >
        {menuOpen ? <HiOutlineX size={28} /> : <HiOutlineMenuAlt3 size={28} />}
      </button>

      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-gray-800 flex flex-col items-center space-y-6 py-6 z-50">
          {navLinks.map((link) => (
            <ActiveLink
              key={link.path}
              href={link.path}
              className="text-white text-lg"
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </ActiveLink>
          ))}
          {!isLoggedIn && (
            <ActiveLink
              href="/login"
              className="text-white text-lg"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </ActiveLink>
          )}
        </div>
      )}
    </div>
  );
};

export default MobileMenu;