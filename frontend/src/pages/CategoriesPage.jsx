import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetCategoriesQuery } from "../api/postsAPI";
import {
  Search,
  TrendingUp,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import LoadingGrid from "../components/ui/LoadingGrid";
import ErrorState from "../components/ui/ErrorState";

const CategoriesPage = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 8;

  const { data, isLoading, isError } = useGetCategoriesQuery({
    page,
    limit,
  });

  const categories = data?.categories || [];
  const totalPages = data?.pages || 1;

  const filtered = categories
    .filter((cat) => {
      const q = search.toLowerCase();
      return (
        !search ||
        cat.title?.toLowerCase().includes(q) ||
        cat.description?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sort === "popular") return (b.postCount || 0) - (a.postCount || 0);
      if (sort === "recent")
        return new Date(b._createdAt) - new Date(a._createdAt);
      return 0;
    });

  if (isLoading) return <LoadingGrid count={8} />;
  if (isError) return <ErrorState message="Failed to load categories" />;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-2">Explore topics by category</p>
        </div>

        {/* SEARCH + SORT */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories..."
              className="w-full pl-10 py-2 rounded-lg border"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setSort("popular")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                sort === "popular"
                  ? "bg-emerald-600 text-white"
                  : "bg-white border"
              }`}
            >
              <TrendingUp size={16} /> Popular
            </button>

            <button
              onClick={() => setSort("recent")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                sort === "recent"
                  ? "bg-emerald-600 text-white"
                  : "bg-white border"
              }`}
            >
              <Clock size={16} /> Recent
            </button>
          </div>
        </div>

        {/* GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((cat) => (
            <Link
              key={cat._id}
              to={`/categories/${cat.slug?.current}`}
              className="bg-white p-6 rounded-xl border hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-lg mb-2">{cat.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {cat.description || "Explore posts in this category"}
              </p>
              <div className="mt-4 text-xs text-gray-500">
                {cat.postCount} posts
              </div>
            </Link>
          ))}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center items-center gap-4 mt-12">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="p-2 border rounded disabled:opacity-50"
          >
            <ChevronLeft />
          </button>

          <span className="font-medium">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="p-2 border rounded disabled:opacity-50"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
