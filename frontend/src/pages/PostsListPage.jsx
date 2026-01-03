// frontend/src/pages/BlogListPage.jsx
import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useGetPostsQuery, useGetCategoriesQuery } from "@/api/postsAPI";
import { Search, Filter, Grid, List, Calendar, TrendingUp } from "lucide-react";
import PostCard from "@/components/blog/PostCard";
import LoadingGrid from "@/components/ui/LoadingGrid";
import ErrorState from "@/components/ui/ErrorState";

export default function BlogListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [localSearch, setLocalSearch] = useState("");

  const page = Number(searchParams.get("page")) || 1;
  const category = searchParams.get("category") || null;
  const sort = searchParams.get("sort") || "newest";

  const { data, isLoading, isError, error } = useGetPostsQuery({
    page,
    category,
    sort,
    limit: 12,
  });

  const { data: categories = [] } = useGetCategoriesQuery();

  const posts = data?.posts || [];
  const totalPages = data?.totalPages || 1;
  const totalPosts = data?.total || 0;

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", newPage.toString());
      return newParams;
    });
  };

  const handleCategoryChange = (categoryId) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (categoryId) {
        newParams.set("category", categoryId);
      } else {
        newParams.delete("category");
      }
      newParams.set("page", "1");
      return newParams;
    });
  };

  const handleSortChange = (sortType) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("sort", sortType);
      newParams.set("page", "1");
      return newParams;
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="container mx-auto px-4">
          <LoadingGrid count={6} />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="container mx-auto px-4">
          <ErrorState
            message="Failed to load posts"
            error={error}
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Blog Posts
          </h1>
          <p className="text-lg text-gray-600">
            Browse through {totalPosts} articles on various topics
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
            {/* Search */}
            <div className="w-full lg:w-1/3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* View Controls */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={category || ""}
                  onChange={(e) => handleCategoryChange(e.target.value || null)}
                  className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm appearance-none bg-white"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.title} ({cat.postCount || 0})
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Options */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleSortChange("newest")}
                  className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg text-sm ${
                    sort === "newest"
                      ? "bg-emerald-100 text-emerald-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Newest</span>
                </button>
                <button
                  onClick={() => handleSortChange("popular")}
                  className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg text-sm ${
                    sort === "popular"
                      ? "bg-emerald-100 text-emerald-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Popular</span>
                </button>
              </div>

              {/* View Toggle */}
              <div className="flex items-center space-x-2 border-l border-gray-200 pl-4">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg ${
                    viewMode === "grid"
                      ? "bg-emerald-100 text-emerald-600"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  aria-label="Grid view"
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg ${
                    viewMode === "list"
                      ? "bg-emerald-100 text-emerald-600"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  aria-label="List view"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Posts */}
        {posts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No posts found
            </h3>
            <p className="text-gray-500 mb-6">
              {category
                ? `No posts found in this category. Try another category or clear filters.`
                : "No posts available yet. Check back soon!"}
            </p>
            {category && (
              <button
                onClick={() => handleCategoryChange(null)}
                className="px-6 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Clear Category Filter
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Posts Grid/List */}
            <div
              className={`
              ${
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "space-y-6"
              } gap-6 mb-12
            `}
            >
              {posts.map((post) =>
                viewMode === "grid" ? (
                  <PostCard key={post._id} post={post} />
                ) : (
                  <div
                    key={post._id}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3">
                        <img
                          src={
                            post.mainImage?.asset?.url ||
                            "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                          }
                          alt={post.title}
                          className="w-full h-48 md:h-full object-cover"
                        />
                      </div>
                      <div className="md:w-2/3 p-6">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.categories?.slice(0, 2).map((cat, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full"
                            >
                              {cat.title || cat}
                            </span>
                          ))}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          <Link
                            to={`/blog/${post.slug?.current}`}
                            className="hover:text-emerald-600 transition-colors"
                          >
                            {post.title}
                          </Link>
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {post.excerpt || "Read this article to learn more..."}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                {post.author?.name?.charAt(0) || "A"}
                              </span>
                            </div>
                            <span className="text-sm text-gray-600">
                              {post.author?.name || "Anonymous"}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(post.publishedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                <div className="text-sm text-gray-600">
                  Showing page {page} of {totalPages} • {totalPosts} total posts
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                          page === pageNum
                            ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow-sm"
                            : "hover:bg-gray-100 text-gray-700"
                        } transition-colors`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
