// frontend/src/pages/CategoryPostsPage.jsx
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useGetCategoryBySlugQuery } from "../api/postsAPI";
import { ArrowLeft, FolderOpen, Zap } from "lucide-react";
import PostCard from "../components/blog/PostCard";
import Button from "../components/ui/Button";

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <h2 className="text-2xl font-bold text-primary mb-2">Category Not Found</h2>
          <p className="text-secondary mb-6">{error?.data?.message || "Failed to load category posts"}</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!category && !isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <FolderOpen className="w-16 h-16 text-tertiary mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-primary mb-2">Unknown Category</h1>
          <p className="text-secondary mb-8">
            The category you are looking for does not exist.
          </p>
          <Link to="/categories">
             <Button variant="primary">Back to Categories</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-[1400px] mx-auto px-6 py-12 lg:py-20">
        
        {/* Header */}
        <div className="mb-12">
            <Link
                to="/categories"
                className="inline-flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                All Categories
            </Link>

            <div className="flex items-start gap-4">
                <div className="p-3 bg-neutral-100 rounded-xl hidden md:block">
                    <Zap className="w-8 h-8 text-primary" />
                </div>
                <div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
                        {category?.title}
                    </h1>
                    <p className="text-lg text-secondary max-w-2xl leading-relaxed">
                        {category?.description || `Explore our collection of articles on ${category?.title}.`}
                    </p>
                </div>
            </div>
        </div>

        <div className="border-t border-border mb-12"></div>

        {/* Posts Rendering */}
        {posts.length === 0 ? (
          <div className="text-center py-20 bg-neutral-50 rounded-xl border border-border border-dashed">
            <h3 className="text-xl font-bold text-primary mb-2">
              No articles yet
            </h3>
            <p className="text-secondary mb-6">
              Check back soon for new insights in this category.
            </p>
            <Link to="/blog">
              <Button variant="outline">Browse All Articles</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => {
                                setPage(i + 1);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                                page === i + 1
                                    ? "bg-primary text-white"
                                    : "bg-transparent text-secondary hover:bg-neutral-100"
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
