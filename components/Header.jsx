"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaSearch, FaHeart, FaShoppingBag, FaUser, FaBox, FaBars, FaTimes } from "react-icons/fa";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getWishlist } from "@/actions/wishlist";
import { getCart } from "@/actions/cart-utils";
import { getOrders } from "@/actions/order-utils";
import { searchProducts } from "@/actions/products";
import { useRouter } from "next/navigation";
import { session } from "@/actions/auth-utils";

const Header = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Debounce search term
  const debounce = useCallback((func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  }, []);

  useEffect(() => {
    const fetchUserSession = async () => {
      const sessionData = await session();
      if (!sessionData) {
        setUser(null);
        return;
      }
      setUser(sessionData);
    };

    fetchUserSession();
  }, []);

  useEffect(() => {
    const debouncedSetSearchTerm = debounce((value) => {
      setDebouncedSearchTerm(value);
      setIsDropdownOpen(value.length > 0);
    }, 500);
    debouncedSetSearchTerm(searchTerm);
  }, [searchTerm, debounce]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // Trigger animation after 50px scroll
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch search results
  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ["search", debouncedSearchTerm],
    queryFn: () => searchProducts(debouncedSearchTerm),
    enabled: !!debouncedSearchTerm,
    onError: (error) => {
      toast.error(`Error searching products: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    },
  });

  // Fetch wishlist
  const { data: wishlistData, error: wishlistError } = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
    enabled: !!user,
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
    enabled: !!user,
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

  // Fetch orders
  const { data: ordersData, error: ordersError } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    enabled: !!user,
    onError: (error) => {
      if (error.message.includes("Unauthorized")) {
        // Do nothing, handled by handleProtectedNavigation
      } else {
        toast.error(`Error fetching orders: ${error.message}`, {
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

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
      setIsDropdownOpen(false);
      queryClient.removeQueries({ queryKey: ["search"], exact: false });
    }
  };

  // Handle clicking a search result
  const handleResultClick = (productId) => {
    router.push(`/products/${productId}`);
    setSearchTerm("");
    setIsDropdownOpen(false);
    queryClient.removeQueries({ queryKey: ["search"], exact: false });
  };

  // Handle dropdown close
  const handleDropdownClose = () => {
    setTimeout(() => {
      setIsDropdownOpen(false);
      queryClient.removeQueries({ queryKey: ["search"], exact: false });
    }, 200);
  };

  // Wishlist count
  const wishlistCount = user && wishlistData?.wishlist?.length || 0;

  // Cart count
  const cartCount = user && cartData?.cart?.items?.length || 0;

  // Orders count
  const ordersCount = user && ordersData?.orders?.length || 0;

  // Handle navigation for protected routes
  const handleProtectedNavigation = (href) => {
    if (!user) {
      const destination = href === "/wishlist" ? "wishlist" : href === "/cart" ? "cart" : href === "/orders" ? "orders" : "account";
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

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
        isScrolled ? "py-2 shadow-lg" : "py-4 shadow-sm"
      }`}
    >
      <div className="container">
        {/* Mobile Layout */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          {/* Logo and Hamburger (Mobile) */}
          <div className="flex items-center justify-between sm:justify-start">
            <Link href="/">
              <Image
                src="/images/swiftcart-logo.svg"
                alt="Logo"
                width={128}
                height={40}
                className={`w-32 h-auto transition-all duration-300 ${
                  isScrolled ? "w-28" : "w-32"
                }`}
              />
            </Link>
            <button
              className="sm:hidden text-2xl text-gray-700 focus:outline-none"
              onClick={toggleMenu}
              aria-label={isScrolled ? "Close Menu" : "Open Menu"}
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {/* Search Bar */}
          <div className="w-full sm:max-w-xl relative">
            <form onSubmit={handleSearchSubmit} className="flex">
              <span className="absolute left-3 sm:left-4 top-2 sm:top-2.5 text-base sm:text-lg text-gray-400">
                <FaSearch />
              </span>
              <input
                type="text"
                name="search"
                id="search"
                className={`w-full border border-primary border-r-0 pl-12 md:pl-10 py-1.5 sm:py-2 pr-3 rounded-l-md focus:outline-none text-sm sm:text-base transition-all duration-300 ${
                  isScrolled ? "py-1 text-sm" : "py-1.5 sm:py-2 text-sm sm:text-base"
                }`}
                placeholder="Search Product"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => debouncedSearchTerm && setIsDropdownOpen(true)}
                onBlur={handleDropdownClose}
              />
              <button
                type="submit"
                className={`bg-primary border border-primary text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-r-md hover:bg-transparent hover:text-primary transition text-sm sm:text-base ${
                  isScrolled ? "px-3 sm:px-5 py-1" : "px-4 sm:px-6 py-1.5 sm:py-2"
                }`}
              >
                Search
              </button>
            </form>

            {/* Search Results Dropdown */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto z-10">
                {searchLoading ? (
                  <div className="p-2 sm:p-4 text-gray-500 text-sm">Loading...</div>
                ) : searchResults?.products?.length > 0 ? (
                  searchResults.products.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => handleResultClick(product._id)}
                      className="p-2 sm:p-4 hover:bg-gray-100 cursor-pointer flex items-center space-x-2 sm:space-x-4"
                    >
                      {product.mainImage && (
                        <Image
                          src={product.mainImage}
                          alt={product.title}
                          width={32}
                          height={32}
                          className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium text-xs sm:text-sm truncate">{product.title}</p>
                        <p className="text-gray-500 text-[10px] sm:text-xs">
                          {product.brand} - {product.category}
                        </p>
                        <p className="text-primary font-medium text-xs sm:text-sm">${product.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-2 sm:p-4 text-gray-500 text-sm">No products found</div>
                )}
              </div>
            )}
          </div>

          {/* Icons (Desktop) / Mobile Menu */}
          <div
            className={`${
              isMenuOpen ? "flex" : "hidden"
            } sm:flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-2 sm:space-x-4 mt-4 sm:mt-0 bg-white sm:bg-transparent p-4 sm:p-0 rounded-lg sm:rounded-none shadow-sm sm:shadow-none`}
          >
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
              count={cartCount}
              onClick={() => handleProtectedNavigation("/cart")}
            />
            <NavItem
              href="/orders"
              icon={<FaBox />}
              label="Orders"
              count={ordersCount}
              onClick={() => handleProtectedNavigation("/orders")}
            />
            <NavItem
              href={`/profile/${user?.user?.id}`}
              icon={<FaUser />}
              label="Account"
              onClick={() => handleProtectedNavigation("/profile")}
            />
          </div>
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
    className="relative flex sm:block items-center sm:text-center text-gray-700 hover:text-primary transition w-full sm:w-auto"
  >
    <div className="text-2xl sm:text-2xl mr-2 sm:mr-0">{icon}</div>
    <div className="text-xs sm:text-xs leading-3 hidden sm:block">{label}</div>
    <div className="text-xs sm:text-xs leading-3 sm:hidden">{label}</div>
    {count !== undefined && count > 0 && (
      <div className="absolute right-0 sm:right-0 -top-2 sm:-top-1 w-5 h-5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center bg-primary text-white text-[10px] sm:text-xs">
        {count}
      </div>
    )}
  </Link>
);

export default Header;