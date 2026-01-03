import express from "express";
import sanityClient from "../lib/sanityClient.js";

const router = express.Router();

router.get("/rss.xml", async (req, res) => {
  const posts = await sanityClient.fetch(
    `*[_type=="post"] | order(publishedAt desc)[0...20]{
      title,
      excerpt,
      publishedAt,
      "slug": slug.current
    }`
  );

  const items = posts
    .map(
      (p) => `
      <item>
        <title>${p.title}</title>
        <link>/blog/${p.slug}</link>
        <description>${p.excerpt}</description>
        <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
      </item>
    `
    )
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>Your Blog Name</title>
      <link></link>
      <description>Latest posts</description>
      ${items}
    </channel>
  </rss>`;

  res.header("Content-Type", "application/xml");
  res.send(rss);
});

export default router;
