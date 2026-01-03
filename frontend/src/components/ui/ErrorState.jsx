// frontend/src/components/ui/ErrorState.jsx
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function ErrorState({
  message = "Something went wrong",
  error,
  onRetry,
}) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">{message}</h3>

        {error && (
          <p className="text-gray-600 text-sm mb-6">
            {error.message || "Please try again later"}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          )}

          <Link
            to="/"
            className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            If the problem persists, please contact support
          </p>
        </div>
      </div>
    </div>
  );
}
