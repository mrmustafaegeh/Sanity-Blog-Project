// frontend/src/pages/CategoryPostsPage.jsx
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  useGetCategoryBySlugQuery,
} from "../api/postsAPI";
import { ArrowLeft, FolderOpen, Sparkles, Zap } from "lucide-react";
import PostCard from "../features/posts/components/PostCard";

export default function CategoryPostsPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(1);

  const {
    data: categoryData,
    isLoading,
    isError,
    error,
  } = useGetCategoryBySlugQuery(slug);

  const category = categoryData?.category;
  const posts = categoryData?.posts || [];
  const totalPages = categoryData?.pages || 1;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
          <p className="text-gray-400 font-medium">Gathering space dust...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-slate-800/50 backdrop-blur-xl p-10 rounded-3xl border border-white/10 max-w-md">
          <div className="text-5xl mb-4">🛸</div>
          <h2 className="text-2xl font-bold text-white mb-2">Transmission Lost</h2>
          <p className="text-gray-400 mb-6">{error?.data?.message || "Failed to load category posts"}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
          >
            Reconnect
          </button>
        </div>
      </div>
    );
  }

  if (!category && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md p-10 rounded-3xl backdrop-blur-xl border border-white/10">
          <FolderOpen className="w-20 h-20 text-emerald-500/20 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-2">Unknown Sector</h1>
          <p className="text-gray-400 mb-8">
            The category you're navigating to doesn't exist in this galaxy.
          </p>
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-semibold shadow-lg shadow-emerald-200"
          >
            <ArrowLeft size={20} />
            Back to Topics
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Category Header */}
        <div className="mb-16">
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white font-bold transition-all mb-8 group"
          >
            <div className="p-2 bg-white/5 rounded-full group-hover:bg-white/10 transition-all">
              <ArrowLeft size={18} />
            </div>
            <span>All Categories</span>
          </Link>

          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-3xl rounded-[3rem] p-10 lg:p-16 border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
              <Zap size={200} className="text-emerald-500" />
            </div>
            
            <div className="flex flex-col lg:flex-row lg:items-center gap-8 relative z-10">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/20 transform -rotate-3 group-hover:rotate-0 transition-transform">
                <Sparkles size={48} className="text-white" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-emerald-500/30">
                    Topic Exploration
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight">
                  {category?.title}
                </h1>
                <p className="text-slate-400 text-xl max-w-2xl leading-relaxed">
                  {category?.description || `A curated collection of expertise and insights focused on ${category?.title}.`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Rendering */}
        {posts.length === 0 ? (
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-20 text-center shadow-xl">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <FolderOpen size={40} className="text-emerald-500/40" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              No articles in this sector yet
            </h3>
            <p className="text-slate-400 text-lg mb-8 max-w-sm mx-auto">
              This category is currently empty. Check back soon for new insights.
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-10 py-5 bg-emerald-600 text-white font-black rounded-full hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95"
            >
              Explore Other Articles
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>

            {/* Pagination Grid-style */}
            {totalPages > 1 && (
              <div className="flex justify-center flex-wrap gap-3">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => {
                        setPage(i + 1);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`w-14 h-14 flex items-center justify-center rounded-2xl font-black transition-all ${
                      page === i + 1
                        ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-xl shadow-emerald-500/20 scale-110"
                        : "bg-slate-800/50 text-slate-400 border border-white/10 hover:bg-white/5"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
