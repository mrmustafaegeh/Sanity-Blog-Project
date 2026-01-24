// frontend/src/components/layout/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Search, Menu, X, PlusCircle, FileText, Shield, Home, BookOpen, Tag } from "lucide-react";
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
    { path: "/", label: "Home", icon: Home },
    { path: "/blog", label: "Blog", icon: BookOpen },
    { path: "/categories", label: "Categories", icon: Tag },
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
          ? "bg-slate-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl"
          : "bg-slate-900/90 backdrop-blur-xl border-b border-white/5"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-2xl font-bold group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Blogify
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 flex items-center gap-2 ${
                    isActive(link.path)
                      ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                      : "text-gray-300 hover:text-emerald-400 hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}

            {/* User Submission Links (Authenticated Users) */}
            {isAuthenticated && (
              <>
                <Link
                  to="/submit"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 hover:scale-105"
                >
                  <PlusCircle className="w-4 h-4" />
                  Submit Post
                </Link>

                <Link
                  to="/user/submissions"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-emerald-400 hover:bg-white/5 rounded-xl transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  My Posts
                </Link>
              </>
            )}

            {/* Admin Link (Admin Users Only) */}
            {user?.isAdmin && (
              <Link
                to="/admin/pending"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-xl transition-colors border border-purple-500/20"
              >
                <Shield className="w-4 h-4" />
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
                  className="p-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5 text-gray-400 group-hover:text-emerald-400" />
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
                    className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-emerald-400 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 hover:scale-105"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2.5 rounded-xl hover:bg-white/5 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pb-4 animate-slide-down">
            <SearchBar />
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 py-4 animate-slide-down">
            <div className="flex flex-col space-y-1">
              {/* Main Navigation Links */}
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive(link.path)
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "text-gray-300 hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}

              {/* Divider */}
              <div className="h-px bg-white/10 my-2 mx-4" />

              {/* User Submission Links */}
              {isAuthenticated && (
                <>
                  <Link
                    to="/submit"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-gradient-to-r from-emerald-500 to-cyan-500 text-white mb-2"
                  >
                    <PlusCircle className="w-5 h-5" />
                    Submit Post
                  </Link>

                  <Link
                    to="/user/submissions"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/5"
                  >
                    <FileText className="w-5 h-5" />
                    My Posts
                  </Link>
                </>
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