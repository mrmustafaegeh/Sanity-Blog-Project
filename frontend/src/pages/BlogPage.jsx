import { useSearchParams } from "react-router-dom";
import { useGetPostsQuery } from "../api/postsAPI";
import PostsGrid from "../features/posts/components/PostsGrid";
import Pagination from "../features/posts/components/Pagination";
import SkeletonGrid from "../components/SkeletonGrid";
import SearchBar from "../components/shared/SearchBar";

export default function BlogPage() {
  const [params, setParams] = useSearchParams();
  const page = Number(params.get("page") || 1);

  const { data, isLoading, isError } = useGetPostsQuery({
    page,
    limit: 6,
  });

  if (isLoading) return <SkeletonGrid />;
  if (isError) return <p className="text-center">Failed to load posts</p>;

  return (
    <section className="max-w-6xl mx-auto p-6 space-y-8">
      <SearchBar />

      <PostsGrid posts={data.posts} />

      <Pagination
        page={page}
        total={data.total}
        limit={6}
        onChange={(p) => setParams({ page: p })}
      />
    </section>
  );
}
