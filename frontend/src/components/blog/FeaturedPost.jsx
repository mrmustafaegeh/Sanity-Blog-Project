// frontend/src/components/blog/FeaturedPost.jsx
import { Link } from "react-router-dom";
import { Calendar, User, Clock, ArrowRight } from "lucide-react";
import { generateSrcSet, getOptimizedUrl } from "../../utils/imageOptimizer";

export default function FeaturedPost({ post }) {
  if (!post) return null;

  const readingTime =
    post.readingTime || Math.ceil(post.body?.length / 1000) || 5;

  return (
    <section className="mb-16">
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-8 p-8">
          {/* Content */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-medium rounded-full">
                Featured
              </span>
              <span className="px-3 py-1 bg-white text-gray-600 text-sm font-medium rounded-full border border-gray-200">
                {post.categories?.[0]?.title || "Latest"}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {post.title}
            </h2>

            <p className="text-gray-600 text-lg">
              {post.excerpt ||
                "Read this featured article for insights and inspiration..."}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{post.author?.name || "Anonymous"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{readingTime} min read</span>
              </div>
            </div>

            <Link
              to={`/blog/${encodeURIComponent(post.slug?.current || post.slug)}`}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 text-white font-medium rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              <span>Read Full Article</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400 to-teal-300 rounded-2xl blur-xl opacity-20" />
            <img
              src={getOptimizedUrl(
                post.mainImage?.url ||
                post.mainImage?.asset?.url ||
                "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                1000
              )}
              srcSet={generateSrcSet(
                post.mainImage?.url ||
                post.mainImage?.asset?.url ||
                "https://images.unsplash.com/photo-1499750310107-5fef28a66643",
                [600, 800, 1000]
              )}
              sizes="(max-width: 768px) 100vw, 50vw"
              alt={post.title}
              width={1000}
              height={640}
              className="relative rounded-xl shadow-lg w-full h-64 md:h-80 object-cover"
              loading="eager"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
