import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopBar from "./AdminTopBar";

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed} 
      />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? "lg:ml-20" : "lg:ml-72"}`}>
        <AdminTopBar setIsSidebarOpen={setIsSidebarOpen} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500">
          {children}
        </main>
      </div>
    </div>
  );
}
