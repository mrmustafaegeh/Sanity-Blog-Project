// frontend/src/components/blog/PostCard.jsx
import { Link } from "react-router-dom";
import { Calendar, User, Clock, BookOpen } from "lucide-react";

export default function PostCard({ post, priority = false }) {
  const readingTime =
    post.readingTime || Math.ceil(post.body?.length / 1000) || 5;

  return (
    <Link
      to={`/blog/${post.slug?.current}`}
      className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-emerald-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden h-48">
        <img
          src={
            post.mainImage?.url ||
            post.mainImage?.asset?.url ||
            "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          }
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading={priority ? "eager" : "lazy"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category Badge */}
        {post.categories?.[0] && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-emerald-700 text-xs font-medium rounded-full">
              {post.categories[0].title}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </time>
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{readingTime} min</span>
            </div>
          </div>

          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <BookOpen className="w-3 h-3" />
            <span>{Math.floor(Math.random() * 100) + 50} views</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2">
          {post.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {post.excerpt ||
            "Discover insights and learnings from this article..."}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {post.author?.name?.charAt(0) || "A"}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {post.author?.name || "Anonymous"}
              </p>
              <p className="text-xs text-gray-500">Author</p>
            </div>
          </div>

          <div className="text-emerald-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
            Read →
          </div>
        </div>
      </div>
    </Link>
  );
}
