import React, { useEffect, useState, useRef } from "react";
import { Search, ShoppingCart, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar({ setCategory, setSearchQuery }) {
  const navigate = useNavigate();
  const { cart } = useCart();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setDropdownOpen(false);
    navigate("/");
  };

  const categories = [
    "All",
    "Clothing",
    "Footwear",
    "Electronics",
    "Accessories",
    "Home & Kitchen",
  ];

  const isSeller = user?.role === "seller";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <nav className="flex flex-wrap items-center justify-between px-6 py-3">
        {/* Left Section: Logo */}
        <div className="flex items-center gap-3">
          <span className="text-2xl">🛍️</span>
          <Link
            to="/"
            className="text-2xl font-bold text-blue-600"
            onClick={() => {
              setCategory?.("");
              setSearchQuery?.("");
            }}
          >
            ShopEase
          </Link>
        </div>

        {/* Center Section: Search (Hide for Sellers) */}
        {!isSeller && (
          <div className="flex-1 flex justify-center">
            <div className="flex items-center rounded-full bg-gray-100 px-5 py-2 w-80 md:w-96">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search for products..."
                className="bg-transparent outline-none ml-3 w-full text-sm placeholder-gray-500"
                onChange={(e) => setSearchQuery?.(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-6">
          {/* Hide Home & Cart for Sellers */}
          {!isSeller && (
            <>
              <Link to="/" className="hover:text-blue-500 font-medium transition">
                Home
              </Link>

              <Link to="/cart" className="relative hover:text-blue-500">
                <ShoppingCart className="w-6 h-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {cart.length}
                  </span>
                )}
              </Link>
            </>
          )}

          {/* User Section */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200 transition"
              >
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {user.name || user.email.split("@")[0]}
                </span>
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-lg py-2 animate-fadeIn">
                  {isSeller && (
                    <Link
                      to="/seller-dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                    >
                      Seller Dashboard
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            !isSeller && (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 text-sm font-medium transition"
                >
                  Sign Up
                </Link>
              </>
            )
          )}
        </div>
      </nav>

      {/* Category Bar (Hide for Sellers) */}
      {!isSeller && (
        <div className="flex gap-3 flex-wrap px-6 py-3 justify-center bg-gray-50 border-t border-gray-200">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory?.(cat === "All" ? "" : cat)}
              className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-gray-200 hover:bg-blue-600 hover:text-white transition-all duration-200"
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
