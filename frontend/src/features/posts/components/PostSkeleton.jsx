// src/features/posts/components/PostSkeleton.jsx
export default function PostSkeleton() {
  return (
    <div className="post-skeleton">
      <div className="skeleton title" />
      <div className="skeleton meta" />
      <div className="skeleton image" />
      <div className="skeleton content" />
    </div>
  );
}
