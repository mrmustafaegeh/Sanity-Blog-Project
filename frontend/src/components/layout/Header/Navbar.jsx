// frontend/src/components/layout/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Search, Menu, X, PlusCircle, FileText, Shield } from "lucide-react";
import SearchBar from "../../shared/SearchBar";
import UserMenu from "../../UserMenu";

export default function Navbar() {
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/blog", label: "Blog", icon: "📝" },
    { path: "/categories", label: "Categories", icon: "🏷️" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-lg"
          : "bg-white/90 backdrop-blur-lg border-b border-gray-100"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent hover:scale-105 transition-transform"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span>Blogify</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive(link.path)
                    ? "text-emerald-600 bg-emerald-50"
                    : "text-gray-700 hover:text-emerald-600 hover:bg-gray-50"
                }`}
              >
                <span className="mr-1.5">{link.icon}</span>
                {link.label}
              </Link>
            ))}

            {/* User Submission Links (Authenticated Users) */}
            {isAuthenticated && (
              <>
                <Link
                  to="/submit"
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Submit Post
                </Link>

                <Link
                  to="/user/submissions"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  My Posts
                </Link>
              </>
            )}

            {/* Admin Link (Admin Users Only) */}
            {user?.isAdmin && (
              <Link
                to="/admin/pending"
                className="flex items-center px-3 py-2 text-sm font-medium text-purple-700 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors border border-purple-200"
              >
                <Shield className="w-4 h-4 mr-2" />
                Admin
              </Link>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Search Button/Bar */}
            <div className="hidden md:block">
              {showSearch ? (
                <div className="animate-fade-in w-64">
                  <SearchBar onClose={() => setShowSearch(false)} />
                </div>
              ) : (
                <button
                  onClick={() => setShowSearch(true)}
                  className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors group"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5 text-gray-600 group-hover:text-emerald-600" />
                </button>
              )}
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden lg:flex items-center space-x-3">
              {isAuthenticated ? (
                <UserMenu />
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 animate-slide-down">
            <SearchBar />
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 animate-slide-down">
            <div className="flex flex-col space-y-1">
              {/* Main Navigation Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? "bg-emerald-50 text-emerald-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="mr-3 text-lg">{link.icon}</span>
                  {link.label}
                </Link>
              ))}

              {/* Divider */}
              <div className="h-px bg-gray-200 my-2 mx-4" />

              {/* User Submission Links */}
              {isAuthenticated && (
                <>
                  <Link
                    to="/submit"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center px-4 py-3 rounded-lg text-sm font-medium bg-gradient-to-r from-emerald-500 to-teal-400 text-white mb-2"
                  >
                    <PlusCircle className="w-5 h-5 mr-3" />
                    Submit Post
                  </Link>

                  <Link
                    to="/user/submissions"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <FileText className="w-5 h-5 mr-3" />
                    My Posts
                  </Link>
                </>
              )}

              {/* Admin Link */}
              {user?.isAdmin && (
                <Link
                  to="/admin/pending"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-4 py-3 rounded-lg text-sm font-medium text-purple-700 bg-purple-50 border border-purple-100 mt-2"
                >
                  <Shield className="w-5 h-5 mr-3" />
                  Admin Panel
                </Link>
              )}

              {/* User Menu for Mobile */}
              <div className="mt-4 px-4">
                <UserMenu mobile />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
