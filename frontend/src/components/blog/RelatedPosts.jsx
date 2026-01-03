// frontend/src/components/blog/RelatedPosts.jsx
import { useGetRelatedPostsQuery } from "../../api/postsAPI";
import PostCard from "./PostCard";
import LoadingGrid from "../ui/LoadingGrid";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function RelatedPosts({ currentPostId, categories }) {
  const categoryIds = categories?.map((cat) => cat._id).filter(Boolean) || [];

  const {
    data: relatedPosts = [],
    isLoading,
    isError,
  } = useGetRelatedPostsQuery(
    {
      excludeId: currentPostId,
      categoryIds: categoryIds.slice(0, 2),
      limit: 3,
    },
    {
      skip: !currentPostId || categoryIds.length === 0,
    }
  );

  if (isLoading) {
    return (
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Posts</h3>
        <LoadingGrid count={3} />
      </div>
    );
  }

  if (isError || relatedPosts.length === 0) {
    return (
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">More to Read</h3>
          <Link
            to="/blog"
            className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center space-x-1 text-sm"
          >
            <span>Browse All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-dashed border-gray-300 p-8 text-center">
          <p className="text-gray-500 mb-3">No related posts found</p>
          <Link
            to="/blog"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-50 text-emerald-700 font-medium rounded-lg hover:bg-emerald-100 transition-colors text-sm"
          >
            <span>Explore All Articles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Related Posts</h3>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">You might also like</span>
          <Link
            to="/blog"
            className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center space-x-1 text-sm"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}
