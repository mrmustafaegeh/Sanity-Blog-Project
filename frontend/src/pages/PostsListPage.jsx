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
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useRef } from "react";
import PostCard from "../features/posts/components/PostCard";

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

  const headerRef = useScrollReveal({ delay: 100 }, 'left');
  const gridRef = useScrollReveal({ delay: 300 }, 'right');

  if (isLoading) {
    return (
      <div className="min-h-screen">
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
      <div className="min-h-screen flex items-center justify-center">
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
    <div className="min-h-screen">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div ref={headerRef} className="mb-12 text-center">
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
        <div className="bg-slate-800/50 backdrop-blur-md rounded-3xl border border-white/10 p-6 mb-8 shadow-xl transform-gpu">
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
        <div ref={gridRef}>
          {posts.length === 0 ? (
          <div className="bg-slate-800/50 backdrop-blur-md rounded-3xl border border-white/10 p-12 text-center shadow-xl transform-gpu">
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
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  : "space-y-8"
              } mb-12`}
            >
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl transform-gpu">
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
    </div>
  );
}