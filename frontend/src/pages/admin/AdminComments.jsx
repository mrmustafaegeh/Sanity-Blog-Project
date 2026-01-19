import { useState } from "react";
import { 
  useGetAdminCommentsQuery, 
  useToggleCommentApprovalMutation, 
  useDeleteCommentMutation 
} from "../../api/adminAPI";
import AdminLayout from "../../components/admin/AdminLayout";
import { 
  MessageSquare, 
  Search, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  ExternalLink,
  User,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MessageCircle
} from "lucide-react";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";

export default function AdminComments() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data, isLoading, isFetching } = useGetAdminCommentsQuery({ 
    page, 
    limit: 15,
    search: searchTerm 
  });
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPage(1);
  };
  const [toggleApproval] = useToggleCommentApprovalMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const comments = data?.comments || [];
  const totalPages = data?.pages || 0;

  const handleToggleApproval = async (commentId, currentStatus) => {
    try {
      await toggleApproval(commentId).unwrap();
      toast.success(currentStatus ? "Comment unapproved" : "Comment approved");
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment? This action is permanent.")) {
      try {
        await deleteComment(commentId).unwrap();
        toast.success("Comment deleted");
      } catch (err) {
        toast.error("Failed to delete comment");
      }
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="animate-in slide-in-from-left duration-700">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-2">
              Conversation <span className="text-emerald-600">Guard</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">
              Moderate & Curate Community Dialogue
            </p>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-6 animate-in fade-in duration-700">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                   <MessageCircle size={24} />
                </div>
                <div>
                   <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Discussions</h3>
                   <p className="text-slate-500 font-medium text-sm">Managing {data?.total || 0} community responses</p>
                </div>
             </div>

             <div className="relative w-full sm:w-80">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
               <input 
                 type="text" 
                 placeholder="Search discussions..."
                 value={searchTerm}
                 onChange={(e) => handleSearchChange(e.target.value)}
                 className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
               />
             </div>
          </div>

          <div className="grid gap-6">
            {comments.map((comment) => (
              <div key={comment._id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8 hover:shadow-emerald-100/30 transition-all duration-500 group">
                 <div className="flex flex-col lg:flex-row justify-between gap-8">
                    {/* Comment Content */}
                    <div className="flex-1 min-w-0">
                       <div className="flex items-center gap-4 mb-6">
                          <img 
                            src={comment.author?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author?.name || "A")}&background=10b981&color=fff`} 
                            className="w-12 h-12 rounded-2xl object-cover shadow-sm border-2 border-white"
                            alt=""
                          />
                          <div>
                             <p className="text-lg font-black text-slate-900 leading-none mb-1">{comment.author?.name || "Anonymous"}</p>
                             <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                                <Calendar size={12} />
                                <span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                             </div>
                          </div>
                          
                          <div className={`ml-auto px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border
                          ${comment.isApproved ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                             {comment.isApproved ? 'Public' : 'Awaiting Review'}
                          </div>
                       </div>

                       <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-50 relative group-hover:bg-white transition-colors">
                          <p className="text-slate-700 font-medium leading-relaxed italic pr-12">
                             "{comment.content}"
                          </p>
                          <div className="absolute top-4 right-4 text-emerald-100 group-hover:text-emerald-500 transition-colors">
                             <MessageSquare size={24} />
                          </div>
                       </div>

                       <div className="mt-6 flex items-center gap-4">
                          <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest">
                             <ExternalLink size={12} className="text-emerald-500" />
                             On Link: 
                          </div>
                          <p className="text-sm font-black text-slate-900 truncate hover:text-emerald-600 transition-colors cursor-pointer capitalize">
                            {comment.post?.title || "Unknown Post"}
                          </p>
                       </div>
                    </div>

                    {/* Actions */}
                    <div className="lg:w-56 flex flex-col justify-center gap-3">
                       <button
                         onClick={() => handleToggleApproval(comment._id, comment.isApproved)}
                         className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2
                         ${comment.isApproved 
                           ? 'bg-amber-500 text-white shadow-amber-200 hover:bg-amber-600' 
                           : 'bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700'}`}
                       >
                          {comment.isApproved ? <XCircle size={16} /> : <CheckCircle size={16} />}
                          {comment.isApproved ? 'Revoke Access' : 'Publish Comment'}
                       </button>
                       <button
                         onClick={() => handleDelete(comment._id)}
                         className="w-full py-4 bg-white border border-rose-100 text-rose-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-rose-50 hover:bg-rose-50 transition-all active:scale-95 flex items-center justify-center gap-2"
                       >
                          <Trash2 size={16} />
                          Permanent Delete
                       </button>
                    </div>
                 </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-xl flex items-center justify-between">
              <p className="text-sm font-bold text-slate-500">
                Displaying batch <span className="text-slate-900 font-black">{page}</span> of <span className="text-slate-900 font-black">{totalPages}</span>
              </p>
              <div className="flex items-center gap-3">
                <button
                  disabled={page === 1 || isFetching}
                  onClick={() => setPage(p => Math.max(p - 1, 1))}
                  className="p-3 bg-slate-50 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-30 transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  disabled={page === totalPages || isFetching}
                  onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                  className="p-3 bg-slate-50 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-30 transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
