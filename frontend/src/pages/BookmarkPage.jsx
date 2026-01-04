// frontend/src/pages/BookmarkPage.jsx
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Bookmark,
  BookmarkCheck,
  Calendar,
  Clock,
  Eye,
  Heart,
  MessageSquare,
  Search,
  Filter,
  Grid,
  List,
  Trash2,
  FolderOpen,
  Tag,
  User,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function BookmarkPage() {
  const { user, token } = useSelector((state) => state.auth);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [selectedTags, setSelectedTags] = useState([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    read: 0,
    unread: 0,
    byCategory: {},
  });

  // Available categories/tags (you can fetch these from API)
  const availableTags = [
    "Technology",
    "Programming",
    "Design",
    "AI",
    "Web Development",
    "Mobile",
    "DevOps",
    "Security",
    "Productivity",
    "Career",
  ];

  // Mock data - Replace with API call
  const mockBookmarks = [
    {
      id: "1",
      title:
        "The Hidden Power of Offline AI: What Happens When the Internet Goes Dark?",
      excerpt:
        "Discover how AI models can function without internet connectivity and their real-world applications...",
      author: "Alex Johnson",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      readTime: "8 min read",
      date: "2024-01-15",
      tags: ["AI", "Technology", "Future"],
      image:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      isRead: true,
      likes: 245,
      comments: 42,
      views: 1250,
    },
    {
      id: "2",
      title: "10 Tips for Improving Your Frontend Development Skills in 2024",
      excerpt:
        "Essential techniques and resources to level up your frontend development game...",
      author: "Sarah Miller",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      readTime: "6 min read",
      date: "2024-01-10",
      tags: ["Web Development", "Programming", "Frontend"],
      image:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      isRead: false,
      likes: 189,
      comments: 31,
      views: 890,
    },
    {
      id: "3",
      title: "Building Scalable APIs with Node.js and Express",
      excerpt:
        "Learn how to design and build robust APIs that can handle millions of requests...",
      author: "Mike Chen",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      readTime: "12 min read",
      date: "2024-01-05",
      tags: ["Backend", "Node.js", "API"],
      image:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      isRead: true,
      likes: 312,
      comments: 56,
      views: 2100,
    },
    {
      id: "4",
      title: "The Future of React: What's Coming in 2024",
      excerpt:
        "Explore the upcoming features and improvements in the React ecosystem...",
      author: "Emma Wilson",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      readTime: "5 min read",
      date: "2024-01-03",
      tags: ["React", "Frontend", "JavaScript"],
      image:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      isRead: false,
      likes: 167,
      comments: 28,
      views: 750,
    },
    {
      id: "5",
      title: "Mastering TypeScript: Advanced Patterns and Techniques",
      excerpt:
        "Take your TypeScript skills to the next level with these advanced patterns...",
      author: "David Park",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      readTime: "15 min read",
      date: "2023-12-28",
      tags: ["TypeScript", "Programming", "Best Practices"],
      image:
        "https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      isRead: true,
      likes: 421,
      comments: 89,
      views: 3200,
    },
    {
      id: "6",
      title: "The Art of Clean Code: Writing Maintainable JavaScript",
      excerpt:
        "Principles and patterns for writing JavaScript code that's easy to maintain...",
      author: "Lisa Wong",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
      readTime: "10 min read",
      date: "2023-12-20",
      tags: ["JavaScript", "Clean Code", "Best Practices"],
      image:
        "https://images.unsplash.com/photo-1581276879432-15e50529f34b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      isRead: false,
      likes: 298,
      comments: 67,
      views: 1950,
    },
  ];

  useEffect(() => {
    // Simulate API call
    const fetchBookmarks = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API call
        // const response = await fetch(`${import.meta.env.VITE_API_URL}/bookmarks`, {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // const data = await response.json();

        await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate loading

        setBookmarks(mockBookmarks);
        setFilteredBookmarks(mockBookmarks);

        // Calculate stats
        const total = mockBookmarks.length;
        const read = mockBookmarks.filter((b) => b.isRead).length;
        const unread = total - read;

        // Count by tags
        const byCategory = {};
        mockBookmarks.forEach((bookmark) => {
          bookmark.tags.forEach((tag) => {
            byCategory[tag] = (byCategory[tag] || 0) + 1;
          });
        });

        setStats({ total, read, unread, byCategory });
      } catch (error) {
        console.error("Failed to fetch bookmarks:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBookmarks();
    }
  }, [user, token]);

  useEffect(() => {
    let filtered = bookmarks;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (bookmark) =>
          bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bookmark.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bookmark.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((bookmark) =>
        selectedTags.some((tag) => bookmark.tags.includes(tag))
      );
    }

    setFilteredBookmarks(filtered);
  }, [searchTerm, selectedTags, bookmarks]);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const removeBookmark = async (bookmarkId) => {
    try {
      // TODO: Replace with actual API call
      // await fetch(`${import.meta.env.VITE_API_URL}/bookmarks/${bookmarkId}`, {
      //   method: "DELETE",
      //   headers: { Authorization: `Bearer ${token}` }
      // });

      setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));
    } catch (error) {
      console.error("Failed to remove bookmark:", error);
    }
  };

  const toggleReadStatus = async (bookmarkId) => {
    try {
      // TODO: Replace with actual API call
      // await fetch(`${import.meta.env.VITE_API_URL}/bookmarks/${bookmarkId}/read`, {
      //   method: "PATCH",
      //   headers: { Authorization: `Bearer ${token}` }
      // });

      setBookmarks((prev) =>
        prev.map((b) => (b.id === bookmarkId ? { ...b, isRead: !b.isRead } : b))
      );
    } catch (error) {
      console.error("Failed to toggle read status:", error);
    }
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedTags([]);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Sign In Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please sign in to view and manage your bookmarks.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/login"
              className="px-6 py-2 bg-gradient-to-r from-[#7fd3e6] to-[#12725c] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#7fd3e6] to-[#12725c] text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                <BookmarkCheck className="w-8 h-8" />
                My Bookmarks
              </h1>
              <p className="text-lg opacity-90">
                Saved articles and resources for later reading
              </p>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center gap-2 text-white/80">
                <FolderOpen className="w-5 h-5" />
                <span className="text-lg font-semibold">
                  {bookmarks.length}
                </span>
                <span>Saved Items</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Saved</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.total}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Bookmark className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Read</p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">
                  {stats.read}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <BookmarkCheck className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Unread</p>
                <p className="text-3xl font-bold text-amber-600 mt-1">
                  {stats.unread}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search bookmarks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-4">
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-2 ${viewMode === "grid" ? "bg-gray-100 text-gray-900" : "text-gray-600"}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-2 ${viewMode === "list" ? "bg-gray-100 text-gray-900" : "text-gray-600"}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              {/* Clear Filters */}
              {(searchTerm || selectedTags.length > 0) && (
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Tags Filter */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Filter by Tags
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedTags.includes(tag)
                      ? "bg-gradient-to-r from-[#7fd3e6] to-[#12725c] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tag} {stats.byCategory[tag] && `(${stats.byCategory[tag]})`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bookmarks Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
        ) : filteredBookmarks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || selectedTags.length > 0
                ? "No matching bookmarks"
                : "No bookmarks yet"}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm || selectedTags.length > 0
                ? "Try adjusting your search or filter criteria"
                : "Start saving articles you want to read later by clicking the bookmark icon on any post"}
            </p>
            {searchTerm || selectedTags.length > 0 ? (
              <button
                onClick={clearAllFilters}
                className="px-6 py-2 bg-gradient-to-r from-[#7fd3e6] to-[#12725c] text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Clear All Filters
              </button>
            ) : (
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#7fd3e6] to-[#12725c] text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Browse Articles
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {filteredBookmarks.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {bookmarks.length}
                </span>{" "}
                bookmarks
              </p>
            </div>

            {/* Bookmarks Grid/List */}
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {filteredBookmarks.map((bookmark) => (
                <div
                  key={bookmark.id}
                  className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow ${
                    viewMode === "list" ? "flex" : ""
                  }`}
                >
                  {/* Image */}
                  <div
                    className={`relative ${viewMode === "list" ? "w-48 flex-shrink-0" : "h-48"}`}
                  >
                    <img
                      src={bookmark.image}
                      alt={bookmark.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => toggleReadStatus(bookmark.id)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          bookmark.isRead
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                        title={
                          bookmark.isRead ? "Mark as unread" : "Mark as read"
                        }
                      >
                        {bookmark.isRead ? (
                          <BookmarkCheck className="w-4 h-4" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {bookmark.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      <Link
                        to={`/post/${bookmark.id}`}
                        className="hover:text-emerald-600 transition-colors"
                      >
                        {bookmark.title}
                      </Link>
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {bookmark.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={bookmark.authorAvatar}
                          alt={bookmark.author}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {bookmark.author}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {bookmark.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {bookmark.readTime}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {bookmark.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            {bookmark.comments}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {bookmark.views}
                          </span>
                        </div>

                        <button
                          onClick={() => removeBookmark(bookmark.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Remove bookmark"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
