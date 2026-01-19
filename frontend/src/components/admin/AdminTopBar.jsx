import { useSelector } from "react-redux";
import { 
  Bell, 
  Search, 
  Menu,
  Globe,
  Settings
} from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminTopBar({ setIsSidebarOpen }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg lg:hidden"
          >
            <Menu size={20} />
          </button>
          
          <div className="hidden sm:flex items-center gap-2 relative">
            <Search className="absolute left-3 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Quick search..."
              className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 w-64 lg:w-96 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link 
            to="/" 
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-all flex items-center gap-2 text-sm font-bold"
            title="View Website"
          >
            <Globe size={18} className="text-emerald-600" />
            <span className="hidden md:inline">Live Site</span>
          </Link>

          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-all relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block"></div>

          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-black text-slate-900 leading-none">{user?.name || "Admin"}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Super Admin</p>
            </div>
            <img 
              src={user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "A")}&background=10b981&color=fff`} 
              alt="Profile" 
              className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-md"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
