// frontend/src/pages/PostDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetPostBySlugQuery,
  useIncrementViewCountMutation,
} from "../api/postsAPI";
import { useToggleLikeMutation } from "../api/likesAPI";
import { useToggleBookmarkMutation } from "../api/usersAPI";
import StatusBadge from "../components/ui/StatusBadge";
import {
  Calendar,
  Clock,
  Eye,
  Heart,
  Tag,
  User,
  ChevronLeft,
  Share2,
  Bookmark,
  Edit,
  AlertCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function PostDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data: postData, isLoading, error } = useGetPostBySlugQuery(slug);
  const [incrementViewCount] = useIncrementViewCountMutation();
  const [toggleLike] = useToggleLikeMutation();
  const [toggleBookmark] = useToggleBookmarkMutation();

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Extract post from data
  const post = postData?.post;

  // Get related posts if post exists (simplified - you'll need to implement this)
  const relatedPosts = []; // You need to implement getRelatedPosts query

  // Increment view count on load
  useEffect(() => {
    if (post?._id) {
      incrementViewCount(post._id);
    }
  }, [post?._id, incrementViewCount]);

  // Check if user has liked the post
  useEffect(() => {
    if (post && user) {
      setIsLiked(post.likes?.includes(user._id) || false);
    }
  }, [post, user]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.info("Please login to like posts");
      navigate("/login");
      return;
    }

    try {
      await toggleLike(post._id).unwrap();
      setIsLiked(!isLiked);
      toast.success(isLiked ? "Removed from likes" : "Added to likes");
    } catch {
      toast.error("Failed to update like");
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

  const handleShare = async () => {
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt || post?.aiSummary,
          url: shareUrl,
        });
        toast.success("Post shared successfully!");
      } catch (error) {
        console.log("Share cancelled:", error);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleEditPost = () => {
    if (!user?.isAdmin && user?._id !== post?.author?._id) {
      toast.error("You don't have permission to edit this post");
      return;
    }

    navigate(`/edit-post/${post._id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-12"></div>
              <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center py-12">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Post Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The post you're looking for doesn't exist or may have been removed.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  // Check if user can see unpublished posts
  const canViewUnpublished = user?.isAdmin || user?._id === post.author?._id;
  const isPublished = post.status === "published";

  if (!isPublished && !canViewUnpublished) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center py-12">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Post Unavailable
          </h1>
          <p className="text-gray-600 mb-4">
            This post is currently under review and not publicly available.
          </p>
          <div className="flex justify-center space-x-3">
            <Link
              to="/blog"
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Browse Posts
            </Link>
            {!isAuthenticated && (
              <Link
                to="/login"
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-white rounded-lg hover:shadow-lg"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <Link
              to="/blog"
              className="inline-flex items-center text-sm text-gray-600 hover:text-emerald-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Blog
            </Link>

            {canViewUnpublished && (
              <div className="flex items-center space-x-3">
                <StatusBadge status={post.status} size="sm" />

                {(user?.isAdmin || user?._id === post.author?._id) && (
                  <button
                    onClick={handleEditPost}
                    className="inline-flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-emerald-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-1.5" />
                    Edit
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <article className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Post Header */}
          <header className="mb-8">
            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories?.map((category) => (
                <Link
                  key={category._id}
                  to={`/category/${category.slug}`}
                  className="inline-flex items-center px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full hover:bg-emerald-100 transition-colors"
                >
                  <Tag className="w-3 h-3 mr-1.5" />
                  {category.title}
                </Link>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            {/* Author & Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
              <div className="flex items-center">
                {post.author?.image?.url ? (
                  <img
                    src={post.author.image.url}
                    alt={post.author.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {post.author?.name?.charAt(0) || "U"}
                  </div>
                )}
                <div>
                  <Link
                    to={`/author/${post.author?.username}`}
                    className="font-medium text-gray-900 hover:text-emerald-600 transition-colors"
                  >
                    {post.author?.name || "Anonymous"}
                  </Link>
                  <div className="flex items-center text-sm">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDistanceToNow(
                      new Date(post.publishedAt || post.createdAt),
                      { addSuffix: true }
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1.5" />
                  {post.readingTime || 5} min read
                </span>

                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-1.5" />
                  {post.views || 0} views
                </span>
              </div>
            </div>

            {/* AI Summary */}
            {post.aiSummary && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-blue-800 mb-1">
                      AI Summary
                    </h4>
                    <p className="text-sm text-blue-700">{post.aiSummary}</p>
                  </div>
                </div>
              </div>
            )}
          </header>

          {/* Featured Image */}
          {post.mainImage?.url && (
            <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
              <img
                src={post.mainImage.url}
                alt={post.mainImage.alt || post.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Difficulty Badge */}
          {post.difficulty && (
            <div className="mb-6">
              <span
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  post.difficulty === "beginner"
                    ? "bg-green-100 text-green-800"
                    : post.difficulty === "intermediate"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {post.difficulty.charAt(0).toUpperCase() +
                  post.difficulty.slice(1)}{" "}
                Level
              </span>
            </div>
          )}

          {/* Post Body */}
          <div className="prose prose-lg max-w-none mb-12">
            {post.content && (
              <div
                className="text-gray-800 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            )}
          </div>

          {/* Action Bar */}
          <div className="border-t border-gray-200 pt-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLike}
                  className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors ${
                    isLiked
                      ? "bg-red-50 text-red-600 border border-red-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 mr-2 ${isLiked ? "fill-current" : ""}`}
                  />
                  {post.likesCount || 0} Likes
                </button>

                <button
                  onClick={handleBookmark}
                  className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors ${
                    isBookmarked
                      ? "bg-purple-50 text-purple-600 border border-purple-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Bookmark
                    className={`w-5 h-5 mr-2 ${isBookmarked ? "fill-current" : ""}`}
                  />
                  Bookmark
                </button>
              </div>

              <button
                onClick={handleShare}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </button>
            </div>
          </div>

          {/* Rejection Reason (if rejected) */}
          {post.status === "rejected" && post.rejectionReason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-red-800 mb-1">
                    Rejection Reason
                  </h4>
                  <p className="text-sm text-red-700">{post.rejectionReason}</p>
                </div>
              </div>
            </div>
          )}

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Related Posts
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost._id}
                    to={`/blog/${relatedPost.slug}`}
                    className="group"
                  >
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                      {relatedPost.mainImage?.url && (
                        <div className="h-48 overflow-hidden">
                          <img
                            src={relatedPost.mainImage.url}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 group-hover:text-emerald-600 transition-colors mb-2 line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {relatedPost.readingTime || 5} min read
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
