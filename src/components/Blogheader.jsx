// BlogHeader.js
import React from "react";

const BlogHeader = () => {
  return (
    <header className="bg-gray-800 text-white py-16">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Blog</h1>
        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
          Insights, stories and ideas from our team
        </p>
      </div>
    </header>
  );
};

export default BlogHeader;
