// frontend/src/pages/SinglePostPage.jsx
import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import {
  useGetPostBySlugQuery,
  useIncrementViewCountMutation,
  useToggleLikeMutation,
} from "../api/postsAPI";

import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Twitter,
  Facebook,
  Linkedin,
  Copy,
  Heart,
} from "lucide-react";

import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

import SEO from "../components/shared/SEO";
import LoadingPost from "../components/ui/LoadingPost";
import ErrorState from "../components/ui/ErrorState";
import TableOfContents from "../components/blog/TableOfContents";
import AuthorBio from "../components/blog/AuthorBio";
import AISummary from "../features/posts/components/AISummary";
import RelatedPosts from "../components/blog/RelatedPosts";
import CommentsSection from "../comments/CommentsSection";

export default function SinglePostPage() {
  const { slug } = useParams();
  const { user } = useSelector((state) => state.auth);

  const { data: postData, isLoading, isError } = useGetPostBySlugQuery(slug);

  const [incrementView] = useIncrementViewCountMutation();
  const [toggleLike, { isLoading: liking }] = useToggleLikeMutation();

  const post = postData?.post || postData;

  // ---------------- VIEW COUNT ----------------
  useEffect(() => {
    if (post?._id) {
      incrementView(post._id);
    }
  }, [post?._id, incrementView]);

  // ---------------- CODE HIGHLIGHT ----------------
  useEffect(() => {
    Prism.highlightAll();
  }, [post]);

  if (isLoading) return <LoadingPost />;
  if (isError || !post) return <ErrorState message="Post not found" />;

  const readingTime = post.estimatedReadingTime || 5;
  const likesCount = post.likesCount || 0;
  const likedByUser = post.likedByUser;

  // ---------------- ACTIONS ----------------
  const handleLike = async () => {
    if (!user) {
      alert("Please login to like this post");
      return;
    }

    try {
      await toggleLike(post._id).unwrap();
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  const share = (platform) => {
    const url = window.location.href;
    const title = encodeURIComponent(post.title);

    const links = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`,
    };

    window.open(links[platform], "_blank", "width=600,height=400");
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    alert("Link copied!");
  };

  return (
    <>
      <SEO post={post} />

      <article className="max-w-5xl mx-auto px-4 py-8">
        {/* BACK */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600 mb-6"
        >
          <ArrowLeft size={16} />
          Back to blog
        </Link>

        {/* TITLE */}
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        {/* META */}
        <div className="flex gap-6 text-sm text-gray-600 mb-8">
          <span className="flex items-center gap-2">
            <User size={14} />
            {post.author?.name || "Anonymous"}
          </span>
          <span className="flex items-center gap-2">
            <Calendar size={14} />
            {new Date(post.publishedAt).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-2">
            <Clock size={14} />
            {readingTime} min read
          </span>
        </div>

        {/* IMAGE */}
        {post.mainImage?.asset?.url && (
          <img
            src={post.mainImage.asset.url}
            alt={post.title}
            className="w-full h-[420px] object-cover rounded-xl mb-10"
          />
        )}

        {/* ACTION BAR */}
        <div className="flex items-center gap-4 mb-10">
          {/* LIKE */}
          <button
            onClick={handleLike}
            disabled={liking}
            className={`flex items-center gap-2 px-3 py-1 rounded-full border transition
              ${
                likedByUser
                  ? "bg-red-100 text-red-600 border-red-200"
                  : "bg-gray-100 text-gray-600 border-gray-200"
              }
            `}
          >
            <Heart size={16} className={likedByUser ? "fill-red-500" : ""} />
            <span className="text-sm">{likesCount}</span>
          </button>

          {/* SHARE */}
          <button onClick={() => share("twitter")}>
            <Twitter size={18} />
          </button>
          <button onClick={() => share("facebook")}>
            <Facebook size={18} />
          </button>
          <button onClick={() => share("linkedin")}>
            <Linkedin size={18} />
          </button>
          <button onClick={copyLink}>
            <Copy size={18} />
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-10">
          {/* TOC */}
          <aside className="lg:col-span-1 sticky top-24">
            <TableOfContents body={post.body} />
          </aside>

          {/* CONTENT */}
          <div className="lg:col-span-3">
            {post.aiSummary && (
              <div className="mb-10">
                <AISummary summary={post.aiSummary} />
              </div>
            )}

            <div className="prose prose-lg max-w-none">
              {post.body?.map((block, i) => {
                if (!block.children) return null;

                const text = block.children.map((c) => c.text).join("");
                if (!text.trim()) return null;

                if (block.style === "h2") return <h2 key={i}>{text}</h2>;
                if (block.style === "h3") return <h3 key={i}>{text}</h3>;
                if (block.style === "blockquote")
                  return <blockquote key={i}>{text}</blockquote>;

                return <p key={i}>{text}</p>;
              })}
            </div>

            {/* AUTHOR */}
            {post.author && (
              <div className="mt-14">
                <AuthorBio author={post.author} />
              </div>
            )}

            {/* COMMENTS */}
            <div className="mt-20">
              {user ? (
                <CommentsSection postId={post._id} />
              ) : (
                <div className="border rounded-xl p-6 bg-gray-50 text-center">
                  <p className="text-gray-600 mb-4">
                    You must be logged in to comment.
                  </p>
                  <Link
                    to="/login"
                    className="px-5 py-2 bg-emerald-600 text-white rounded-lg"
                  >
                    Login to join discussion
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RELATED */}
        <div className="mt-20">
          <RelatedPosts currentPostId={post._id} categories={post.categories} />
        </div>
      </article>
    </>
  );
}
