import sanityClient from "../lib/sanityClient.js";

export async function searchPosts(req, res) {
  const q = req.query.q;

  if (!q) return res.json([]);

  const query = `
    *[_type == "post" && (
      title match $q ||
      excerpt match $q ||
      pt::text(body) match $q
    )] | order(publishedAt desc) {
      title,
      slug,
      excerpt,
      publishedAt
    }
  `;

  const posts = await sanityClient.fetch(query, {
    q: `*${q}*`,
  });

  res.json(posts);
}
