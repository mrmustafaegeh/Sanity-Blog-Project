import { Link } from "react-router-dom";
import { format } from "date-fns";
import { generateSrcSet, getOptimizedUrl } from "../../utils/imageOptimizer";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

export default function FeaturedPost({ post }) {
  if (!post) return null;

  const readingTime =
    post.readingTime || Math.ceil(post.body?.length / 1000) || 5;

  const imageUrl =
    post.mainImage?.url ||
    post.mainImage?.asset?.url ||
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

  return (
    <section className="mb-16 md:mb-24">
      <Link
        to={`/blog/${encodeURIComponent(post.slug?.current || post.slug)}`}
        className="group grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
      >
        {/* Image */}
        <div className="lg:col-span-7 relative aspect-[16/9] lg:aspect-[4/3] rounded-xl overflow-hidden bg-neutral-100">
           <img
              src={getOptimizedUrl(imageUrl, 1000)}
              srcSet={generateSrcSet(imageUrl, [600, 800, 1000])}
              sizes="(max-width: 1024px) 100vw, 60vw"
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="eager"
              fetchPriority="high"
            />
        </div>

        {/* Content */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-4 lg:pl-4">
          <div className="flex items-center gap-3 text-sm">
             <Badge variant="primary">Featured</Badge>
             {post.categories?.[0] && (
               <span className="text-secondary font-medium tracking-wide">
                 {post.categories[0].title}
               </span>
             )}
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-[1.1] tracking-tight group-hover:text-secondary transition-colors">
            {post.title}
          </h2>

          <div className="flex items-center gap-3 text-sm text-secondary pt-2">
            <span>{post.author?.name || "The Team"}</span>
            <span className="w-1 h-1 rounded-full bg-neutral-300" />
            <span>{post.publishedAt ? format(new Date(post.publishedAt), "MMMM d, yyyy") : "Recently"}</span>
             <span className="w-1 h-1 rounded-full bg-neutral-300" />
            <span>{readingTime} min read</span>
          </div>

          <p className="text-lg text-secondary leading-relaxed line-clamp-3">
             {post.excerpt || "Dive into this featured story to uncover new insights and perspectives..."}
          </p>
          
          <div className="pt-4">
             <span className="inline-block text-primary font-semibold border-b border-primary pb-0.5 group-hover:border-transparent transition-colors">
               Read Story
             </span>
          </div>
        </div>
      </Link>
    </section>
  );
}
