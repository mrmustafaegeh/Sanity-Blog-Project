// frontend/src/components/SearchBar.jsx
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSearchPostsQuery } from "../../api/postsAPI";
import { Search, X, Clock, TrendingUp } from "lucide-react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounced(query.trim());
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const {
    data: results = [],
    isFetching,
    error,
  } = useSearchPostsQuery(debounced, {
    skip: debounced.length < 2,
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (searchQuery) => {
    if (searchQuery.trim()) {
      // Save to recent searches
      const updated = [
        searchQuery,
        ...recentSearches.filter((s) => s !== searchQuery),
      ].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem("recentSearches", JSON.stringify(updated));

      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsOpen(false);
      setQuery("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(query);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setIsOpen(false);
  };

  const removeRecentSearch = (index, e) => {
    e.stopPropagation();
    const updated = [...recentSearches];
    updated.splice(index, 1);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-lg">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          placeholder="Search articles, tutorials, guides..."
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Search Dropdown */}
      {isOpen && (query || recentSearches.length > 0) && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-fade-in">
          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-gray-500 flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>Recent Searches</span>
                </h3>
                <button
                  onClick={() => {
                    setRecentSearches([]);
                    localStorage.removeItem("recentSearches");
                  }}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Clear all
                </button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between group"
                  >
                    <button
                      onClick={() => handleSearch(search)}
                      className="flex-1 text-left px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded"
                    >
                      {search}
                    </button>
                    <button
                      onClick={(e) => removeRecentSearch(index, e)}
                      className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-100 rounded"
                    >
                      <X className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trending Searches */}
          {!query && (
            <div className="p-3 border-b border-gray-100">
              <h3 className="text-xs font-semibold text-gray-500 flex items-center space-x-1 mb-2">
                <TrendingUp className="w-3 h-3" />
                <span>Trending Now</span>
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "React 2024",
                  "AI Development",
                  "Tailwind CSS",
                  "Sanity CMS",
                ].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleSearch(tag)}
                    className="px-2.5 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {query && (
            <div className="max-h-96 overflow-y-auto">
              {isFetching ? (
                <div className="p-4 text-center">
                  <div className="animate-spin w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto" />
                  <p className="text-sm text-gray-500 mt-2">Searching...</p>
                </div>
              ) : error ? (
                <div className="p-4 text-center text-red-500 text-sm">
                  Failed to load results
                </div>
              ) : results.length > 0 ? (
                <div>
                  <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                    <p className="text-xs font-medium text-gray-500">
                      Found {results.length} result
                      {results.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  {results.map((post) => (
                    <Link
                      key={post.slug.current}
                      to={`/blog/${post.slug.current}`}
                      onClick={() => {
                        setIsOpen(false);
                        setQuery("");
                      }}
                      className="block px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                    >
                      <h4 className="font-medium text-gray-900 group-hover:text-emerald-600">
                        {post.title}
                      </h4>
                      {post.excerpt && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center space-x-3 mt-2">
                        <span className="text-xs text-gray-400">
                          {post.author?.name || "Anonymous"}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-400">
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </Link>
                  ))}
                  <button
                    onClick={() => handleSearch(query)}
                    className="w-full p-3 text-center text-emerald-600 font-medium hover:bg-emerald-50 border-t border-gray-100"
                  >
                    View all results for "{query}"
                  </button>
                </div>
              ) : debounced.length >= 2 ? (
                <div className="p-6 text-center">
                  <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">
                    No results found for "{query}"
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Try different keywords
                  </p>
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
