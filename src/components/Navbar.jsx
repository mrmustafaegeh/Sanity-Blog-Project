import React from "react";
import { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="w-full shadow-md bg-white sticky top-0 z-50">
      <nav className="container mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <div className="text-2xl font-bold text-gray-900">Blogify</div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <ul className="flex space-x-6 text-gray-700 font-medium">
            <li>
              <Link to="/" className="hover:text-[#5ea9ba] transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/categories"
                className="hover:text-[#5ea9ba] transition-colors"
              >
                Categories
              </Link>
            </li>
            <li>
              <Link
                to="/Blog"
                className="hover:text-[#5ea9ba] transition-colors"
              >
                Blog
              </Link>
            </li>
          </ul>

          {/* Login Button */}
          <Link
            to="/login"
            className="px-4 py-2 bg-[#7fd3e6] text-white rounded-lg hover:bg-[#5ea9ba] transition-colors"
          >
            Login
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-gray-700 focus:outline-none"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <ul className="flex flex-col space-y-4 px-6 py-4 text-gray-700 font-medium">
            <li>
              <Link to="/" className="hover:text-blue-600">
                Home
              </Link>
            </li>
            <li>
              <Link to="/categories" className="hover:text-blue-600">
                Categories
              </Link>
            </li>
            <li>
              <Link to="/blog" className="hover:text-blue-600">
                Blog
              </Link>
            </li>
          </ul>

          {/* Search + Login in mobile */}
          <div className="px-6 py-4 space-y-4">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Link
              to="/login"
              className="block text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
