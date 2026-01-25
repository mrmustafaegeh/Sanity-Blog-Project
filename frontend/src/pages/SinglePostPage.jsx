import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { PortableText } from "@portabletext/react";
import {
  useGetPostBySlugQuery,
  useIncrementViewCountMutation,
  useGenerateAISummaryMutation,
} from "../api/postsAPI";
import { useToggleLikeMutation } from "../api/likesAPI";
import { useToggleBookmarkMutation } from "../api/usersAPI";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Heart,
  Share2,
  Bookmark,
  Eye,
  Sparkles,
  Twitter,
  Facebook,
  Linkedin,
  Copy,
  BookmarkCheck,
  Loader2,
} from "lucide-react";
import CommentSection from "../components/blog/CommentSection";
import AuthorBio from "../components/blog/AuthorBio";
import SanityImage from "../components/ui/SanityImage";
import { useScrollReveal } from "../hooks/useScrollReveal";

export default function SinglePostPage() {
  const contentRef = useScrollReveal({ delay: 100 }, "left");
  const sidebarRef = useScrollReveal({ delay: 200 }, "right");
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [displayedSummary, setDisplayedSummary] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const {
    data: post,
    isLoading,
    isError,
  } = useGetPostBySlugQuery(slug, {
    skip: !slug,
    refetchOnMountOrArgChange: true,
  });

  const [incrementView] = useIncrementViewCountMutation();
  const [toggleLike, { isLoading: liking }] = useToggleLikeMutation();
  const [toggleBookmark, { isLoading: bookmarking }] =
    useToggleBookmarkMutation();
  const [generateAISummary, { isLoading: isGeneratingSummary }] =
    useGenerateAISummaryMutation();
  const [generatedSummary, setGeneratedSummary] = useState(null);

  // Initialize like and bookmark status
  useEffect(() => {
    if (post && user?._id) {
      const userId = user._id.toString();
      setIsLiked(
        post.likes?.some((id) => id?.toString() === userId) || false
      );
      const isBookmarkedInUser = user.bookmarks?.some(
        (id) => id?.toString() === post._id?.toString()
      );
      setIsBookmarked(!!(isBookmarkedInUser || post.isBookmarked));
    } else {
      setIsLiked(false);
      setIsBookmarked(false);
    }
  }, [post, user]);

  // AI Summary Typing Effect
  useEffect(() => {
    const currentSummary = generatedSummary || post?.aiSummary;
    if (
      showSummary &&
      currentSummary &&
      displayedSummary.length < currentSummary.length
    ) {
      setIsTyping(true);
      const timeout = setTimeout(() => {
        setDisplayedSummary(
          currentSummary.slice(0, displayedSummary.length + 1)
        );
      }, 20);
      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
    }
  }, [showSummary, displayedSummary, post?.aiSummary, generatedSummary]);

  // Scroll Progress Logic
  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollProgress = document.getElementById("scroll-progress");
      if (scrollProgress) {
        const totalHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        scrollProgress.style.width = `${progress}%`;
      }
    };
    window.addEventListener("scroll", updateScrollProgress);
    return () => window.removeEventListener("scroll", updateScrollProgress);
  }, []);

  // Increment view count
  useEffect(() => {
    if (post?._id) {
      incrementView(post._id);
    }
  }, [post?._id, incrementView]);

  // Handle like
  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.info("Please login to like this post");
      navigate("/login");
      return;
    }
    try {
      await toggleLike(post._id).unwrap();
      setIsLiked(!isLiked);
      toast.success(isLiked ? "Removed from likes" : "Added to likes");
    } catch {
      toast.error("Action failed");
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      toast.info("Please login to bookmark posts");
      navigate("/login");
      return;
    }
    try {
      await toggleBookmark(post._id).unwrap();
      setIsBookmarked(!isBookmarked);
      toast.success(
        isBookmarked ? "Removed from bookmarks" : "Added to bookmarks"
      );
    } catch {
      toast.error("Failed to update bookmark");
    }
  };

  const handleGenerateSummary = async () => {
    try {
      const result = await generateAISummary(post._id).unwrap();
      setGeneratedSummary(result.aiSummary || result.post?.aiSummary);
      toast.success("AI Summary generated successfully!");
      setShowSummary(true);
      setDisplayedSummary(""); // Reset for typing effect
    } catch (err) {
      toast.error(err?.data?.message || "Failed to generate summary");
    }
  };

  // Share functionality
  const share = (platform) => {
    const url = window.location.href;
    const title = encodeURIComponent(post?.title || "");
    const links = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`,
    };
    window.open(links[platform], "_blank", "width=600,height=400");
    setShowShareMenu(false);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
    setShowShareMenu(false);
  };

  // PortableText components
  const ptComponents = {
    block: {
      h2: ({ children }) => (
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-10 mb-5">
          {children}
        </h3>
      ),
      h4: ({ children }) => (
        <h4 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mt-8 mb-4">
          {children}
        </h4>
      ),
      blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-emerald-500 dark:border-emerald-400 pl-6 my-8 italic text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 py-4 rounded-r-lg">
          {children}
        </blockquote>
      ),
      normal: ({ children }) => (
        <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
          {children}
        </p>
      ),
    },
    marks: {
      link: ({ children, value }) => {
        const rel = !value.href.startsWith("/")
          ? "noreferrer noopener"
          : undefined;
        return (
          <a
            href={value.href}
            rel={rel}
            target={value.href.startsWith("/") ? "_self" : "_blank"}
            className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline decoration-emerald-300 dark:decoration-emerald-600 underline-offset-2"
          >
            {children}
          </a>
        );
      },
      strong: ({ children }) => (
        <strong className="font-bold text-slate-900 dark:text-white">
          {children}
        </strong>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className="list-disc list-inside space-y-2 my-6 text-slate-700 dark:text-slate-300">
          {children}
        </ul>
      ),
      number: ({ children }) => (
        <ol className="list-decimal list-inside space-y-2 my-6 text-slate-700 dark:text-slate-300">
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
      number: ({ children }) => <li className="leading-relaxed">{children}</li>,
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600 dark:text-emerald-400 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Loading amazing content...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">😔</div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Post Not Found
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            The article you're looking for seems to have vanished into thin air.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white rounded-xl font-semibold transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const readingTime = post.estimatedReadingTime || post.readingTime || 5;
  const likesCount =
    (post.likesCount || post.likes?.length || 0) +
    (isLiked && !post.likes?.includes(user?._id) ? 1 : 0) -
    (!isLiked && post.likes?.includes(user?._id) ? 1 : 0);
  const viewsCount = post.views || post.viewCount || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Scroll Progress */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-200 dark:bg-slate-800 z-50">
        <div
          id="scroll-progress"
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-400 transition-all duration-150"
          style={{ width: "0%" }}
        />
      </div>

      {/* Hero Section */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <SanityImage
            image={post.mainImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/90 dark:from-black/80 dark:via-black/60 dark:to-black/95" />
        </div>

        {/* Navigation */}
        <div className="relative z-10 container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link
              to="/blog"
              className="flex items-center gap-2 px-4 py-2 bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-full text-white hover:bg-white/20 dark:hover:bg-white/10 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">Back</span>
            </Link>

            <button
              onClick={handleBookmark}
              disabled={bookmarking}
              className="p-3 bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-full text-white hover:bg-white/20 dark:hover:bg-white/10 transition-all"
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-5 h-5" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 h-full flex items-end pb-16">
          <div className="max-w-4xl">
            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-6">
              {post.categories?.map((cat, i) => (
                <span
                  key={i}
                  className="px-4 py-1.5 bg-emerald-500/20 dark:bg-emerald-400/20 backdrop-blur-sm border border-emerald-400/30 dark:border-emerald-300/30 text-emerald-100 dark:text-emerald-300 rounded-full text-sm font-medium"
                >
                  {cat.title || cat}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-white/90 dark:text-white/80">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span className="font-medium">
                  {post.author?.name || "Anonymous"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>
                  {new Date(
                    post.publishedAt || post.createdAt
                  ).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{readingTime} min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                <span>{viewsCount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Article Content */}
          <div ref={contentRef} className="lg:col-span-8">
            {/* AI Summary Section */}
            {(post.aiSummary || generatedSummary) && (
              <div className="mb-12 p-8 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl">
                    <Sparkles className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      AI-Generated Summary
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Quick overview powered by artificial intelligence
                    </p>
                  </div>
                </div>

                {!showSummary ? (
                  <button
                    onClick={() => setShowSummary(true)}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    View AI Summary
                  </button>
                ) : (
                  <div className="space-y-4">
                    <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                      {displayedSummary}
                      {isTyping && (
                        <span className="inline-block w-1 h-5 bg-emerald-600 dark:bg-emerald-400 ml-1 animate-pulse" />
                      )}
                    </p>
                    <button
                      onClick={() => {
                        setShowSummary(false);
                        setDisplayedSummary("");
                      }}
                      className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
                    >
                      Hide Summary
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Generate Summary Button (Admin Only) */}
            {!post.aiSummary && !generatedSummary && user?.role === "admin" && (
              <div className="mb-12 p-8 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-slate-200 dark:bg-slate-700 rounded-xl">
                    <Sparkles className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      Generate AI Summary
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      Create an AI-powered summary for this article
                    </p>
                    <button
                      onClick={handleGenerateSummary}
                      disabled={isGeneratingSummary}
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white rounded-xl font-semibold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGeneratingSummary ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          Generate Now
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Article Body */}
            <article className="prose prose-lg dark:prose-invert max-w-none">
              {post.body && <PortableText value={post.body} components={ptComponents} />}
              {post.content && (
                <div
                  className="text-slate-700 dark:text-slate-300"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              )}
            </article>

            {/* Engagement Actions */}
            <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleLike}
                    disabled={liking}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                      isLiked
                        ? "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border-2 border-rose-200 dark:border-rose-800"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 hover:border-rose-200 dark:hover:border-rose-800"
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
                    />
                    <span>{likesCount}</span>
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-semibold hover:border-emerald-200 dark:hover:border-emerald-800 transition-all"
                    >
                      <Share2 className="w-5 h-5" />
                      <span>Share</span>
                    </button>

                    {showShareMenu && (
                      <div className="absolute top-full mt-2 left-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-2 min-w-[200px] z-20">
                        <button
                          onClick={() => share("twitter")}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors text-left"
                        >
                          <Twitter className="w-5 h-5 text-blue-400" />
                          <span className="text-slate-700 dark:text-slate-300">
                            Twitter
                          </span>
                        </button>
                        <button
                          onClick={() => share("facebook")}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors text-left"
                        >
                          <Facebook className="w-5 h-5 text-blue-600" />
                          <span className="text-slate-700 dark:text-slate-300">
                            Facebook
                          </span>
                        </button>
                        <button
                          onClick={() => share("linkedin")}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors text-left"
                        >
                          <Linkedin className="w-5 h-5 text-blue-700" />
                          <span className="text-slate-700 dark:text-slate-300">
                            LinkedIn
                          </span>
                        </button>
                        <button
                          onClick={copyLink}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors text-left"
                        >
                          <Copy className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                          <span className="text-slate-700 dark:text-slate-300">
                            Copy Link
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Author Bio */}
            {post.author && (
              <div className="mt-16">
                <AuthorBio author={post.author} />
              </div>
            )}

            {/* Comments */}
            <div className="mt-16">
              <CommentSection postId={post._id} />
            </div>
          </div>

          {/* Sidebar */}
          <aside ref={sidebarRef} className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* Quick Stats */}
              <div className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  Article Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      Views
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {viewsCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      Likes
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {likesCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      Read Time
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {readingTime} min
                    </span>
                  </div>
                </div>
              </div>

              {/* Newsletter CTA */}
              <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Never miss a beat
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Join our newsletter for weekly insights
                </p>
                <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white rounded-xl font-semibold transition-all">
                  Subscribe Now
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-700 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Hungry for more?
          </h2>
          <p className="text-emerald-100 dark:text-emerald-200 mb-8 max-w-2xl mx-auto">
            Explore our curated collection of articles hand-picked to help you
            grow.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-600 rounded-xl font-bold hover:shadow-xl transition-all"
          >
            Explore Blogify
          </Link>
        </div>
      </div>
    </div>
  );
}