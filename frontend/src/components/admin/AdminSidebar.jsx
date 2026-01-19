import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../store/authSlice";
import {
  LayoutDashboard,
  FileText,
  Clock,
  MessageSquare,
  Users,
  Settings,
  X,
  ChevronLeft,
  LogOut,
  Sparkles
} from "lucide-react";

const menuItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, path: "/admin" },
  { id: "posts", label: "Manage Posts", icon: FileText, path: "/admin?tab=all" },
  { id: "submissions", label: "Submissions", icon: Clock, path: "/admin?tab=pending" },
  { id: "comments", label: "Comments", icon: MessageSquare, path: "/admin/comments" },
  { id: "users", label: "Users", icon: Users, path: "/admin/users" },
  { id: "settings", label: "Settings", icon: Settings, path: "/admin/settings" },
];

export default function AdminSidebar({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 transition-all duration-300 ease-in-out transform 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        ${isCollapsed ? "lg:w-20" : "lg:w-72"}`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:rotate-12 transition-transform">
                <Sparkles className="text-white w-6 h-6" />
              </div>
              {!isCollapsed && (
                <span className="text-xl font-black text-slate-900 tracking-tight">
                  Blogify<span className="text-emerald-600">.</span>
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg lg:hidden"
            >
              <X size={20} />
            </button>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <ChevronLeft className={`transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path === "/admin" && location.search === "");
              // Handle tab specific paths for active state
              const isTabActive = item.path.includes("tab=") && location.search.includes(item.path.split("=")[1]);
              const active = isActive || isTabActive;

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all group relative
                  ${active 
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
                >
                  <item.icon size={20} className={active ? "text-white" : "group-hover:text-emerald-600 transition-colors"} />
                  {!isCollapsed && <span>{item.label}</span>}
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-[100]">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-slate-100">
            <button 
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-4 py-4 text-rose-500 font-bold hover:bg-rose-50 rounded-xl transition-all group relative`}
            >
              <LogOut size={20} />
              {!isCollapsed && <span>Log Out</span>}
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-rose-600 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-[100]">
                  Log Out
                </div>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
