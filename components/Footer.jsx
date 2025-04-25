"use client";

import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaTwitter, FaPinterest } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-beige-100 pt-16 pb-12 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link href="/">
              <Image
                src="/images/swiftcart-logo.svg"
                alt="SwiftCart Logo"
                width={120}
                height={40}
                className="w-40 h-auto"
                priority
              />
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
              Transform your space with our curated collection of home and decor essentials. At SwiftCart, we create homes that inspire comfort and style.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit SwiftCart on Facebook"
                className="text-gray-500 hover:text-blue-600 transition-colors duration-300"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit SwiftCart on Instagram"
                className="text-gray-500 hover:text-pink-600 transition-colors duration-300"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit SwiftCart on Twitter"
                className="text-gray-500 hover:text-blue-400 transition-colors duration-300"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit SwiftCart on Pinterest"
                className="text-gray-500 hover:text-red-600 transition-colors duration-300"
              >
                <FaPinterest size={24} />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
              Shop
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/products/furniture"
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  Furniture
                </Link>
              </li>
              <li>
                <Link
                  href="/products/decor"
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  Decor
                </Link>
              </li>
              <li>
                <Link
                  href="/products/lighting"
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  Lighting
                </Link>
              </li>
              <li>
                <Link
                  href="/products/textiles"
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  Textiles
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/support/faqs"
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/support/shipping"
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/support/contact"
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/support/track-order"
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} SwiftCart. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;