// src/features/posts/components/PostMeta.jsx
export default function PostMeta({ post }) {
  return (
    <div className="post-meta">
      <span>{post.author?.name}</span>
      <span>•</span>
      <time dateTime={post.publishedAt}>
        {new Date(post.publishedAt).toLocaleDateString()}
      </time>
      <span>•</span>
      <span>{post.readingTime} min read</span>
    </div>
  );
}
