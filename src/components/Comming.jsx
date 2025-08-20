// ComingSoon.js
import React from "react";

const ComingSoon = () => {
  return (
    <div className="text-center py-12">
      <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
        <svg
          className="w-12 h-12 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-medium text-gray-900 mb-2">Coming Soon</h3>
      <p className="text-gray-500 max-w-md mx-auto">
        Our team is working on some great content. Check back later for our
        first posts!
      </p>
    </div>
  );
};

export default ComingSoon;
