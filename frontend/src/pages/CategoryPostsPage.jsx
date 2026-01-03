// frontend/src/pages/CategoryPostsPage.jsx
import { useParams, Link } from "react-router-dom";
import {
  useGetPostsByCategoryQuery,
  useGetCategoriesQuery,
} from "../api/postsAPI";
import { ArrowLeft, FolderOpen } from "lucide-react";
import PostCard from "../components/blog/PostCard";
import LoadingGrid from "../components/ui/LoadingGrid";
import ErrorState from "../components/ui/ErrorState";

export default function CategoryPostsPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(1);

  const {
    data: postsData,
    isLoading,
    isError,
    error,
  } = useGetPostsByCategoryQuery({
    categoryId: slug,
    page,
    limit: 12,
  });

  const { data: categories = [] } = useGetCategoriesQuery();

  const category = categories.find(
    (cat) => cat.slug?.current === slug || cat._id === slug
  );
  const posts = postsData?.posts || [];
  const totalPages = postsData?.totalPages || 1;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="container mx-auto px-4">
          <LoadingGrid count={6} />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="container mx-auto px-4">
          <ErrorState message="Failed to load category posts" error={error} />
        </div>
      </div>
    );
  }

  if (!category && !isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-md mx-auto">
            <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Category Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The category you're looking for doesn't exist.
            </p>
            <Link
              to="/categories"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Categories</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Category Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-4 mb-6">
            <Link
              to="/categories"
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>All Categories</span>
            </Link>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-100">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                  {category?.title?.charAt(0) || "C"}
                </span>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {category?.title || "Category"}
                </h1>
                <p className="text-gray-600">
                  {category?.description ||
                    `Explore all posts in ${category?.title || "this category"}`}
                </p>
                <div className="flex items-center space-x-4 mt-3">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm rounded-full">
                    {postsData?.total || 0} posts
                  </span>
                  <span className="text-sm text-gray-500">
                    Last updated:{" "}
                    {new Date(
                      category?._updatedAt || Date.now()
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Posts */}
        {posts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No posts in this category yet
            </h3>
            <p className="text-gray-500 mb-6">
              There are no articles published in{" "}
              {category?.title || "this category"} yet.
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <span>Browse All Posts</span>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
