import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/authSlice";
import {
  User,
  Settings,
  Bookmark,
  FileText,
  LogOut,
  Shield,
} from "lucide-react";

export default function UserMenu() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    setIsOpen(false);
    navigate("/");
  };

  // Get initials
  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.split(" ");
    return names.length >= 2
      ? `${names[0][0]}${names[1][0]}`.toUpperCase()
      : name[0].toUpperCase();
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-3">
        <Link
          to="/login"
          className="text-gray-700 hover:text-[#12725c] font-medium transition-colors"
        >
          Sign In
        </Link>
        <Link
          to="/register"
          className="px-4 py-2 bg-gradient-to-r from-[#7fd3e6] to-[#12725c] text-white rounded-lg hover:opacity-90 transition-opacity font-medium shadow-sm"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-full"
        aria-expanded={isOpen}
        aria-label="User menu"
      >
        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 hover:border-emerald-500 transition-colors"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7fd3e6] to-[#12725c] flex items-center justify-center text-white font-semibold shadow-sm">
            {getInitials(user?.name)}
          </div>
        )}
        <span className="text-sm font-medium text-gray-700 hidden md:block">
          {user?.name}
        </span>
        <svg
          className={`w-4 h-4 text-gray-600 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7fd3e6] to-[#12725c] flex items-center justify-center text-white font-semibold text-lg">
                  {getInitials(user?.name)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                {user?.role === "admin" && (
                  <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 text-xs font-medium rounded-full border border-purple-200">
                    <Shield className="w-3 h-3" />
                    Admin
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Menu Links */}
          <div className="py-2">
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="font-medium">Your Profile</p>
                <p className="text-xs text-gray-500">View & edit profile</p>
              </div>
            </Link>

            <Link
              to="/my-posts"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <p className="font-medium">My Posts</p>
                <p className="text-xs text-gray-500">Manage your content</p>
              </div>
            </Link>

            <Link
              to="/bookmarks"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 group-hover:bg-yellow-600 group-hover:text-white transition-colors">
                <Bookmark className="w-4 h-4" />
              </div>
              <div>
                <p className="font-medium">Bookmarks</p>
                <p className="text-xs text-gray-500">Saved articles</p>
              </div>
            </Link>

            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-gray-600 group-hover:text-white transition-colors">
                <Settings className="w-4 h-4" />
              </div>
              <div>
                <p className="font-medium">Settings</p>
                <p className="text-xs text-gray-500">Account preferences</p>
              </div>
            </Link>

            {/* Admin Link */}
            {user?.role === "admin" && (
              <>
                <div className="border-t border-gray-100 mx-4 my-2"></div>
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-purple-700 hover:bg-purple-50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center text-purple-600 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:text-white transition-colors">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium">Admin Dashboard</p>
                    <p className="text-xs text-purple-500">
                      Manage website content
                    </p>
                  </div>
                </Link>
              </>
            )}
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 pt-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors w-full group"
            >
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                <LogOut className="w-4 h-4" />
              </div>
              <div>
                <p className="font-medium">Sign Out</p>
                <p className="text-xs text-red-500">Logout from your account</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
