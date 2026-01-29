import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetPostsQuery, useGetCategoriesQuery } from "../api/postsAPI";
import { Search, Filter, Grid, List, Calendar, TrendingUp } from "lucide-react";
import PostCard from "../components/blog/PostCard";

import Button from "../components/ui/Button";
import clsx from "clsx";

function useDebouncedValue(value, delay = 450) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function BlogListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState("grid");

  const page = Number(searchParams.get("page")) || 1;
  const category = searchParams.get("category") || null;
  const sort = searchParams.get("sort") || "newest";

  const initialSearch = searchParams.get("search") || "";
  const [localSearch, setLocalSearch] = useState(initialSearch);
  const debouncedSearch = useDebouncedValue(localSearch, 450);

  // Apply debounced search
  useEffect(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (debouncedSearch) next.set("search", debouncedSearch);
      else next.delete("search");
      next.set("page", "1");
      return next;
    });
  }, [debouncedSearch]);

  const queryArgs = useMemo(
    () => ({
      page,
      category,
      sort,
      search: searchParams.get("search") || "",
      limit: 12,
    }),
    [page, category, sort, searchParams]
  );

  const { data, isLoading, isError, error } = useGetPostsQuery(queryArgs, {
    refetchOnMountOrArgChange: false,
  });

  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.categories || [];

  const posts = data?.posts || [];
  const totalPages = data?.pages || 1;
  const totalPosts = data?.total || 0;

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(newPage));
      return next;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryChange = (categoryId) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (categoryId) next.set("category", categoryId);
      else next.delete("category");
      next.set("page", "1");
      return next;
    });
  };

  const handleSortChange = (sortType) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("sort", sortType);
      next.set("page", "1");
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-[1400px] mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-neutral-100 rounded-xl overflow-hidden aspect-[4/3] animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-2">
            Failed to Load Posts
          </h2>
          <p className="text-secondary mb-6">
            {error?.data?.message || "Please try again later"}
          </p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
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
            All Articles
          </h1>
          <p className="text-lg text-secondary">
             Exploring ideas on ride, technology, and community.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="sticky top-20 z-10 bg-background/95 backdrop-blur-sm border-b border-border pb-6 mb-10 pt-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            
            {/* Search */}
            <div className="relative w-full lg:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary text-primary placeholder-tertiary text-sm transition-all"
                />
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              
              {/* Category */}
              <div className="relative">
                <select
                  value={category || ""}
                  onChange={(e) => handleCategoryChange(e.target.value || null)}
                  className="pl-3 pr-8 py-2.5 bg-surface border border-border rounded-lg focus:ring-1 focus:ring-primary text-primary text-sm appearance-none cursor-pointer hover:border-neutral-300 transition-all min-w-[160px]"
                >
                  <option value="">All Topics</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.title}
                    </option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary pointer-events-none" />
              </div>

              {/* Sort */}
              <div className="flex bg-surface border border-border rounded-lg p-1">
                 <button
                    onClick={() => handleSortChange("newest")}
                    className={clsx(
                        "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                        sort === "newest" ? "bg-primary text-white" : "text-secondary hover:text-primary"
                    )}
                 >
                    Newest
                 </button>
                 <button
                    onClick={() => handleSortChange("popular")}
                    className={clsx(
                        "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                        sort === "popular" ? "bg-primary text-white" : "text-secondary hover:text-primary"
                    )}
                 >
                    Popular
                 </button>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Data */}
        {posts.length === 0 ? (
            <div className="text-center py-20 border border-border border-dashed rounded-xl bg-neutral-50">
              <h3 className="text-xl font-bold text-primary mb-2">
                No articles found
              </h3>
              <p className="text-secondary mb-6">
                Try adjusting your search or filters.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setLocalSearch("");
                  setSearchParams(new URLSearchParams());
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mb-16">
                {posts.map((post) => (
                  // Using inline requirement for PostCard
                  <PostCard key={post._id} post={post} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 border-t border-border pt-8">
                    <Button 
                        variant="outline" 
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                    >
                        Previous
                    </Button>
                    <span className="text-sm font-medium text-secondary">
                        Page {page} of {totalPages}
                    </span>
                    <Button 
                        variant="outline" 
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                    >
                        Next
                    </Button>
                </div>
              )}
            </>
          )}

      </div>
    </div>
  );
}


