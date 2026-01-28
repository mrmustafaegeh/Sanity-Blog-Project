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
  ArrowRight,
  Zap,
} from "lucide-react";
import Button from "../components/ui/Button";
import clsx from "clsx";

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
  const [sort, setSort] = useState("popular");
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
      <div className="min-h-screen bg-background">
        <div className="max-w-[1400px] mx-auto px-6 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-48 bg-neutral-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        
        {/* Header */}
        <div className="mb-12">
           <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
              Browse Topics
           </h1>
           <p className="text-lg text-secondary">
              Find articles by category.
           </p>
        </div>

        {/* Search + Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 border-b border-border pb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search categories..."
              className="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-lg text-primary placeholder-tertiary focus:ring-1 focus:ring-primary focus:border-primary text-sm"
            />
          </div>

          <div className="flex gap-2">
            <button
               onClick={() => setSort("popular")}
               className={clsx(
                   "px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-transparent",
                   sort === "popular" ? "bg-neutral-100 text-primary border-border" : "text-secondary hover:text-primary"
               )}
            >
               Popular
            </button>
            <button
               onClick={() => setSort("recent")}
               className={clsx(
                   "px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-transparent",
                   sort === "recent" ? "bg-neutral-100 text-primary border-border" : "text-secondary hover:text-primary"
               )}
            >
               Recent
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {filtered.map((cat) => (
            <Link
              key={cat._id}
              to={`/categories/${(cat.slug?.current || cat.slug || "").toLowerCase()}`}
              className="group relative bg-surface p-6 rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all duration-300 block"
            >
              <div className="flex items-center justify-between mb-4">
                 <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Zap className="w-5 h-5" />
                 </div>
                 <span className="text-xs font-semibold text-secondary bg-neutral-50 px-2 py-1 rounded border border-border">
                    {cat.postCount || 0}
                 </span>
              </div>

              <h3 className="font-bold text-primary text-xl mb-2 group-hover:text-primary transition-colors">
                {cat.title}
              </h3>
              <p className="text-sm text-secondary line-clamp-2 mb-4 h-10">
                {cat.description || "Explore posts in this category"}
              </p>

              <div className="flex items-center text-xs font-medium text-primary group-hover:underline">
                 View Articles <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>

            <span className="text-sm font-medium text-secondary">
              Page {page} of {totalPages}
            </span>

            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
