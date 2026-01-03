import { Helmet } from "react-helmet-async";

export default function ArticleSchema({ post, url }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.mainImage?.asset?.url,
    author: {
      "@type": "Person",
      name: post.author?.name,
    },
    publisher: {
      "@type": "Organization",
      name: "Your Blog Name",
    },
    datePublished: post.publishedAt,
    mainEntityOfPage: url,
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
