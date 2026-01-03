// frontend/src/posts/components/BlogList.jsx
import { useGetPostsQuery } from "../../../api/postsAPI";
import PostsGrid from "./PostsGrid";
import SkeletonGrid from "../../../components/SkeletonGrid";
import ErrorState from "./ErrorState";

export default function BlogList() {
  const { data, isLoading, error } = useGetPostsQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <SkeletonGrid />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <ErrorState error={error} />
        </div>
      </div>
    );
  }

  if (!data || !data.posts || data.posts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Posts Found
          </h2>
          <p className="text-gray-600">
            There are no blog posts available at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">All Posts</h1>
        <PostsGrid posts={data.posts} />

        <div className="text-center text-gray-600 mt-8">
          Showing {data.posts.length} of {data.total} posts
        </div>
      </div>
    </div>
  );
}
