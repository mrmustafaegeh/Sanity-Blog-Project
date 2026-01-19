import { Link } from "react-router-dom";
import SanityImage from "../../../components/ui/SanityImage";

export default function PostCard({ post }) {
  // ✅ Works for BOTH:
  // Mongo: post.slug = "my-post"
  // Sanity: post.slug = { current: "my-post" }
  const slug = post?.slug?.current || post?.slug;

  return (
    <article className="post-card">
      <Link to={slug ? `/blog/${encodeURIComponent(slug)}` : "/blog"}>
        <SanityImage
          image={post.mainImage}
          alt={post.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
      </Link>
    </article>
  );
}
