import sanityClient from "../lib/sanityClient.js";

export async function getPosts(req, res) {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const start = (page - 1) * limit;
  const end = start + limit;

  const query = `
    {
      "posts": *[_type == "post"] | order(publishedAt desc) [${start}...${end}] {
        title,
        slug,
        excerpt,
        publishedAt,
        aiSummary
      },
      "total": count(*[_type == "post"])
    }
  `;

  const data = await sanityClient.fetch(query);

  res.json({
    page,
    limit,
    total: data.total,
    posts: data.posts,
  });
}
