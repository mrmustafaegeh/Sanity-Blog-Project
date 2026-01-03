import { Helmet } from "react-helmet-async";

export default function SEO({
  title,
  description,
  canonical,
  image,
  type = "article",
  publishedAt,
  author,
}) {
  const siteName = "Your Blog Name";
  const twitterHandle = "@yourhandle";

  return (
    <Helmet>
      {/* Basic */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical || window.location.href} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      {image && <meta property="og:image" content={image} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* Article */}
      {publishedAt && (
        <meta property="article:published_time" content={publishedAt} />
      )}
      {author && <meta property="article:author" content={author} />}
    </Helmet>
  );
}
