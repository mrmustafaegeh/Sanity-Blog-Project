import { Link } from "react-router-dom";
import { format } from "date-fns";
import { generateSrcSet, getOptimizedUrl } from "../../utils/imageOptimizer";
import Badge from "../ui/Badge";
import Card from "../ui/Card";

export default function PostCard({ post, priority = false }) {
  const readingTime =
    post.readingTime || Math.ceil(post.body?.length / 1000) || 5;

  const imageUrl =
    post.mainImage?.url ||
    post.mainImage?.asset?.url ||
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  return (
    <Link
      to={`/blog/${encodeURIComponent(post.slug?.current || post.slug)}`}
      className="group block h-full"
    >
      <Card className="h-full flex flex-col border-none shadow-none bg-transparent rounded-none p-0 overflow-visible hover:border-transparent">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-neutral-100 mb-4">
          <img
            src={getOptimizedUrl(imageUrl, 600)}
            srcSet={generateSrcSet(imageUrl, [400, 600, 800])}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            alt={post.title}
            width={542}
            height={361}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading={priority ? "eager" : "lazy"}
            decoding="async"
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            {post.categories?.[0] && (
              <Badge variant="neutral" size="sm">
                {post.categories[0].title}
              </Badge>
            )}
            <span className="text-xs text-secondary font-medium uppercase tracking-wide">
              {post.publishedAt && format(new Date(post.publishedAt), "MMM d, yyyy")}
            </span>
          </div>

          <h3 className="text-lg font-bold text-primary mb-2 leading-tight group-hover:text-secondary transition-colors">
            {post.title}
          </h3>

          <p className="text-secondary text-sm line-clamp-2 md:line-clamp-3 mb-4 leading-relaxed">
            {post.excerpt || "Read more about this topic..."}
          </p>
          
          <div className="mt-auto flex items-center gap-2 text-xs font-medium text-tertiary">
             <span>{readingTime} min read</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
