import { Link } from "react-router-dom";
import { User, Clock, Eye, Heart, ArrowRight } from "lucide-react";
import SanityImage from "../../../components/ui/SanityImage";

export default function PostCard({ post }) {
  const slug = post?.slug?.current || post?.slug;
  const readingTime = post.readingTime || post.estimatedReadingTime || 5;

  return (
    <article className="group relative bg-slate-800/40 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-white/10 hover:border-emerald-500/50 transition-all duration-300 transform-gpu translate-z-0 hover:scale-[1.01] hover:shadow-2xl hover:shadow-emerald-500/10">
      <Link to={slug ? `/blog/${encodeURIComponent(slug)}` : "/blog"} className="block">
        {/* Image Section */}
        <div className="relative h-64 overflow-hidden">
          <SanityImage
            image={post.mainImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-80" />
          
          {/* Categories Overlay */}
          <div className="absolute top-6 left-6 flex flex-wrap gap-2 max-w-[80%]">
            {post.categories?.map((cat, i) => (
              <span 
                key={i} 
                className="px-3 py-1 bg-emerald-500/20 backdrop-blur-md text-emerald-300 text-[10px] font-black uppercase tracking-wider rounded-full border border-emerald-500/30"
              >
                {cat.title || cat}
              </span>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8">
          <div className="flex items-center gap-4 mb-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-emerald-400" />
              {readingTime} min read
            </span>
          </div>

          <h3 className="text-2xl font-black text-white mb-4 line-clamp-2 leading-tight group-hover:text-emerald-400 transition-colors">
            {post.title}
          </h3>

          <p className="text-slate-400 text-sm mb-8 line-clamp-2 leading-relaxed font-medium">
            {post.excerpt || (post.aiSummary ? post.aiSummary.substring(0, 100) + "..." : "Dive into this insightful article about modern technology...")}
          </p>

          <div className="flex items-center justify-between pt-6 border-t border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full flex items-center justify-center border border-white/10">
                <User size={18} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-white text-sm font-bold leading-none mb-1">
                  {post.author?.name || "Anonymous"}
                </p>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Author</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-400">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1.5 text-white/90">
                  <Eye size={16} className="text-cyan-400" />
                  <span className="text-sm font-black">{post.views || 0}</span>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1.5 text-white/90">
                  <Heart size={16} className="text-rose-400" />
                  <span className="text-sm font-black">{post.likesCount || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
