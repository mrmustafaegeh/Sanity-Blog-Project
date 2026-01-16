// frontend/src/pages/BlogListPage.jsx
import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useGetPostsQuery, useGetCategoriesQuery } from "../api/postsAPI";
import {
  Search,
  Filter,
  Grid,
  List,
  Calendar,
  TrendingUp,
  Sparkles,
} from "lucide-react";

export default function BlogListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState("grid");
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
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse"
              >
                <div className="h-56 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Failed to Load Posts
            </h2>
            <p className="text-gray-600 mb-6">
              {error?.data?.message || "Please try again later"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 text-white rounded-xl hover:shadow-lg transition-all"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Hero Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full mb-4">
            <Sparkles size={16} />
            <span className="text-sm font-medium">
              Discover Amazing Content
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 via-emerald-800 to-teal-700 bg-clip-text text-transparent">
            Blog Posts
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore {totalPosts.toLocaleString()} insightful articles on
            technology, development, and innovation
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-gray-200 p-6 mb-8 shadow-xl">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0 gap-4">
            {/* Search */}
            <div className="w-full lg:w-1/3">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-all"
                />
              </div>
            </div>

            {/* View Controls */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Category Filter */}
              <div className="relative group">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-emerald-500 transition-colors pointer-events-none" />
                <select
                  value={category || ""}
                  onChange={(e) => handleCategoryChange(e.target.value || null)}
                  className="pl-10 pr-8 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm appearance-none bg-white cursor-pointer hover:border-emerald-300 transition-all"
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
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSortChange("newest")}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    sort === "newest"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Newest</span>
                </button>
                <button
                  onClick={() => handleSortChange("popular")}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    sort === "popular"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Popular</span>
                </button>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2 border-l-2 border-gray-200 pl-4">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 rounded-xl transition-all ${
                    viewMode === "grid"
                      ? "bg-emerald-100 text-emerald-600"
                      : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  }`}
                  aria-label="Grid view"
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 rounded-xl transition-all ${
                    viewMode === "list"
                      ? "bg-emerald-100 text-emerald-600"
                      : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
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
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200 p-12 text-center shadow-xl">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No posts found
            </h3>
            <p className="text-gray-600 mb-6">
              {category
                ? "No posts found in this category. Try another category or clear filters."
                : "No posts available yet. Check back soon!"}
            </p>
            {category && (
              <button
                onClick={() => handleCategoryChange(null)}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 text-white font-medium rounded-xl hover:shadow-lg transition-all"
              >
                Clear Category Filter
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Posts Grid/List */}
            <div
              className={`${
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-6"
              } mb-12`}
            >
              {posts.map((post) => (
                <article
                  key={post._id}
                  className={`bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 group ${
                    viewMode === "list" ? "flex flex-col md:flex-row" : ""
                  }`}
                >
                  <div
                    className={`relative overflow-hidden ${viewMode === "list" ? "md:w-1/3" : ""}`}
                  >
                    <img
                      src={
                        post.mainImage?.asset?.url ||
                        post.mainImage?.url ||
                        post.image ||
                        `https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80`
                      }
                      alt={post.title}
                      className={`w-full object-cover group-hover:scale-110 transition-transform duration-500 ${
                        viewMode === "list" ? "h-full min-h-[200px]" : "h-56"
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div
                    className={`p-6 ${viewMode === "list" ? "md:w-2/3 flex flex-col justify-between" : ""}`}
                  >
                    <div>
                      {post.categories?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.categories.slice(0, 2).map((cat, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full font-medium"
                            >
                              {cat.title || cat}
                            </span>
                          ))}
                        </div>
                      )}

                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                        <Link to={`/blog/${post.slug?.current || post.slug}`}>
                          {post.title}
                        </Link>
                      </h3>

                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {post.excerpt ||
                          post.aiSummary ||
                          "Read this article to learn more..."}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        {post.author?.image?.url ? (
                          <img
                            src={post.author.image.url}
                            alt={post.author.name}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {post.author?.name?.charAt(0) || "A"}
                            </span>
                          </div>
                        )}
                        <span className="font-medium">
                          {post.author?.name || "Anonymous"}
                        </span>
                      </div>
                      <span>
                        {new Date(
                          post.publishedAt || post.createdAt
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-gray-200 shadow-xl">
                <div className="text-sm text-gray-600">
                  Showing page{" "}
                  <span className="font-bold text-emerald-600">{page}</span> of{" "}
                  <span className="font-bold text-emerald-600">
                    {totalPages}
                  </span>{" "}
                  •{" "}
                  <span className="font-bold text-emerald-600">
                    {totalPosts.toLocaleString()}
                  </span>{" "}
                  total posts
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="px-5 py-2.5 border-2 border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
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
                        className={`w-11 h-11 flex items-center justify-center rounded-xl font-medium transition-all ${
                          page === pageNum
                            ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow-lg scale-110"
                            : "hover:bg-gray-100 text-gray-700 border-2 border-gray-200"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="px-5 py-2.5 border-2 border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
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
