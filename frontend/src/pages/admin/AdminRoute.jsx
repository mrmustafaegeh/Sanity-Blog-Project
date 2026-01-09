// frontend/src/pages/admin/AdminRoute.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";

export default function AdminRoute({ children }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is admin
  if (!user?.isAdmin && user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. Admin privileges are
            required.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  return children;
}
