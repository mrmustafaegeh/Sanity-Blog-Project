import { useParams } from "react-router-dom";
import { useGetPostBySlugQuery } from "../api/postsAPI";
import PostHeader from "../features/posts/components/PostHeader";
import PostContent from "../features/posts/components/PostContent";
import SEO from "../components/shared/SEO";
import ArticleSchema from "../components/ArticleSchema";
import PostSkeleton from "../features/posts/components/PostSkeleton";
import { useEffect } from "react";

export default function BlogPost() {
  const { slug } = useParams();
  console.log("1. Slug from URL:", slug);

  const {
    data: post,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useGetPostBySlugQuery(slug, {
    skip: !slug, // Don't call API if no slug
  });

  // Debug everything
  console.log("2. isLoading:", isLoading);
  console.log("3. isFetching:", isFetching);
  console.log("4. isError:", isError);
  console.log("5. Error object:", error);
  console.log("6. Post data:", post);
  console.log("7. Post type:", typeof post);

  // Try refetching if data is missing
  useEffect(() => {
    if (slug && !isLoading && !post) {
      console.log("Attempting to refetch...");
      refetch();
    }
  }, [slug, isLoading, post, refetch]);

  if (!slug) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold">Error: No slug provided</h1>
        <p className="text-gray-600">Please check the URL and try again.</p>
      </div>
    );
  }

  if (isLoading || isFetching) {
    console.log("8. Showing skeleton...");
    return <PostSkeleton />;
  }

  if (isError) {
    console.log("9. Showing error state...");
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-red-600">Error loading post</h1>
        <p>Status: {error?.status}</p>
        <p>Error: {JSON.stringify(error?.data || error)}</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  // CRITICAL: Check if post exists before accessing properties
  if (!post) {
    console.log("10. Post is undefined/null");
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold">Post not found</h1>
        <p className="text-gray-600 mt-2">No data returned from server.</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Use optional chaining for all properties
  const postTitle = post?.title || "Untitled Post";
  const postExcerpt = post?.excerpt || post?.description || "";
  const postImage =
    post?.mainImage?.asset?.url || post?.image || post?.thumbnail;
  const postPublishedAt = post?.publishedAt || post?.createdAt || post?.date;
  const postAuthor = post?.author?.name || post?.author || "Unknown";
  const postContent = post?.body || post?.content || "";

  console.log("11. Post properties extracted:", {
    title: postTitle,
    hasExcerpt: !!postExcerpt,
    hasImage: !!postImage,
    contentLength: postContent.length,
  });

  return (
    <>
      <SEO
        title={postTitle}
        description={postExcerpt}
        canonical={`${window.location.origin}/blog/${slug}`}
        image={postImage}
        publishedAt={postPublishedAt}
        author={postAuthor}
      />

      <ArticleSchema post={post} url={window.location.href} />

      <PostHeader post={post} />
      <PostContent content={postContent} />
    </>
  );
}
