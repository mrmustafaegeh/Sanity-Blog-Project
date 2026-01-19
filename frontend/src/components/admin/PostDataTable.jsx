import { Link } from "react-router-dom";
import { Eye, Heart, MessageSquare, ExternalLink, Trash2, Search, ChevronLeft, ChevronRight, FileText, Star } from "lucide-react";

export default function PostDataTable({ 
  posts, 
  searchTerm, 
  setSearchTerm, 
  page, 
  setPage, 
  totalPages, 
  handleDelete, 
  handleToggleFeatured,
  isFetching 
}) {
  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
      {/* Table Header */}
      <div className="p-8 border-b border-slate-50">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Published Articles</h3>
            <p className="text-slate-500 font-medium text-sm mt-1">Manage your active content and monitor performance</p>
          </div>
          
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left bg-slate-50/50">
              <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Article Details</th>
              <th className="px-6 py-5 text-center text-xs font-black text-slate-400 uppercase tracking-widest">Stats</th>
              <th className="px-8 py-5 text-center text-xs font-black text-slate-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {posts.map((post) => (
              <tr key={post._id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md flex-shrink-0">
                      {post.mainImage?.url ? (
                        <img src={post.mainImage.url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                          <FileText size={20} />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-lg font-black text-slate-900 truncate mb-1">{post.title}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-400">
                          {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                        <div className="w-1 h-1 bg-slate-200 rounded-full" />
                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-md">Published</span>
                      </div>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-6 font-bold">
                   <div className="flex items-center justify-center gap-6">
                      <div className="text-center group/stat">
                        <div className="flex items-center gap-1.5 text-slate-900 mb-0.5">
                          <Eye size={16} className="text-blue-500" />
                          <span className="text-sm font-black">{post.views || 0}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-tighter font-black">Views</span>
                      </div>
                      <div className="text-center group/stat">
                        <div className="flex items-center gap-1.5 text-slate-900 mb-0.5">
                          <Heart size={16} className="text-rose-500" />
                          <span className="text-sm font-black">{post.likesCount || 0}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-tighter font-black">Likes</span>
                      </div>
                   </div>
                </td>

                <td className="px-8 py-6">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleToggleFeatured(post._id, post.isFeatured)}
                      className={`p-3 border rounded-xl shadow-sm transition-all active:scale-95 ${
                        post.isFeatured 
                          ? "bg-amber-50 border-amber-200 text-amber-500 hover:bg-amber-100" 
                          : "bg-white border-slate-100 text-slate-400 hover:text-amber-500 hover:border-amber-100"
                      }`}
                      title={post.isFeatured ? "Remove from featured" : "Mark as featured"}
                    >
                      <Star size={18} fill={post.isFeatured ? "currentColor" : "none"} />
                    </button>
                    <Link
                      to={`/blog/${post.slug}`}
                      target="_blank"
                      className="p-3 bg-white border border-slate-100 rounded-xl text-slate-600 hover:text-emerald-600 hover:border-emerald-100 hover:bg-emerald-50 shadow-sm transition-all active:scale-95"
                    >
                      <ExternalLink size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(post._id, post.title)}
                      className="p-3 bg-white border border-slate-100 rounded-xl text-slate-600 hover:text-rose-600 hover:border-rose-100 hover:bg-rose-50 shadow-sm transition-all active:scale-95"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {posts.length === 0 && (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center">
                  <div className="max-w-xs mx-auto">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                      <Search size={32} />
                    </div>
                    <h4 className="text-xl font-black text-slate-900 mb-1">No articles found</h4>
                    <p className="text-slate-500 font-medium text-sm italic">Maybe try a different search term?</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-8 bg-slate-50/30 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm font-bold text-slate-500">
            Showing Page <span className="text-slate-900">{page}</span> of <span className="text-slate-900">{totalPages}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1 || isFetching}
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30 transition-all font-bold"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex items-center gap-1.5 mx-2">
              {[...Array(Math.min(5, totalPages))].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-xl font-black text-sm transition-all
                  ${page === i + 1 
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" 
                    : "bg-white text-slate-500 hover:bg-slate-100"}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              disabled={page === totalPages || isFetching}
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30 transition-all font-bold"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
