// frontend/src/pages/SinglePostPage.jsx
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { PortableText } from "@portabletext/react";
import {
  useGetPostBySlugQuery,
  useIncrementViewCountMutation,
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
  MessageCircle,
  Sparkles,
  Twitter,
  Facebook,
  Linkedin,
  Copy,
  ChevronRight,
  BookmarkCheck,
  Loader2,
  Zap,
} from "lucide-react";
import CommentSection from "../components/blog/CommentSection";
import AuthorBio from "../components/blog/AuthorBio";
import SanityImage from "../components/ui/SanityImage";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useRef } from "react";

export default function SinglePostPage() {
  const contentRef = useScrollReveal({ delay: 100 }, 'left');
  const sidebarRef = useScrollReveal({ delay: 200 }, 'right');
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [displayedSummary, setDisplayedSummary] = useState("");
  const [isTyping, setIsTyping] = useState(false);

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
  const [toggleBookmark, { isLoading: bookmarking }] = useToggleBookmarkMutation();

  // Initialize like and bookmark status
  useEffect(() => {
    if (post && user?._id) {
      const userId = user._id.toString();
      setIsLiked(post.likes?.some(id => id?.toString() === userId) || false);
      // Check if bookmarked from user's bookmark list if available, or post data
      const isBookmarkedInUser = user.bookmarks?.some(id => id?.toString() === post._id?.toString());
      setIsBookmarked(!!(isBookmarkedInUser || post.isBookmarked));
    } else {
      setIsLiked(false);
      setIsBookmarked(false);
    }
  }, [post, user]);

  // AI Summary Typing Effect
  useEffect(() => {
    if (showSummary && post?.aiSummary && displayedSummary.length < post.aiSummary.length) {
      setIsTyping(true);
      const timeout = setTimeout(() => {
        setDisplayedSummary(post.aiSummary.slice(0, displayedSummary.length + 1));
      }, 20);
      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
    }
  }, [showSummary, displayedSummary, post?.aiSummary]);

  // Scroll Progress Logic
  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollProgress = document.getElementById("scroll-progress");
      if (scrollProgress) {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
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
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  // PortableText components for custom styling
  const ptComponents = {
    block: {
      h2: ({ children }) => (
        <h2 className="text-3xl font-bold mt-10 mb-5 text-gray-900">{children}</h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900">{children}</h3>
      ),
      h4: ({ children }) => (
        <h4 className="text-xl font-semibold mt-6 mb-3 text-gray-900">{children}</h4>
      ),
      blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-emerald-500 pl-6 py-4 my-6 italic text-gray-700 bg-emerald-50 rounded-r-lg">
          {children}
        </blockquote>
      ),
      normal: ({ children }) => (
        <p className="mb-5 text-gray-700 leading-relaxed text-lg">{children}</p>
      ),
    },
    marks: {
      link: ({ children, value }) => {
        const rel = !value.href.startsWith("/") ? "noreferrer noopener" : undefined;
        return (
          <a
            href={value.href}
            rel={rel}
            target={rel ? "_blank" : undefined}
            className="text-emerald-600 hover:text-emerald-700 underline decoration-2 underline-offset-2 transition-colors font-medium"
          >
            {children}
          </a>
        );
      },
      strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
    },
    list: {
      bullet: ({ children }) => <ul className="list-disc list-outside ml-6 mb-6 space-y-2 text-gray-700">{children}</ul>,
      number: ({ children }) => <ol className="list-decimal list-outside ml-6 mb-6 space-y-2 text-gray-700">{children}</ol>,
    },
    listItem: {
      bullet: ({ children }) => <li>{children}</li>,
      number: ({ children }) => <li>{children}</li>,
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
          <p className="text-gray-400 font-medium whitespace-nowrap">Loading amazing content...</p>
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md p-10 rounded-3xl backdrop-blur-xl border border-white/10">
          <div className="w-20 h-20 bg-red-100/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">😔</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Post Not Found
          </h1>
          <p className="text-gray-400 mb-8">
            The article you're following seems to have vanished into thin air.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-semibold shadow-lg shadow-emerald-200"
          >
            <ArrowLeft size={20} />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const readingTime = post.estimatedReadingTime || post.readingTime || 5;
  const likesCount = (post.likesCount || post.likes?.length || 0) + (isLiked && !post.likes?.includes(user?._id) ? 1 : 0) - (!isLiked && post.likes?.includes(user?._id) ? 1 : 0);
  const viewsCount = post.views || post.viewCount || 0;

  return (
    <div className="min-h-screen">
      {/* Immersive Scroll Progress */}
      <div className="fixed top-0 left-0 w-full h-1.5 z-[100]">
        <div 
          className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 w-0 transition-all duration-300 shadow-[0_0_10px_rgba(52,211,153,0.5)]" 
          id="scroll-progress" 
        />
      </div>

      <article className="animate-in fade-in duration-1000">
        {/* Immersive Hero Section */}
        <div className="relative h-[70vh] min-h-[500px] w-full bg-slate-900 group overflow-hidden">
          {/* Hero Background Image */}
          <div className="absolute inset-0">
            <SanityImage
              image={post.mainImage}
              alt={post.title}
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[2s] ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/60 to-slate-950/20" />
          </div>

          {/* Navigation Overlay */}
          <div className="absolute top-0 left-0 right-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex items-center justify-between">
              <Link
                to="/blog"
                className="flex items-center gap-2 text-white/80 hover:text-white font-medium transition-all group/back"
              >
                <div className="p-2 bg-white/10 backdrop-blur-md rounded-full group-hover/back:bg-white/20 transition-all">
                  <ArrowLeft size={20} />
                </div>
                <span className="hidden sm:inline">Back to Articles</span>
              </Link>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleBookmark}
                  disabled={bookmarking}
                  className={`p-3 rounded-full backdrop-blur-md border border-white/20 transition-all active:scale-95 ${
                    isBookmarked 
                      ? "bg-emerald-500 text-white border-emerald-400" 
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {isBookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                </button>
                <div className="relative group/share">
                   <button 
                    onClick={copyLink}
                    className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all active:scale-95"
                  >
                    <Share2 size={20} />
                  </button>
                  {/* Desktop Social Tooltip */}
                  <div className="absolute top-full right-0 mt-3 hidden group-hover/share:flex flex-col gap-2 p-2 bg-white rounded-2xl shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
                    <button onClick={() => share("twitter")} className="p-2 hover:bg-slate-50 rounded-xl text-blue-400 transition-colors"><Twitter size={20} /></button>
                    <button onClick={() => share("facebook")} className="p-2 hover:bg-slate-50 rounded-xl text-blue-600 transition-colors"><Facebook size={20} /></button>
                    <button onClick={() => share("linkedin")} className="p-2 hover:bg-slate-50 rounded-xl text-blue-700 transition-colors"><Linkedin size={20} /></button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Content */}
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20 w-full">
              <div className="flex flex-wrap items-center gap-3 mb-6 animate-in slide-in-from-bottom duration-700 delay-100">
                {post.categories?.map((cat, i) => (
                  <span key={i} className="px-4 py-1 bg-emerald-500/20 backdrop-blur-md text-emerald-300 text-xs font-bold uppercase tracking-widest rounded-full border border-emerald-400/30">
                    {cat.title || cat}
                  </span>
                ))}
                <div className="flex items-center gap-2 px-4 py-1 bg-white/10 backdrop-blur-md text-white/90 text-xs font-bold uppercase tracking-widest rounded-full border border-white/10">
                  <Clock size={14} className="text-emerald-400" />
                  <span>{readingTime} min read</span>
                </div>
              </div>

              <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-10 animate-in slide-in-from-bottom duration-700">
                <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                  {post.title}
                </span>
              </h1>

              {/* Glassmorphic Metadata bar */}
              <div className="flex flex-wrap items-center justify-between gap-6 p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl animate-in slide-in-from-bottom duration-700 delay-200 transform-gpu">
                <div className="flex items-center gap-4">
                  <img 
                    src={post.author?.image?.url || post.author?.image?.asset?.url || post.author?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.name || "A")}&background=10b981&color=fff`}
                    alt={post.author?.name}
                    className="w-14 h-14 rounded-full border-2 border-white/20 shadow-lg object-cover"
                  />
                  <div>
                    <p className="font-bold text-white text-lg leading-none mb-1">
                      {post.author?.name || "Anonymous"}
                    </p>
                    <p className="text-white/60 text-sm">
                      {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-10">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2 text-white">
                      <Eye size={20} className="text-cyan-400" />
                      <span className="text-xl font-black tracking-tight">{viewsCount.toLocaleString()}</span>
                    </div>
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Analytics</span>
                  </div>
                  
                  <button 
                    onClick={handleLike}
                    disabled={liking}
                    className={`group flex flex-col items-center transition-all hover:scale-110 ${isLiked ? "text-rose-500" : "text-white/40 hover:text-white"}`}
                  >
                    <Heart size={28} className={isLiked ? "fill-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]" : "group-hover:text-rose-400"} />
                    <span className="text-xs font-black mt-1">{likesCount}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Major Content Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[1fr_320px] gap-12 py-20 relative">
          
          <div ref={contentRef} className="min-w-0 bg-transparent">
            {/* AI Summary - Refined "Magical" Visual */}

            {/* Main Content Body - Optimized Typography */}
            <div className="prose prose-invert lg:prose-xl max-w-none 
              prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-8
              prose-a:text-emerald-400 prose-a:font-bold prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-500/5 prose-blockquote:py-2 prose-blockquote:px-8 prose-blockquote:rounded-r-2xl prose-blockquote:text-slate-200 prose-blockquote:not-italic
              prose-img:rounded-3xl prose-img:shadow-2xl
              prose-li:text-slate-300
              prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight">
              {post.body && (
                <PortableText value={post.body} components={ptComponents} />
              )}
              {post.content && (
                <div
                  dangerouslySetInnerHTML={{ __html: post.content }}
                  className="mt-8"
                />
              )}
            </div>

            {/* Interactive AI Synthesis Section */}

            {/* Content Footer - Social & Actions */}
            <div className="mt-20 py-10 border-t border-slate-100 flex flex-wrap items-center justify-between gap-8">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Share this Story</span>
                <div className="flex gap-2">
                  <button onClick={() => share("twitter")} className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:text-blue-400 transition-all active:scale-95"><Twitter size={20} /></button>
                  <button onClick={() => share("facebook")} className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:text-blue-600 transition-all active:scale-95"><Facebook size={20} /></button>
                  <button onClick={() => share("linkedin")} className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:text-blue-700 transition-all active:scale-95"><Linkedin size={20} /></button>
                </div>
              </div>
              <button 
                onClick={copyLink}
                className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all active:scale-95"
              >
                <Copy size={18} />
                Copy Link
              </button>
            </div>
          </div>

          {/* Sidebar Area */}
          <aside ref={sidebarRef} className="space-y-12">
            {/* Sticky Sidebar Content */}
            <div className="sticky top-32 space-y-12">
              <div className="bg-slate-900/50 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl transform-gpu">
                <h4 className="text-white font-black text-lg mb-6 flex items-center gap-2">
                   Meet the Author
                </h4>
                <AuthorBio author={post.author} />
              </div>

              {/* AI Synthesis Sidebar Card */}
              {post.aiSummary && (
                <div className="animate-in slide-in-from-bottom duration-700">
                  {!showSummary ? (
                    <div className="flex flex-col items-center text-center space-y-4 p-8 bg-slate-900/50 backdrop-blur-md rounded-3xl border-2 border-dashed border-white/10 hover:border-emerald-500/50 transition-colors group transform-gpu">
                      <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <Sparkles size={24} />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-white mb-1">AI Synthesis</h4>
                        <p className="text-slate-400 text-xs font-medium">Get a high-level takeaway of this article.</p>
                      </div>
                      <button
                        onClick={() => setShowSummary(true)}
                        className="w-full py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        <Zap size={14} className="text-emerald-400" />
                        Generate now
                      </button>
                    </div>
                  ) : (
                    <div className="group relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 rounded-3xl blur opacity-20 animate-gradient" />
                      <div className="relative p-7 bg-slate-900/80 backdrop-blur-lg rounded-3xl border border-white/10 shadow-2xl overflow-hidden transform-gpu">
                        <div className="absolute top-0 right-0 p-4 opacity-5 select-none pointer-events-none">
                          <Sparkles size={100} className="text-emerald-500" />
                        </div>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-emerald-500 text-white rounded-lg shadow-md shadow-emerald-200">
                              <Sparkles size={14} />
                            </div>
                            <h3 className="text-emerald-600 font-black text-[11px] uppercase tracking-widest">AI Synthesis</h3>
                          </div>
                          {isTyping && (
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[8px] font-black uppercase tracking-widest animate-pulse">
                              <span className="w-1 h-1 bg-emerald-500 rounded-full" />
                              Analysing
                            </div>
                          )}
                        </div>
                        
                        <p className="text-slate-200 text-lg font-medium leading-relaxed italic relative z-10 transition-all duration-300">
                          "{displayedSummary}"
                          {isTyping && <span className="inline-block w-1 h-4 ml-0.5 bg-emerald-400 animate-bounce" />}
                        </p>
                        
                        <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4">
                          <button 
                            onClick={() => {
                              setShowSummary(false);
                              setDisplayedSummary("");
                            }}
                            className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
                          >
                            Reset
                          </button>
                          <div className="flex -space-x-1.5">
                             <div className="w-5 h-5 rounded-full bg-emerald-400 border-2 border-white z-20" />
                             <div className="w-5 h-5 rounded-full bg-cyan-400 border-2 border-white z-10" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Newsletter or CTA Card */}
              <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Zap size={100} className="text-emerald-500" />
                </div>
                <h4 className="text-xl font-black mb-3 relative z-10">Never miss a beat.</h4>
                <p className="text-slate-400 text-sm mb-6 relative z-10">
                  Join our weekly newsletter for more insights like these.
                </p>
                <div className="relative z-10 space-y-3">
                  <input type="email" placeholder="Email address" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                  <button className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl transition-all shadow-lg shadow-emerald-500/20">
                    Subscribe Now
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Content & Discussion */}
        <div className="bg-slate-100 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <CommentSection postId={post._id} />
          </div>
        </div>

        {/* Bottom Immersive Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="p-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent opacity-50" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black mb-6">Hungry for more?</h2>
              <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
                Explore our curated collection of articles hand-picked to help you grow.
              </p>
              <Link 
                to="/blog"
                className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-900 rounded-full font-black hover:bg-emerald-50 transition-all shadow-2xl hover:scale-105 active:scale-95"
              >
                Explore Blogify
                <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
