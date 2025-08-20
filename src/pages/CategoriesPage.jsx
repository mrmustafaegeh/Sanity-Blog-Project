import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import client from "../client";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch categories from Sanity
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        // Query to get categories with their post counts
        const query = `*[_type == "category"]{
          _id,
          title,
          slug,
          description,
          "postCount": count(*[_type == "post" && references(^._id)])
        } | order(title asc)`;

        const data = await client.fetch(query);
        setCategories(data);
        setFilteredCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Filter categories based on search and active filter
  useEffect(() => {
    let result = categories;

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (category) =>
          category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (category.description &&
            category.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
      );
    }

    // Apply additional filters
    if (activeFilter === "popular") {
      result = [...result].sort((a, b) => b.postCount - a.postCount);
    } else if (activeFilter === "recent") {
      // For recent, we might need to add a date field to categories
      result = [...result].reverse();
    }

    setFilteredCategories(result);
  }, [searchQuery, activeFilter, categories]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#12725c]"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Blog Categories
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore all topics and find content that interests you most
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="w-full md:w-1/3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search categories..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7fd3e6] focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                className={`px-4 py-2 rounded-lg transition-colors ${activeFilter === "all" ? "bg-[#12725c] text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
                onClick={() => setActiveFilter("all")}
              >
                All Categories
              </button>
              <button
                className={`px-4 py-2 rounded-lg transition-colors ${activeFilter === "popular" ? "bg-[#12725c] text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
                onClick={() => setActiveFilter("popular")}
              >
                Most Popular
              </button>
              <button
                className={`px-4 py-2 rounded-lg transition-colors ${activeFilter === "recent" ? "bg-[#12725c] text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
                onClick={() => setActiveFilter("recent")}
              >
                Recently Updated
              </button>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((category) => {
              // Safely get the slug value
              const slugValue = category.slug?.current || category._id;

              return (
                <div
                  key={category._id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-[#7fd3e6] bg-opacity-20 flex items-center justify-center mr-3">
                        <span className="text-xl text-[#12725c] font-bold">
                          {category.title?.charAt(0) || "C"}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {category.title || "Unnamed Category"}
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-4 text-sm">
                      {category.description ||
                        "Explore our latest posts in this category"}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {category.postCount || 0} posts
                      </span>
                      <Link
                        to={`/category/${slugValue}`}
                        className="px-4 py-2 bg-[#7fd3e6] text-white rounded-lg hover:bg-[#5bb9d0] transition-colors text-sm font-medium"
                      >
                        View Posts
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <i className="fas fa-folder-open text-4xl text-gray-300 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No categories found
            </h3>
            <p className="text-gray-500">
              {searchQuery
                ? `No categories match your search for "${searchQuery}"`
                : "No categories available yet"}
            </p>
          </div>
        )}

        {/* Recent Posts Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
            Recent Posts
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Design Principles for UAUK
              </h3>
              <p className="text-sm text-gray-600 mb-3">by kaitan, dillosen</p>
              <p className="text-sm text-gray-500">August 18, 2024</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                The Future of Artificial Intelligence
              </h3>
              <p className="text-sm text-gray-600 mb-3">by adotahani</p>
              <p className="text-sm text-gray-500">August 4, 2024</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Exploring the Mountains
              </h3>
              <p className="text-sm text-gray-600 mb-3">Apple Incendia</p>
              <p className="text-sm text-gray-500">August, 2024</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
