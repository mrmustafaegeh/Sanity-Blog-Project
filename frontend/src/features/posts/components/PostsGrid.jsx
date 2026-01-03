import { Link } from "react-router-dom";

export default function PostsGrid({ posts }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <article
          key={post.slug.current}
          className="border rounded p-4 hover:shadow transition"
        >
          <h2 className="font-semibold text-lg mb-2">
            <Link to={`/blog/${post.slug.current}`}>{post.title}</Link>
          </h2>

          <p className="text-sm text-gray-600 mb-3">{post.excerpt}</p>

          {post.aiSummary && (
            <p className="text-xs bg-gray-100 p-2 rounded">{post.aiSummary}</p>
          )}
        </article>
      ))}
    </div>
  );
}
