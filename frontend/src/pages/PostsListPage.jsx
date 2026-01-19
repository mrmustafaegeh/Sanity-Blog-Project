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
  User,
  Clock,
  Eye,
  Heart,
} from "lucide-react";

export default function BlogListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState("grid");
  const [localSearch, setLocalSearch] = useState(searchParams.get("search") || "");

  const page = Number(searchParams.get("page")) || 1;
  const category = searchParams.get("category") || null;
  const sort = searchParams.get("sort") || "newest";
  const search = searchParams.get("search") || "";

  const { data, isLoading, isError, error } = useGetPostsQuery({
    page,
    category,
    sort,
    search,
    limit: 12,
  });

  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.categories || [];

  const posts = data?.posts || [];
  const totalPages = data?.pages || 1;
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

  const handleSearchChange = (value) => {
    setLocalSearch(value);
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (value) {
        newParams.set("search", value);
      } else {
        newParams.delete("search");
      }
      newParams.set("page", "1");
      return newParams;
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-slate-800/50 rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="h-56 bg-slate-700/50"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-slate-700/50 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-700/50 rounded w-full"></div>
                  <div className="h-3 bg-slate-700/50 rounded w-5/6"></div>
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
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Failed to Load Posts
          </h2>
          <p className="text-gray-400 mb-6">
            {error?.data?.message || "Please try again later"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 backdrop-blur-sm text-emerald-400 rounded-full mb-4 border border-emerald-500/20">
            <Sparkles size={16} className="animate-pulse" />
            <span className="text-sm font-medium">
              Discover Amazing Content
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
              Blog
            </span>
            {" "}
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Posts
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Explore <span className="text-emerald-400 font-semibold">{totalPosts.toLocaleString()}</span> insightful articles on
            technology, development, and innovation
          </p>
        </div>

        {/* Filters */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-white/10 p-6 mb-8 shadow-xl">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0 gap-4">
            {/* Search */}
            <div className="w-full lg:w-1/3">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={localSearch}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-gray-500 text-sm transition-all"
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Category Filter */}
              <div className="relative group">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-emerald-400 transition-colors pointer-events-none" />
                <select
                  value={category || ""}
                  onChange={(e) => handleCategoryChange(e.target.value || null)}
                  className="pl-10 pr-8 py-2.5 bg-slate-900/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-emerald-500 text-white text-sm appearance-none cursor-pointer hover:border-emerald-500/50 transition-all"
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
                      ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg"
                      : "text-gray-400 hover:bg-slate-800/50 border border-white/10"
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Newest</span>
                </button>
                <button
                  onClick={() => handleSortChange("popular")}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    sort === "popular"
                      ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg"
                      : "text-gray-400 hover:bg-slate-800/50 border border-white/10"
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Popular</span>
                </button>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 rounded-xl transition-all ${
                    viewMode === "grid"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "text-gray-400 hover:text-white hover:bg-slate-800/50"
                  }`}
                  aria-label="Grid view"
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 rounded-xl transition-all ${
                    viewMode === "list"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "text-gray-400 hover:text-white hover:bg-slate-800/50"
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
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-white/10 p-12 text-center shadow-xl">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              No posts found
            </h3>
            <p className="text-gray-400 mb-6">
              {localSearch
                ? "No posts match your search. Try different keywords."
                : category
                ? "No posts found in this category. Try another category or clear filters."
                : "No posts available yet. Check back soon!"}
            </p>
            {(category || localSearch) && (
              <button
                onClick={() => {
                  handleCategoryChange(null);
                  setLocalSearch("");
                }}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium rounded-xl hover:shadow-lg transition-all"
              >
                Clear Filters
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
                <Link
                  key={post._id}
                  to={`/blog/${encodeURIComponent(post.slug?.current || post.slug)}`}
                  className={`group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-white/10 hover:border-emerald-500/50 ${
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
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                    {post.categories?.length > 0 && (
                      <span className="absolute top-4 left-4 px-3 py-1 bg-emerald-500/20 backdrop-blur-sm text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30">
                        {typeof post.categories[0] === 'string' ? post.categories[0] : post.categories[0].title}
                      </span>
                    )}
                  </div>

                  <div
                    className={`p-6 ${viewMode === "list" ? "md:w-2/3 flex flex-col justify-between" : ""}`}
                  >
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-gray-400 mb-4 line-clamp-2">
                        {post.excerpt ||
                          post.aiSummary ||
                          "Read this article to learn more..."}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        {post.author?.image?.url ? (
                          <img
                            src={post.author.image.url}
                            alt={post.author.name}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <span className="text-gray-400 font-medium">
                          {post.author?.name || "Anonymous"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-500">
                        {post.views && (
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {post.views > 1000 ? `${(post.views/1000).toFixed(1)}k` : post.views}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readingTime || post.estimatedReadingTime || 5}m
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl">
                <div className="text-sm text-gray-400">
                  Showing page{" "}
                  <span className="font-bold text-emerald-400">{page}</span> of{" "}
                  <span className="font-bold text-emerald-400">
                    {totalPages}
                  </span>{" "}
                  •{" "}
                  <span className="font-bold text-emerald-400">
                    {totalPosts.toLocaleString()}
                  </span>{" "}
                  total posts
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="px-5 py-2.5 border border-white/10 rounded-xl hover:bg-slate-800/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-white"
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
                            ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg scale-110"
                            : "hover:bg-slate-800/50 text-gray-400 border border-white/10"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="px-5 py-2.5 border border-white/10 rounded-xl hover:bg-slate-800/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-white"
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