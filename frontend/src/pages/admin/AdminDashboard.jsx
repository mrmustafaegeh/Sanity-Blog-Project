import { useState, useEffect } from "react";
import { 
  useGetPostsQuery, 
  useDeletePostMutation, 
  useUpdatePostMutation 
} from "../../api/postsAPI";
import { useGetAdminAnalyticsQuery } from "../../api/adminAPI";
import {
  useGetPendingSubmissionsQuery,
  useApproveSubmissionMutation,
  useRejectSubmissionMutation,
} from "../../api/submissionsAPI";
import { 
  LayoutDashboard, 
  FileText, 
  Clock, 
  X,
  AlertCircle
} from "lucide-react";
import { toast } from "react-toastify";

// New Redesigned Components
import AdminLayout from "../../components/admin/AdminLayout";
import DashboardStats from "../../components/admin/DashboardStats";
import PostDataTable from "../../components/admin/PostDataTable";
import SubmissionQueue from "../../components/admin/SubmissionQueue";

export default function AdminDashboard() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview"); // "overview", "posts", "submissions"
  const [rejectReason, setRejectReason] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);

  // API Hooks
  const { data, isLoading: postsLoading, isFetching } = useGetPostsQuery({ 
    page, 
    limit: 10,
    search: searchTerm 
  });
  const { data: analytics, isLoading: analyticsLoading } = useGetAdminAnalyticsQuery();
  const { data: pendingSubmissionsData, isLoading: pendingLoading, refetch: refetchPending } = useGetPendingSubmissionsQuery();
  
  const [deletePost] = useDeletePostMutation();
  const [updatePost] = useUpdatePostMutation();
  const [approveSubmission] = useApproveSubmissionMutation();
  const [rejectSubmission] = useRejectSubmissionMutation();

  const posts = data?.posts || [];
  const totalPosts = data?.total || 0;
  const totalPages = data?.pages || 1;
  const pendingSubmissions = pendingSubmissionsData || [];

  // URL Tab Sync
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab === "all") setActiveTab("posts");
    if (tab === "pending") setActiveTab("submissions");
  }, []);

  // Handlers
  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deletePost(id).unwrap();
        toast.success("Article deleted successfully");
      } catch {
        toast.error("Failed to delete article");
      }
    }
  };

  const handleToggleFeatured = async (id, currentStatus) => {
    try {
      await updatePost({ id, isFeatured: !currentStatus }).unwrap();
      toast.success(!currentStatus ? "Marked as featured" : "Removed from featured");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleApprove = async (submissionId) => {
    if (!window.confirm("Approve this submission and publish it live?")) return;
    try {
      await approveSubmission(submissionId).unwrap();
      toast.success("Submission approved and published!");
      refetchPending();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to approve submission");
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.warning("Please provide a rejection reason");
      return;
    }
    try {
      await rejectSubmission({ id: selectedSubmission._id, reason: rejectReason }).unwrap();
      toast.success("Submission rejected");
      setShowRejectModal(false);
      setRejectReason("");
      setSelectedSubmission(null);
      refetchPending();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to reject submission");
    }
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPage(1);
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-12 pb-20">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="animate-in slide-in-from-left duration-700">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-2">
              Command <span className="text-emerald-600">Center</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">
              Platform Intelligence & Management
            </p>
          </div>
          
          <div className="flex items-center gap-2 p-1.5 bg-white border border-slate-100 rounded-2xl shadow-xl animate-in slide-in-from-right duration-700">
            <button 
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all
              ${activeTab === "overview" ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"}`}
            >
              <LayoutDashboard size={18} />
              Overview
            </button>
            <button 
              onClick={() => setActiveTab("posts")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all
              ${activeTab === "posts" ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"}`}
            >
              <FileText size={18} />
              Articles
            </button>
            <button 
              onClick={() => setActiveTab("submissions")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all relative
              ${activeTab === "submissions" ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"}`}
            >
              <Clock size={18} />
              Review
              {pendingSubmissions.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-md">
                  {pendingSubmissions.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="transition-all duration-500">
          {activeTab === "overview" && (
            <div className="space-y-12 animate-in fade-in duration-700">
              <DashboardStats 
                analytics={analytics?.analytics} 
                totalPosts={totalPosts} 
                pendingCount={pendingSubmissions.length} 
                isLoading={analyticsLoading} 
              />
              
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl flex flex-col justify-center relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                    <LayoutDashboard size={200} />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-6">Engagement Health</h3>
                  <div className="space-y-8 relative z-10 font-bold">
                    <EngagementProgress label="Platform Visibility" value={analytics?.analytics?.totals?.totalViews || 0} max={10000} color="blue" />
                    <EngagementProgress label="Audience Interaction" value={analytics?.analytics?.totals?.totalLikes || 0} max={1000} color="rose" />
                    <EngagementProgress label="Community Discussion" value={analytics?.analytics?.comments?.total || 0} max={500} color="emerald" />
                  </div>
                </div>

                <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                    <AlertCircle size={200} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black mb-4 tracking-tight">System Status</h3>
                    <p className="text-slate-400 font-medium mb-8 leading-relaxed">Your content pipeline is active. {pendingSubmissions.length} submissions are currently awaiting editorial review.</p>
                  </div>
                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                       <span className="text-slate-400 font-bold text-sm">Server Latency</span>
                       <span className="text-emerald-400 font-black">24ms</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                       <span className="text-slate-400 font-bold text-sm">Curation Efficiency</span>
                       <span className="text-blue-400 font-black">94%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "posts" && (
            <div className="animate-in fade-in duration-700">
              <PostDataTable 
                posts={posts} 
                searchTerm={searchTerm} 
                setSearchTerm={handleSearchChange} 
                page={page} 
                setPage={setPage} 
                totalPages={totalPages} 
                handleDelete={handleDelete}
                handleToggleFeatured={handleToggleFeatured}
                isFetching={isFetching}
              />
            </div>
          )}

          {activeTab === "submissions" && (
            <div className="animate-in fade-in duration-700">
              <SubmissionQueue 
                submissions={pendingSubmissions} 
                handleApprove={handleApprove} 
                handleRejectTrigger={(sub) => {
                  setSelectedSubmission(sub);
                  setShowRejectModal(true);
                }} 
                isLoading={pendingLoading} 
              />
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal Redesigned */}
      {showRejectModal && selectedSubmission && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[100] p-6">
          <div className="bg-white rounded-[2.5rem] max-w-lg w-full p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Reject Draft</h3>
                <button onClick={() => setShowRejectModal(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-all">
                    <X size={24} />
                </button>
            </div>
            
            <div className="mb-8 space-y-2 font-bold">
                <p className="text-sm text-slate-400 uppercase tracking-widest">Target Article</p>
                <p className="text-lg text-slate-900 leading-tight">{selectedSubmission?.title}</p>
            </div>

            <p className="text-slate-500 font-medium mb-6 leading-relaxed">
              Please provide constructive feedback. The author will be notified so they can refine their work.
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500 transition-all font-medium text-slate-900 mb-8"
              rows={4}
              placeholder="Ex: Please add more images to section 2..."
            />

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
                className="px-6 py-4 text-slate-500 font-black text-sm uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all border border-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim()}
                className="px-6 py-4 bg-rose-500 text-white font-black text-sm uppercase tracking-widest hover:bg-rose-600 disabled:opacity-50 rounded-2xl shadow-lg shadow-rose-200 transition-all active:scale-95"
              >
                Reject & Notify
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function EngagementProgress({ label, value, max, color }) {
  const percentage = Math.min((value / max) * 100, 100);
  const colors = {
    blue: "bg-blue-600 shadow-blue-200",
    rose: "bg-rose-600 shadow-rose-200",
    emerald: "bg-emerald-600 shadow-emerald-200",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm uppercase tracking-widest font-black text-slate-400">{label}</span>
        <span className="text-sm font-black text-slate-900">
          {value.toLocaleString()} <span className="text-slate-300 mx-1">/</span> {max.toLocaleString()}
        </span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner">
        <div
          className={`${colors[color]} h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(0,0,0,0.1)]`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
