// frontend/src/components/UserMenu.jsx
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
  FileEdit,
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

  if (!isAuthenticated) return null;

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full"
        aria-expanded={isOpen}
        aria-label="User menu"
      >
        {user?.image?.url ? (
          <img
            src={user.image.url}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover border border-border"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm">
            {getInitials(user?.name)}
          </div>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-surface rounded-lg shadow-xl border border-border py-2 z-50 animate-in fade-in slide-in-from-top-2">
          {/* User Info */}
          <div className="px-5 py-4 border-b border-border">
            <div className="flex items-center gap-4">
              {user?.image?.url ? (
                <img
                  src={user.image.url}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover border border-border"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-lg">
                  {getInitials(user?.name)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-primary truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-secondary truncate">{user?.email}</p>
                
                <div className="flex gap-1 mt-1">
                  {(user?.role === "admin" || user?.isAdmin) && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-100 text-neutral-700 text-xs font-medium rounded-full border border-neutral-200">
                      <Shield className="w-3 h-3" />
                      Admin
                    </span>
                  )}
                  {(user?.role === "author" || user?.isAuthor) && (
                     <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-100 text-neutral-700 text-xs font-medium rounded-full border border-neutral-200">
                      <FileEdit className="w-3 h-3" />
                      Author
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Links */}
          <div className="py-2">
            {[
              { to: "/profile", label: "Profile", sub: "View profile", icon: User },
              { to: "/my-posts", label: "Stories", sub: "Manage stories", icon: FileText },
              { to: "/bookmarks", label: "Library", sub: "Saved stories", icon: Bookmark },
              { to: "/settings", label: "Settings", sub: "Preferences", icon: Settings },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="flex items-start gap-3 px-5 py-3 hover:bg-neutral-50 transition-colors group"
              >
                <link.icon className="w-5 h-5 text-secondary group-hover:text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-primary">{link.label}</p>
                  <p className="text-xs text-secondary">{link.sub}</p>
                </div>
              </Link>
            ))}

            {/* Admin Link */}
            {(user?.role === "admin" || user?.isAdmin) && (
              <>
                <div className="border-t border-border mx-5 my-2"></div>
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-start gap-3 px-5 py-3 hover:bg-neutral-50 transition-colors group"
                >
                  <Shield className="w-5 h-5 text-secondary group-hover:text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-primary">Admin</p>
                    <p className="text-xs text-secondary">Dashboard</p>
                  </div>
                </Link>
              </>
            )}
          </div>

          {/* Logout */}
          <div className="border-t border-border pt-2 pb-1">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-5 py-3 w-full text-left hover:bg-neutral-50 transition-colors text-red-600 group"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
