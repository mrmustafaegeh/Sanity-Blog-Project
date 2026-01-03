import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import {
  useGetPostBySlugQuery,
  useIncrementViewCountMutation,
} from "@/api/postsAPI";

import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Twitter,
  Facebook,
  Linkedin,
  Copy,
} from "lucide-react";

import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

import SEO from "@/components/shared/SEO";
import LoadingPost from "@/components/ui/LoadingPost";
import ErrorState from "@/components/ui/ErrorState";
import TableOfContents from "@/components/blog/TableOfContents";
import AuthorBio from "@/components/blog/AuthorBio";
import AISummary from "@/features/posts/components/AISummary";
import RelatedPosts from "@/components/blog/RelatedPosts";

export default function SinglePostPage() {
  const { slug } = useParams();

  const { data: postData, isLoading, isError } = useGetPostBySlugQuery(slug);

  const [incrementView] = useIncrementViewCountMutation();

  const post = postData?.post || postData;

  /* 🔹 Increment view count once */
  useEffect(() => {
    if (post?._id) {
      incrementView(post._id);
    }
  }, [post?._id, incrementView]);

  /* 🔹 Highlight code blocks */
  useEffect(() => {
    Prism.highlightAll();
  }, [post]);

  if (isLoading) return <LoadingPost />;
  if (isError || !post) return <ErrorState message="Post not found" />;

  const readingTime = post.estimatedReadingTime || 5;

  /* 🔹 Social sharing */
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
        {/* Back */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600 mb-6"
        >
          <ArrowLeft size={16} />
          Back to blog
        </Link>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

        {/* Meta */}
        <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-8">
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

        {/* Cover image */}
        {post.mainImage?.asset?.url && (
          <img
            src={post.mainImage.asset.url}
            alt={post.title}
            className="w-full h-[420px] object-cover rounded-xl mb-10"
          />
        )}

        {/* Share */}
        <div className="flex items-center gap-3 mb-10">
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
          <aside className="lg:col-span-1 sticky top-24 h-fit">
            <TableOfContents body={post.body} />
          </aside>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* AI Summary */}
            {post.aiSummary && (
              <div className="mb-10">
                <AISummary summary={post.aiSummary} />
              </div>
            )}

            {/* Body */}
            <div className="prose prose-lg max-w-none">
              {post.body?.map((block, i) => {
                if (block._type === "code") {
                  return (
                    <pre key={i}>
                      <code className={`language-${block.language || "js"}`}>
                        {block.code}
                      </code>
                    </pre>
                  );
                }

                if (!block.children) return null;

                const text = block.children.map((c) => c.text).join("");
                if (!text.trim()) return null;

                const id = text.toLowerCase().replace(/[^\w]+/g, "-");

                if (block.style === "h2") {
                  return (
                    <h2 id={id} key={i}>
                      {text}
                    </h2>
                  );
                }

                if (block.style === "h3") {
                  return (
                    <h3 id={id} key={i}>
                      {text}
                    </h3>
                  );
                }

                if (block.style === "blockquote") {
                  return <blockquote key={i}>{text}</blockquote>;
                }

                return <p key={i}>{text}</p>;
              })}
            </div>

            {/* Author */}
            {post.author && (
              <div className="mt-14">
                <AuthorBio author={post.author} />
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        <div className="mt-20">
          <RelatedPosts currentPostId={post._id} categories={post.categories} />
        </div>
      </article>
    </>
  );
}
