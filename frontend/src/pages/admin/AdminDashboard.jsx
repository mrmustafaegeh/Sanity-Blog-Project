// frontend/src/pages/admin/AdminDashboard.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetPostsQuery, useDeletePostMutation } from "../../api/postsAPI";
import { useGetAdminAnalyticsQuery } from "../../api/adminAPI";
import {
  useGetPendingSubmissionsQuery,
  useApproveSubmissionMutation,
  useRejectSubmissionMutation,
} from "../../api/submissionsAPI";
import {
  BarChart3,
  Eye,
  Heart,
  MessageSquare,
  FileText,
  Trash2,
  ExternalLink,
  TrendingUp,
  Users,
  Activity,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  User,
  Calendar,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function AdminDashboard() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // "all", "pending"
  const [rejectReason, setRejectReason] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const { data, isLoading, isFetching } = useGetPostsQuery({ page, limit: 10 });
  const { data: analytics, isLoading: analyticsLoading } =
    useGetAdminAnalyticsQuery();
  const {
    data: pendingSubmissionsData,
    isLoading: pendingLoading,
    refetch: refetchPending,
  } = useGetPendingSubmissionsQuery();
  const [deletePost] = useDeletePostMutation();
  const [approveSubmission] = useApproveSubmissionMutation();
  const [rejectSubmission] = useRejectSubmissionMutation();

  const posts = data?.posts || [];
  const totalPosts = data?.total || 0;
  const totalPages = Math.ceil(totalPosts / 10);
  const pendingSubmissions = pendingSubmissionsData || [];

  const handleDelete = async (id, title) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${title}"?`
    );
    if (confirmDelete) {
      try {
        await deletePost(id).unwrap();
      } catch (error) {
        alert("Failed to delete post");
      }
    }
  };

  const handleApprove = async (submissionId) => {
    if (!window.confirm("Approve this submission and publish to database?"))
      return;

    try {
      await approveSubmission(submissionId).unwrap();
      alert("Submission approved successfully!");
      refetchPending();
    } catch (error) {
      console.error("Approval error:", error);
      alert(error?.data?.message || "Failed to approve submission");
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }

    try {
      await rejectSubmission({
        id: selectedSubmission._id,
        reason: rejectReason,
      }).unwrap();

      alert("Submission rejected successfully!");
      setShowRejectModal(false);
      setRejectReason("");
      setSelectedSubmission(null);
      refetchPending();
    } catch (error) {
      alert(error?.data?.message || "Failed to reject submission");
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-emerald-600" />
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your blog content and monitor analytics
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                View Site
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Posts"
            value={totalPosts}
            icon={<FileText className="w-6 h-6" />}
            color="emerald"
            loading={analyticsLoading}
          />
          <StatCard
            title="Pending Review"
            value={pendingSubmissions.length}
            icon={<Clock className="w-6 h-6" />}
            color="yellow"
            loading={pendingLoading}
          />
          <StatCard
            title="Total Views"
            value={analytics?.analytics?.engagement?.totalViews || 0}
            icon={<Eye className="w-6 h-6" />}
            color="blue"
            loading={analyticsLoading}
          />
          <StatCard
            title="Total Likes"
            value={analytics?.analytics?.engagement?.totalLikes || 0}
            icon={<Heart className="w-6 h-6" />}
            color="red"
            loading={analyticsLoading}
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Engagement Overview
              </h3>
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="space-y-4">
              <ProgressBar
                label="Views"
                value={analytics?.analytics?.engagement?.totalViews || 0}
                max={10000}
                color="blue"
              />
              <ProgressBar
                label="Likes"
                value={analytics?.analytics?.engagement?.totalLikes || 0}
                max={1000}
                color="red"
              />
              <ProgressBar
                label="Comments"
                value={analytics?.analytics?.engagement?.totalComments || 0}
                max={500}
                color="purple"
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl shadow-sm p-6 text-white">
            <Activity className="w-8 h-8 mb-4 opacity-80" />
            <h3 className="text-lg font-semibold mb-2">Platform Health</h3>
            <p className="text-emerald-100 text-sm mb-4">
              Your blog is performing well with steady engagement growth.
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-emerald-100">Pending Submissions</span>
                <span className="font-semibold">
                  {pendingSubmissions.length}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-emerald-100">Engagement Rate</span>
                <span className="font-semibold">
                  {analytics?.analytics?.engagement?.totalViews > 0
                    ? (
                        ((analytics?.analytics?.engagement?.totalLikes +
                          analytics?.analytics?.engagement?.totalComments) /
                          analytics?.analytics?.engagement?.totalViews) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("all")}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "all"
                    ? "border-emerald-600 text-emerald-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                All Posts ({totalPosts})
              </button>
              <button
                onClick={() => setActiveTab("pending")}
                className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === "pending"
                    ? "border-yellow-500 text-yellow-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Clock className="w-4 h-4" />
                Pending Review ({pendingSubmissions.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === "all" ? (
          /* All Posts Table */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Table Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    All Published Posts
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {totalPosts} total posts
                  </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-initial">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search posts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Post Title
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <Eye className="w-4 h-4 mx-auto" />
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <Heart className="w-4 h-4 mx-auto" />
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <MessageSquare className="w-4 h-4 mx-auto" />
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPosts.map((post) => (
                    <tr
                      key={post._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {post.mainImage?.url && (
                            <img
                              src={post.mainImage.url}
                              alt={post.mainImage.alt || post.title}
                              className="w-12 h-12 rounded object-cover"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {post.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(post.publishedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm text-gray-900">
                          {post.views || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm text-gray-900">
                          {post.likesCount || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm text-gray-900">
                          {post.commentsCount || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            to={`/blog/${post.slug}`}
                            target="_blank"
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="View post"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(post._id, post.title)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete post"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredPosts.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">
                          {searchTerm
                            ? "No posts found matching your search"
                            : "No posts found"}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{page}</span> of{" "}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={page === 1 || isFetching}
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setPage(pageNum)}
                              className={`px-3 py-1 rounded-lg transition-colors ${
                                page === pageNum
                                  ? "bg-emerald-600 text-white"
                                  : "hover:bg-gray-100 text-gray-700"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}
                    </div>
                    <button
                      disabled={page === totalPages || isFetching}
                      onClick={() =>
                        setPage((p) => Math.min(p + 1, totalPages))
                      }
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Pending Submissions Table */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Table Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Submissions Pending Review
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {pendingSubmissions.length} submissions waiting for approval
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm text-yellow-600 font-medium">
                    Action Required
                  </span>
                </div>
              </div>
            </div>

            {/* Pending Submissions Table */}
            {pendingLoading ? (
              <div className="p-12 text-center">
                <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading pending submissions...</p>
              </div>
            ) : pendingSubmissions.length === 0 ? (
              <div className="p-12 text-center">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  All caught up!
                </h3>
                <p className="text-gray-600">
                  No pending submissions to review at the moment.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {pendingSubmissions.map((submission) => (
                  <div
                    key={submission._id}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      {/* Submission Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                              <Clock className="w-5 h-5 text-yellow-600" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-1">
                              {submission.title}
                            </h4>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
                              <span className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                                Submitted:{" "}
                                {formatDistanceToNow(
                                  new Date(submission.submittedAt),
                                  {
                                    addSuffix: true,
                                  }
                                )}
                              </span>
                              <span className="flex items-center">
                                <User className="w-3 h-3 mr-1" />
                                By:{" "}
                                {submission.userId?.name || "Unknown Author"}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                Reading: {submission.readingTime || 5} min
                              </span>
                            </div>

                            {/* Excerpt Preview */}
                            {submission.excerpt && (
                              <div className="mb-4">
                                <p className="text-sm text-gray-700 italic bg-gray-50 p-3 rounded-lg">
                                  "{submission.excerpt}"
                                </p>
                              </div>
                            )}

                            {/* Tags */}
                            {submission.tags && submission.tags.length > 0 && (
                              <div className="mb-3">
                                <span className="text-xs font-medium text-gray-500 mr-2">
                                  Tags:
                                </span>
                                <div className="inline-flex flex-wrap gap-1">
                                  {submission.tags.map((tag, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                                    >
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Difficulty */}
                            {submission.difficulty && (
                              <div className="mb-4">
                                <span
                                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                    submission.difficulty === "beginner"
                                      ? "bg-green-100 text-green-800"
                                      : submission.difficulty === "intermediate"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {submission.difficulty
                                    .charAt(0)
                                    .toUpperCase() +
                                    submission.difficulty.slice(1)}
                                </span>
                              </div>
                            )}

                            {/* Full Content Preview (collapsible) */}
                            <details className="group mb-4">
                              <summary className="text-sm font-medium text-emerald-600 hover:text-emerald-700 cursor-pointer list-none flex items-center gap-1">
                                <span>View full content</span>
                                <svg
                                  className="w-4 h-4 group-open:rotate-90 transition-transform"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </summary>
                              <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                                <div
                                  className="prose prose-sm max-w-none"
                                  dangerouslySetInnerHTML={{
                                    __html: submission.content,
                                  }}
                                />
                              </div>
                            </details>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="lg:w-48 flex flex-col gap-2">
                        <button
                          onClick={() => handleApprove(submission._id)}
                          className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setShowRejectModal(true);
                          }}
                          className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Reject Submission
            </h3>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Title:</span>{" "}
              {selectedSubmission?.title}
            </p>
            <p className="text-gray-600 mb-4">
              <span className="font-medium">Author:</span>{" "}
              {selectedSubmission?.userId?.name || "Unknown"}
            </p>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting this submission. The author
              will see this message.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows={4}
              placeholder="Explain why this submission is being rejected..."
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim()}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
              >
                Reject Submission
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Stat Card Component (updated with yellow color)
function StatCard({ title, value, icon, color, loading }) {
  const colors = {
    emerald: "from-emerald-500 to-emerald-600",
    yellow: "from-yellow-500 to-yellow-600",
    blue: "from-blue-500 to-blue-600",
    red: "from-red-500 to-red-600",
    purple: "from-purple-500 to-purple-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          {loading ? (
            <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <p className="text-3xl font-bold text-gray-900">
              {value.toLocaleString()}
            </p>
          )}
        </div>
        <div
          className={`w-12 h-12 bg-gradient-to-br ${colors[color]} rounded-lg flex items-center justify-center text-white`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

// Progress Bar Component
function ProgressBar({ label, value, max, color }) {
  const percentage = Math.min((value / max) * 100, 100);
  const colors = {
    blue: "bg-blue-600",
    red: "bg-red-600",
    purple: "bg-purple-600",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-600">
          {value.toLocaleString()} / {max.toLocaleString()}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`${colors[color]} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
