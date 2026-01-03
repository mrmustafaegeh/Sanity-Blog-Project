// src/features/posts/components/PostHeader.jsx
import PostMeta from "./PostMeta";

export default function PostHeader({ post }) {
  return (
    <header className="post-header">
      <h1>{post.title}</h1>
      <PostMeta post={post} />
      {post.mainImage?.asset?.url && (
        <img
          src={post.mainImage.asset.url}
          alt={post.mainImage.alt || post.title}
          loading="lazy"
        />
      )}
    </header>
  );
}
