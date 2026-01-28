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
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import clsx from "clsx";

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
      setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));
    } catch (error) {
      console.error("Failed to remove bookmark:", error);
    }
  };

  const toggleReadStatus = async (bookmarkId) => {
    try {
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
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-secondary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-primary mb-2">
            Sign In Required
          </h2>
          <p className="text-secondary mb-6">
            Please sign in to view and manage your bookmarks.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/login">
               <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-surface border-b border-border py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-2 flex items-center gap-3">
                <BookmarkCheck className="w-8 h-8 text-primary" />
                Reading List
              </h1>
              <p className="text-lg text-secondary">
                Saved articles for your personal library.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-surface rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary">Total Saved</p>
                <p className="text-3xl font-bold text-primary mt-1">
                  {stats.total}
                </p>
              </div>
              <Bookmark className="w-8 h-8 text-tertiary" />
            </div>
          </div>

          <div className="bg-surface rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary">Read</p>
                <p className="text-3xl font-bold text-primary mt-1">
                  {stats.read}
                </p>
              </div>
              <BookmarkCheck className="w-8 h-8 text-tertiary" />
            </div>
          </div>

          <div className="bg-surface rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary">Unread</p>
                <p className="text-3xl font-bold text-primary mt-1">
                  {stats.unread}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-tertiary" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-background mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1 relative max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
              <input
                type="text"
                placeholder="Search bookmarks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-surface border border-border rounded-lg text-primary placeholder-tertiary focus:ring-1 focus:ring-primary focus:border-primary text-sm"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-4">
              <div className="flex border border-border rounded-lg overflow-hidden bg-surface">
                <button
                  onClick={() => setViewMode("grid")}
                  className={clsx(
                    "px-3 py-2 transition-colors",
                    viewMode === "grid" ? "bg-neutral-100 text-primary" : "text-secondary hover:text-primary"
                  )}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={clsx(
                    "px-3 py-2 transition-colors",
                    viewMode === "list" ? "bg-neutral-100 text-primary" : "text-secondary hover:text-primary"
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

               {(searchTerm || selectedTags.length > 0) && (
                 <button
                   onClick={clearAllFilters}
                   className="text-sm text-primary hover:underline flex items-center gap-1"
                 >
                   <Filter className="w-3 h-3" />
                   Clear Filters
                 </button>
               )}
            </div>
          </div>

          {/* Tags Filter */}
          <div className="flex flex-wrap gap-2">
             {availableTags.map((tag) => (
               <button
                 key={tag}
                 onClick={() => toggleTag(tag)}
                 className={clsx(
                   "px-3 py-1 rounded-full text-xs font-medium transition-colors border",
                   selectedTags.includes(tag)
                     ? "bg-primary text-white border-primary"
                     : "bg-surface text-secondary border-border hover:border-primary"
                 )}
               >
                 {tag}
               </button>
             ))}
          </div>
        </div>

        {/* Bookmarks Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredBookmarks.length === 0 ? (
          <div className="text-center py-16 bg-surface rounded-xl border border-border border-dashed">
            <FolderOpen className="w-12 h-12 text-tertiary mx-auto mb-4" />
            <h3 className="text-lg font-bold text-primary mb-2">
              No bookmarks found
            </h3>
            <p className="text-secondary mb-6 max-w-md mx-auto">
              {searchTerm || selectedTags.length > 0
                ? "Try adjusting your filters."
                : "You haven't saved any articles yet."}
            </p>
            {searchTerm || selectedTags.length > 0 ? (
              <Button onClick={clearAllFilters} variant="outline">
                Clear Filters
              </Button>
            ) : (
              <Link to="/blog">
                <Button>Browse Articles</Button>
              </Link>
            )}
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                : "space-y-4"
            }
          >
            {filteredBookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className={clsx(
                   "group bg-surface rounded-xl border border-border overflow-hidden hover:border-primary/30 transition-colors flex",
                   viewMode === "grid" ? "flex-col" : "flex-row h-40"
                )}
              >
                {/* Image */}
                <div className={clsx("relative bg-neutral-100", viewMode === "grid" ? "aspect-video" : "w-48 shrink-0")}>
                  <img
                    src={bookmark.image}
                    alt={bookmark.title}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => toggleReadStatus(bookmark.id)}
                      className="p-1.5 bg-background/80 backdrop-blur-sm rounded-full text-primary hover:bg-background transition-colors"
                      title={bookmark.isRead ? "Mark as unread" : "Mark as read"}
                    >
                      {bookmark.isRead ? (
                        <BookmarkCheck className="w-4 h-4 fill-current" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {bookmark.tags.slice(0, 2).map((tag) => (
                       <Badge key={tag} variant="neutral" size="sm">{tag}</Badge>
                    ))}
                  </div>

                  <h3 className="text-lg font-bold text-primary mb-2 line-clamp-2 leading-tight">
                    <Link to={`/post/${bookmark.id}`} className="hover:underline">
                      {bookmark.title}
                    </Link>
                  </h3>

                  {viewMode === "grid" && (
                      <p className="text-sm text-secondary line-clamp-2 mb-4">
                        {bookmark.excerpt}
                      </p>
                  )}

                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <img
                        src={bookmark.authorAvatar}
                        alt={bookmark.author}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-xs font-medium text-primary">
                          {bookmark.author}
                      </span>
                    </div>

                    <button
                        onClick={() => removeBookmark(bookmark.id)}
                        className="text-tertiary hover:text-red-600 transition-colors"
                        title="Remove"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
