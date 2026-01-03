// frontend/src/pages/SinglePostPage.jsx
import { useParams, Link } from "react-router-dom";
import {
  useGetPostBySlugQuery,
  useIncrementViewCountMutation,
} from "@/api/postsAPI";
import { useEffect } from "react";
import {
  Calendar,
  User,
  Clock,
  Share2,
  Bookmark,
  ArrowLeft,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
} from "lucide-react";
import SEO from "../components/shared/SEO";
import AISummary from "../features/posts/components/AISummary";
import LoadingPost from "../components/ui/LoadingPost";
import ErrorState from "../components/ui/ErrorState";
import TableOfContents from "../components/blog/TableOfContents";
import AuthorBio from "../components/blog/AuthorBio";
import RelatedPosts from "../components/blog/RelatedPosts";

export default function SinglePostPage() {
  const { slug } = useParams();
  const {
    data: postData,
    isLoading,
    isError,
    error,
  } = useGetPostBySlugQuery(slug);
  const [incrementViewCount] = useIncrementViewCountMutation();

  // Extract post from response (assuming response is an object with a post property)
  const post = postData?.post || postData;

  // Track view count
  useEffect(() => {
    if (post?._id) {
      incrementViewCount(post._id);
    }
  }, [post?._id, incrementViewCount]);

  if (isLoading) return <LoadingPost />;
  if (isError) return <ErrorState message="Post not found" error={error} />;
  if (!post) return <ErrorState message="Post not found" />;

  const readingTime =
    post.readingTime || Math.ceil((post.body?.length || 0) / 1000) || 5;

  // Handle social sharing
  const handleShare = (platform) => {
    const url = window.location.href;
    const title = encodeURIComponent(post.title);
    const text = encodeURIComponent(post.excerpt || post.title);

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}&summary=${text}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <>
      <SEO post={post} />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8 pt-4">
          <Link
            to="/blog"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to blog</span>
          </Link>
        </div>

        {/* Post Header */}
        <header className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories?.map((category, index) => (
              <Link
                key={category?._id || index}
                to={`/categories/${category?.slug || category}`}
                className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-medium rounded-full hover:bg-emerald-200 transition-colors"
              >
                {category?.title || category || "Uncategorized"}
              </Link>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-8">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>{post.author?.name || "Anonymous"}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{readingTime} min read</span>
            </div>
          </div>

          {/* Featured Image */}
          {post.mainImage && (
            <div className="relative rounded-2xl overflow-hidden mb-8">
              <img
                src={post.mainImage?.asset?.url || post.mainImage}
                alt={post.title}
                className="w-full h-[400px] object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between py-4 border-y border-gray-200 gap-4">
            <div className="flex items-center space-x-4">
              <button
                className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors"
                aria-label="Save post"
              >
                <Bookmark className="w-5 h-5" />
                <span className="text-sm hidden sm:inline">Save</span>
              </button>

              {/* Social Sharing */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Share:</span>
                <button
                  onClick={() => handleShare("twitter")}
                  className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                  aria-label="Share on Twitter"
                >
                  <Twitter className="w-4 h-4 text-blue-400" />
                </button>
                <button
                  onClick={() => handleShare("facebook")}
                  className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                  aria-label="Share on Facebook"
                >
                  <Facebook className="w-4 h-4 text-blue-600" />
                </button>
                <button
                  onClick={() => handleShare("linkedin")}
                  className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="w-4 h-4 text-blue-700" />
                </button>
                <button
                  onClick={handleCopyLink}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Copy link"
                >
                  <Copy className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <aside className="lg:col-span-1 lg:sticky lg:top-24 self-start h-fit">
            <TableOfContents body={post.body} />
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Excerpt */}
            {post.excerpt && (
              <div className="mb-10 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
                <p className="text-lg text-gray-700 italic">{post.excerpt}</p>
              </div>
            )}

            {/* AI Summary */}
            {post.aiSummary && (
              <div className="mb-10">
                <AISummary summary={post.aiSummary} />
              </div>
            )}

            {/* Post Body */}
            <div className="prose prose-lg max-w-none">
              {post.body?.map((block, i) => {
                if (!block.children) return null;

                const text = block.children.map((c) => c.text).join("");
                if (!text.trim()) return null;

                if (block.style === "h2") {
                  return (
                    <h2
                      key={i}
                      id={`heading-${i}`}
                      className="text-2xl font-bold text-gray-900 mt-12 mb-6 scroll-mt-24 border-b border-gray-200 pb-2"
                    >
                      {text}
                    </h2>
                  );
                }
                if (block.style === "h3") {
                  return (
                    <h3
                      key={i}
                      id={`heading-${i}`}
                      className="text-xl font-bold text-gray-800 mt-8 mb-4 scroll-mt-24"
                    >
                      {text}
                    </h3>
                  );
                }
                if (block.style === "blockquote") {
                  return (
                    <blockquote
                      key={i}
                      className="border-l-4 border-emerald-500 pl-6 py-2 my-6 italic text-gray-700 bg-gray-50 rounded-r-lg"
                    >
                      {text}
                    </blockquote>
                  );
                }

                return (
                  <p key={i} className="mb-6 text-gray-700 leading-relaxed">
                    {text}
                  </p>
                );
              })}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Link
                      key={index}
                      to={`/search?q=${encodeURIComponent(tag)}`}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Author Bio */}
            {post.author && (
              <div className="mt-12">
                <AuthorBio author={post.author} />
              </div>
            )}
          </div>
        </div>

        {/* Related Posts */}
        <div className="mt-16">
          <RelatedPosts currentPostId={post._id} categories={post.categories} />
        </div>
      </article>
    </>
  );
}
