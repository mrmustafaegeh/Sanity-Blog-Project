// frontend/src/pages/CategoriesPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useGetCategoriesQuery } from "../api/postsAPI";
import {
  Search,
  TrendingUp,
  Clock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Zap,
} from "lucide-react";

function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function CategoriesPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popular"); // default is meaningful
  const [page, setPage] = useState(1);
  const limit = 12;

  const debouncedSearch = useDebouncedValue(search, 300);

  const { data, isLoading, isError } = useGetCategoriesQuery(
    { page, limit },
    { refetchOnMountOrArgChange: false }
  );

  const categories = data?.categories || [];
  const totalPages = data?.pages || 1;

  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    const base = !q
      ? categories
      : categories.filter((cat) => {
          const t = (cat.title || "").toLowerCase();
          const d = (cat.description || "").toLowerCase();
          return t.includes(q) || d.includes(q);
        });

    if (sort === "popular")
      return [...base].sort((a, b) => (b.postCount || 0) - (a.postCount || 0));
    if (sort === "recent")
      return [...base].sort(
        (a, b) => new Date(b._createdAt) - new Date(a._createdAt)
      );
    return base;
  }, [categories, debouncedSearch, sort]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-48 bg-slate-800/50 rounded-2xl animate-pulse"
              />
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
          <p className="text-red-400 mb-4">Failed to load categories</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Search + Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search categories..."
              className="w-full pl-10 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setSort("popular")}
              className={`px-4 py-3 rounded-xl flex items-center gap-2 transition-all ${
                sort === "popular"
                  ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg"
                  : "bg-slate-900/50 text-gray-400 border border-white/10 hover:border-emerald-500/50"
              }`}
            >
              <TrendingUp size={16} /> Popular
            </button>

            <button
              onClick={() => setSort("recent")}
              className={`px-4 py-3 rounded-xl flex items-center gap-2 transition-all ${
                sort === "recent"
                  ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg"
                  : "bg-slate-900/50 text-gray-400 border border-white/10 hover:border-emerald-500/50"
              }`}
            >
              <Clock size={16} /> Recent
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 backdrop-blur-sm text-emerald-400 rounded-full mb-6 border border-emerald-500/20">
            <Sparkles size={16} className="animate-pulse" />
            <span className="text-sm font-medium">Explore by Category</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
              Browse
            </span>{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Categories
            </span>
          </h1>
          <p className="text-gray-400 mt-2">Discover articles by topic</p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {filtered.map((cat) => (
            <Link
              key={cat._id}
              to={`/categories/${cat.slug?.current || cat.slug}`}
              className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-emerald-500/50 hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-cyan-500/0 group-hover:from-emerald-500/10 group-hover:to-cyan-500/10 transition-all duration-300" />

              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="w-7 h-7 text-emerald-400" />
                </div>

                <h3 className="font-bold text-white text-xl mb-2">
                  {cat.title}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                  {cat.description || "Explore posts in this category"}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <span className="text-xs text-gray-500 font-medium">
                    {cat.postCount || 0} articles
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-3 border border-white/10 rounded-xl hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-gray-400"
              aria-label="Previous page"
            >
              <ChevronLeft />
            </button>

            <span className="font-medium text-white">
              Page <span className="text-emerald-400">{page}</span> of{" "}
              <span className="text-emerald-400">{totalPages}</span>
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-3 border border-white/10 rounded-xl hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-gray-400"
              aria-label="Next page"
            >
              <ChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
