// src/features/posts/components/PostContent.jsx
import { PortableText } from "@portabletext/react";

export default function PostContent({ content }) {
  return (
    <section className="post-content">
      <PortableText value={content} />
    </section>
  );
}
