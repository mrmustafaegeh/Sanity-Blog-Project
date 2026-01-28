import { useLocation } from "react-router-dom";
import Navbar from "./Header/Navbar";
import Footer from "./Footer/Footer"; // Assuming Footer exists
import { Toaster } from "react-hot-toast";

export default function Layout({ children }) {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");

  if (isAdminPath) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <main>{children}</main>
        <Toaster position="top-right" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-primary">
      <Navbar />
      <main className="flex-grow w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 min-h-[60vh]">
        {children}
      </main>
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          className: "text-sm font-medium",
          duration: 4000,
          style: {
            background: "#1c1917", // darker neutral
            color: "#fff",
            borderRadius: "6px",
          },
          success: {
            iconTheme: {
              primary: "#fff",
              secondary: "#1c1917",
            },
          },
        }}
      />
    </div>
  );
}
