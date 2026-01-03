import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  return (
    <article className="post-card">
      <Link to={`/blog/${post.slug.current}`}>
        <img
          src={post.mainImage?.asset?.url}
          alt={post.mainImage?.alt || post.title}
          loading="lazy"
        />
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
      </Link>
    </article>
  );
}
