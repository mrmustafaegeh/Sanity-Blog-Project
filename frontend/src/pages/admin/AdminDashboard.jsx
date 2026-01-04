// frontend/src/pages/admin/AdminDashboard.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetPostsQuery, useDeletePostMutation } from "../../api/postsAPI";
import { useGetAdminAnalyticsQuery } from "../../api/adminAPI";
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
} from "lucide-react";

export default function AdminDashboard() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, isFetching } = useGetPostsQuery({ page, limit: 10 });
  const { data: analytics, isLoading: analyticsLoading } =
    useGetAdminAnalyticsQuery();
  const [deletePost] = useDeletePostMutation();

  const posts = data?.posts || [];
  const totalPosts = data?.total || 0;
  const totalPages = Math.ceil(totalPosts / 10);

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
            title="Total Views"
            value={analytics?.views || 0}
            icon={<Eye className="w-6 h-6" />}
            color="blue"
            loading={analyticsLoading}
          />
          <StatCard
            title="Total Likes"
            value={analytics?.likes || 0}
            icon={<Heart className="w-6 h-6" />}
            color="red"
            loading={analyticsLoading}
          />
          <StatCard
            title="Total Comments"
            value={analytics?.comments || 0}
            icon={<MessageSquare className="w-6 h-6" />}
            color="purple"
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
                value={analytics?.views || 0}
                max={10000}
                color="blue"
              />
              <ProgressBar
                label="Likes"
                value={analytics?.likes || 0}
                max={1000}
                color="red"
              />
              <ProgressBar
                label="Comments"
                value={analytics?.comments || 0}
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
                <span className="text-emerald-100">Avg. Views/Post</span>
                <span className="font-semibold">
                  {totalPosts > 0
                    ? Math.round((analytics?.views || 0) / totalPosts)
                    : 0}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-emerald-100">Engagement Rate</span>
                <span className="font-semibold">
                  {analytics?.views > 0
                    ? (
                        ((analytics?.likes + analytics?.comments) /
                          analytics?.views) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Management */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Table Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Manage Posts
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
                        {post.mainImage?.asset?.url && (
                          <img
                            src={post.mainImage.asset.url}
                            alt=""
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
                          to={`/blog/${post.slug?.current}`}
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
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                    })}
                  </div>
                  <button
                    disabled={page === totalPages || isFetching}
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon, color, loading }) {
  const colors = {
    emerald: "from-emerald-500 to-emerald-600",
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
