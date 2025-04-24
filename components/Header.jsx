"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaSearch, FaHeart, FaShoppingBag, FaUser, FaBox } from "react-icons/fa"; 
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
  }
  , []);

  useEffect(() => {
    const debouncedSetSearchTerm = debounce((value) => {
      setDebouncedSearchTerm(value);
      setIsDropdownOpen(value.length > 0);
    }, 500);
    debouncedSetSearchTerm(searchTerm);
  }, [searchTerm, debounce]);

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
      // Clear search queries to prevent stale results
      queryClient.removeQueries({ queryKey: ["search"], exact: false });
    }
  };

  // Handle clicking a search result
  const handleResultClick = (productId) => {
    router.push(`/products/${productId}`);
    setSearchTerm("");
    setIsDropdownOpen(false);
    // Clear search queries to prevent stale results
    queryClient.removeQueries({ queryKey: ["search"], exact: false });
  };

  // Handle dropdown close
  const handleDropdownClose = () => {
    setTimeout(() => {
      setIsDropdownOpen(false);
      // Clear search queries when dropdown closes
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

  return (
    <header className="py-4 shadow-sm bg-white">
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/images/swiftcart-logo.svg"
            alt="Logo"
            width={128}
            height={40}
            className="w-44 h-auto"
          />
        </Link>

        {/* Search Bar */}
        <div className="w-full max-w-xl relative">
          <form onSubmit={handleSearchSubmit} className="flex">
            <span className="absolute left-4 top-3 text-lg text-gray-400">
              <FaSearch />
            </span>
            <input
              type="text"
              name="search"
              id="search"
              className="w-full border border-primary border-r-0 pl-12 py-3 pr-3 rounded-l-md focus:outline-none"
              placeholder="Search Product"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => debouncedSearchTerm && setIsDropdownOpen(true)}
              onBlur={handleDropdownClose}
            />
            <button
              type="submit"
              className="bg-primary border border-primary text-white px-8 rounded-r-md hover:bg-transparent hover:text-primary transition"
            >
              Search
            </button>
          </form>

          {/* Search Results Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto z-10">
              {searchLoading ? (
                <div className="p-4 text-gray-500">Loading...</div>
              ) : searchResults?.products?.length > 0 ? (
                searchResults.products.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => handleResultClick(product._id)}
                    className="p-4 hover:bg-gray-100 cursor-pointer flex items-center space-x-4"
                  >
                    {product.mainImage && (
                      <Image
                        src={product.mainImage}
                        alt={product.title}
                        width={40}
                        height={40}
                        className="w-10 h-10 object-cover rounded"
                      />
                    )}
                    <div>
                      <p className="text-gray-800 font-medium">{product.title}</p>
                      <p className="text-gray-500 text-sm">
                        {product.brand} - {product.category}
                      </p>
                      <p className="text-primary font-medium">${product.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-gray-500">No products found</div>
              )}
            </div>
          )}
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