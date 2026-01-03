import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetPostsQuery, useDeletePostMutation } from "../../api/postsAPI";
import { useGetAdminAnalyticsQuery } from "../../api/adminAPI";

export default function AdminDashboard() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useGetPostsQuery({ page, limit: 10 });
  const { data: analytics } = useGetAdminAnalyticsQuery();
  const [deletePost] = useDeletePostMutation();

  const posts = data?.posts || [];
  const totalPosts = data?.total || 0;
  const totalPages = Math.ceil(totalPosts / 10);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (confirmDelete) {
      await deletePost(id);
    }
  };

  if (isLoading)
    return <p className="p-10 text-center">Loading dashboard...</p>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Stat title="Posts" value={totalPosts} />
        <Stat title="Views" value={analytics?.views || 0} />
        <Stat title="Likes" value={analytics?.likes || 0} />
        <Stat title="Comments" value={analytics?.comments || 0} />
      </div>

      {/* POSTS TABLE */}
      <div className="bg-white rounded-xl border overflow-x-auto shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Title</th>
              <th className="text-center">Views</th>
              <th className="text-center">Likes</th>
              <th className="text-center">Comments</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{post.title}</td>
                <td className="text-center">{post.views || 0}</td>
                <td className="text-center">{post.likesCount || 0}</td>
                <td className="text-center">{post.commentsCount || 0}</td>
                <td className="text-center flex justify-center items-center gap-2">
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                  <Link
                    to={`/blog/${post.slug?.current}`}
                    target="_blank"
                    className="text-emerald-600 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500">
                  No posts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            disabled={page === 1 || isFetching}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages || isFetching}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
