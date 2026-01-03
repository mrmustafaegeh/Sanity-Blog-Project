import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetCategoriesQuery, useGetRecentPostsQuery } from "../api/postsAPI";
import { Search, Filter, FolderOpen, TrendingUp, Clock } from "lucide-react";
import LoadingGrid from "../components/ui/LoadingGrid";
import ErrorState from "../components/ui/ErrorState";
import PostCard from "../components/blog/PostCard";

const CategoriesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Fetch categories and recent posts
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useGetCategoriesQuery();

  const {
    data: recentPosts = [],
    isLoading: postsLoading,
    isError: postsError,
  } = useGetRecentPostsQuery(3);

  // Filter and sort categories
  const filteredCategories = categories
    .filter((cat) => {
      const query = searchQuery.toLowerCase();
      return (
        !searchQuery ||
        cat.title?.toLowerCase().includes(query) ||
        cat.description?.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      if (activeFilter === "popular")
        return (b.postCount || 0) - (a.postCount || 0);
      if (activeFilter === "recent")
        return new Date(b._createdAt || 0) - new Date(a._createdAt || 0);
      return 0;
    });

  if (categoriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (categoriesError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <ErrorState
          message="Failed to load categories"
          error={categoriesError}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl mb-6">
            <FolderOpen className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Blog Categories
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore all topics and find content that interests you most. Browse
            through {categories.length} categories.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="mb-12 bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
            <div className="w-full lg:w-1/3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { key: "all", label: "All Categories", icon: Filter },
                { key: "popular", label: "Most Popular", icon: TrendingUp },
                { key: "recent", label: "Recently Updated", icon: Clock },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all ${
                    activeFilter === key
                      ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveFilter(key)}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
            {filteredCategories.map((category) => {
              const slug = category.slug?.current || category._id;
              const postCount = category.postCount || 0;
              return (
                <div
                  key={category._id}
                  className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-emerald-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                        <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                          {category.title?.charAt(0) || "C"}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                          {category.title || "Unnamed Category"}
                        </h3>
                        <div className="flex items-center mt-1">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                          <span className="text-xs text-gray-500">
                            {postCount} article{postCount !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                      {category.description ||
                        "Explore our latest posts in this category"}
                    </p>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <span
                        className={`text-sm px-3 py-1 rounded-full ${
                          postCount > 5
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {postCount > 5 ? "Popular" : "Growing"}
                      </span>
                      <Link
                        to={`/categories/${slug}`}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 font-medium rounded-lg hover:from-emerald-100 hover:to-teal-100 transition-all group-hover:shadow-sm"
                      >
                        <span className="text-sm">Explore</span>
                        <span className="group-hover:translate-x-1 transition-transform">
                          →
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center mb-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No categories found
            </h3>
            <p className="text-gray-500">
              {searchQuery
                ? `No categories match your search for "${searchQuery}"`
                : "No categories available yet. Check back soon!"}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 px-4 py-2 text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {/* Recent Posts */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Recent Posts
              </h2>
              <p className="text-gray-600 mt-2">
                Latest articles from all categories
              </p>
            </div>
            <Link
              to="/blog"
              className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center space-x-1"
            >
              <span>View All Posts</span> <span>→</span>
            </Link>
          </div>

          {postsLoading ? (
            <LoadingGrid count={3} />
          ) : postsError ? (
            <ErrorState message="Failed to load recent posts" />
          ) : recentPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <p className="text-gray-500">No recent posts available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
