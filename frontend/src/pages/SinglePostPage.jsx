// frontend/src/pages/SinglePostPage.jsx
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
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
} from "lucide-react";
import CommentSection from "../components/blog/CommentSection";
import AuthorBio from "../components/blog/AuthorBio";

export default function SinglePostPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const {
    data: postData,
    isLoading,
    isError,
  } = useGetPostBySlugQuery(slug, {
    skip: !slug,
    refetchOnMountOrArgChange: true,
  });

  const post = postData; // From transformResponse: (response) => response.post

  const [incrementView] = useIncrementViewCountMutation();
  const [toggleLike, { isLoading: liking }] = useToggleLikeMutation();
  const [toggleBookmark, { isLoading: bookmarking }] = useToggleBookmarkMutation();

  // Initialize like and bookmark status
  useEffect(() => {
    if (post && user) {
      setIsLiked(post.likes?.includes(user._id) || false);
      // Logic for bookmark status if it comes from user profile or post data
      // For now, let's assume isBookmarked comes from post.isBookmarked or similar
      setIsBookmarked(post.isBookmarked || false);
    }
  }, [post, user]);

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

  // Render block content
  const renderBlock = (block, index) => {
    if (!block?.children || !Array.isArray(block.children)) return null;

    const text = block.children
      .map((child) => child?.text || "")
      .join("")
      .trim();

    if (!text) return null;

    switch (block.style) {
      case "h2":
        return (
          <h2
            key={index}
            className="text-3xl font-bold mt-10 mb-5 text-gray-900"
          >
            {text}
          </h2>
        );
      case "h3":
        return (
          <h3
            key={index}
            className="text-2xl font-bold mt-8 mb-4 text-gray-900"
          >
            {text}
          </h3>
        );
      case "h4":
        return (
          <h4
            key={index}
            className="text-xl font-semibold mt-6 mb-3 text-gray-900"
          >
            {text}
          </h4>
        );
      case "blockquote":
        return (
          <blockquote
            key={index}
            className="border-l-4 border-emerald-500 pl-6 py-4 my-6 italic text-gray-700 bg-emerald-50 rounded-r-lg"
          >
            {text}
          </blockquote>
        );
      default:
        return (
          <p key={index} className="mb-5 text-gray-700 leading-relaxed text-lg">
            {text}
          </p>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
          <p className="text-gray-600 font-medium">Loading amazing content...</p>
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">😔</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Post Not Found
          </h1>
          <p className="text-gray-600 mb-8">
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
  const likesCount = (post.likesCount || 0) + (isLiked && !post.likes?.includes(user?._id) ? 1 : 0) - (!isLiked && post.likes?.includes(user?._id) ? 1 : 0);
  const viewsCount = post.views || post.viewCount || 0;
  const postImage =
    post.mainImage?.asset?.url || post.mainImage?.url || post.image;

  return (
    <div className="min-h-screen bg-white">
      {/* Scroll Progress Bar (Visual only for now) */}
      <div className="fixed top-0 left-0 w-full h-1.5 z-50 bg-gray-100">
        <div className="h-full bg-emerald-500 w-0 transition-all duration-300" id="scroll-progress" />
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Navigation & Actions */}
        <div className="flex items-center justify-between mb-12">
          <Link
            to="/blog"
            className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 font-medium transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Articles</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleBookmark}
              disabled={bookmarking}
              className={`p-2.5 rounded-full transition-all active:scale-95 ${
                isBookmarked 
                  ? "bg-emerald-100 text-emerald-600" 
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {isBookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
            </button>
            <button 
              onClick={copyLink}
              className="p-2.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all active:scale-95"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>

        {/* Hero Area */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            {post.categories?.map((cat, i) => (
              <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-lg">
                {cat.title || cat}
              </span>
            ))}
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">
              {readingTime} min read
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1] mb-8">
            {post.title}
          </h1>

          <div className="flex items-center justify-between py-6 border-y border-gray-100">
            <div className="flex items-center gap-4">
              <img 
                src={post.author?.image?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.name || "A")}&background=10b981&color=fff`}
                alt={post.author?.name}
                className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
              />
              <div>
                <p className="font-bold text-gray-900 leading-none mb-1">
                  {post.author?.name || "Anonymous"}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900 leading-none">
                  {viewsCount.toLocaleString()}
                </p>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Views</p>
              </div>
              <button 
                onClick={handleLike}
                disabled={liking}
                className={`flex flex-col items-center transition-colors ${isLiked ? "text-red-500" : "text-gray-300 hover:text-gray-400"}`}
              >
                <Heart size={24} className={isLiked ? "fill-red-500" : ""} />
                <span className="text-[10px] font-bold uppercase">{likesCount}</span>
              </button>
            </div>
          </div>
        </header>

        {/* AI Summary */}
        {post.aiSummary && (
          <div className="mb-12 p-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-3xl border border-indigo-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles size={100} className="text-indigo-600" />
            </div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-4 text-indigo-600 font-bold text-sm uppercase tracking-widest">
                <Sparkles size={16} />
                <span>AI Core Insights</span>
              </div>
              <p className="text-indigo-900 text-lg leading-relaxed italic">
                "{post.aiSummary}"
              </p>
            </div>
          </div>
        )}

        {/* Featured Image */}
        {postImage && (
          <div className="mb-12 rounded-3xl overflow-hidden shadow-2xl bg-gray-100 border border-gray-100">
            <img
              src={postImage}
              alt={post.title}
              className="w-full h-auto max-h-[600px] object-cover"
            />
            {post.mainImage?.caption && (
              <p className="p-4 text-center text-sm text-gray-400 italic bg-white border-t border-gray-50">
                {post.mainImage.caption}
              </p>
            )}
          </div>
        )}

        {/* Social Sticky Side (Desktop) */}
        <div className="relative">
          <div className="hidden lg:flex flex-col gap-4 absolute -left-20 top-0 sticky top-32 h-fit">
            <button onClick={() => share("twitter")} className="p-3 bg-white border border-gray-100 rounded-full shadow-sm hover:shadow-md hover:text-blue-400 transition-all"><Twitter size={20} /></button>
            <button onClick={() => share("facebook")} className="p-3 bg-white border border-gray-100 rounded-full shadow-sm hover:shadow-md hover:text-blue-600 transition-all"><Facebook size={20} /></button>
            <button onClick={() => share("linkedin")} className="p-3 bg-white border border-gray-100 rounded-full shadow-sm hover:shadow-md hover:text-blue-700 transition-all"><Linkedin size={20} /></button>
          </div>

          {/* Main Content Body */}
          <div className="prose prose-emerald prose-lg max-w-none">
            {post.body?.map((block, i) => renderBlock(block, i))}
            {post.content && (
              <div
                dangerouslySetInnerHTML={{ __html: post.content }}
                className="mt-8"
              />
            )}
          </div>
        </div>

        {/* Author Footer */}
        <div className="mt-20 pt-10 border-t border-gray-100">
          <AuthorBio author={post.author} />
        </div>

        {/* Discussion Area */}
        <div className="mt-20">
          <CommentSection postId={post._id} />
        </div>

        {/* Bottom Banner */}
        <div className="mt-24 p-12 bg-gray-900 rounded-[2.5rem] text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 opacity-30" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Enjoyed this article?</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Follow us for more high-quality content on technology and design delivered straight to your dashboard.
            </p>
            <Link 
              to="/blog"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-gray-900 rounded-full font-bold hover:bg-emerald-50 transition-colors shadow-xl"
            >
              Continue Reading
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
