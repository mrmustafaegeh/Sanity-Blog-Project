import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Search, Menu, X, User as UserIcon } from "lucide-react";
import SearchBar from "../../shared/SearchBar";
import UserMenu from "../../UserMenu";
import Button from "../../ui/Button";
import clsx from "clsx";

export default function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/blog", label: "Ride" },
    { path: "/categories/technology", label: "Technology" },
    { path: "/categories", label: "Categories" },
    { path: "/contact", label: "Contact" },
  ];

  // Helper to determine if link is active
  const isActive = (path) => {
    if (path === "/" && location.pathname !== "/") return false;
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className={clsx(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "bg-white/90 backdrop-blur-md border-border shadow-sm"
          : "bg-background border-transparent"
      )}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white font-serif font-bold text-xl group-hover:bg-neutral-800 transition-colors">
              B
            </div>
            <span className="text-xl font-bold tracking-tight text-primary">
              Blogify.
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={clsx(
                  "text-sm font-medium transition-colors duration-200",
                  isActive(link.path)
                    ? "text-primary font-semibold"
                    : "text-secondary hover:text-primary"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 text-secondary hover:text-primary transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <UserMenu />
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-medium text-secondary hover:text-primary transition-colors"
                  >
                    Log In
                  </Link>
                  <Link to="/register">
                    <Button size="small">Subscribe</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-secondary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background py-4 px-4 animate-in slide-in-from-top-2">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-secondary hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-border" />
            {!isAuthenticated && (
              <div className="flex flex-col gap-3 pt-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                   <Button variant="ghost" className="w-full justify-start pl-0">Log In</Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Subscribe</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search Overlay (Simple implementation) */}
      {showSearch && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-border p-4 shadow-lg animate-in slide-in-from-top-2">
          <div className="max-w-2xl mx-auto">
             <SearchBar onClose={() => setShowSearch(false)} />
          </div>
        </div>
      )}
    </nav>
  );
}