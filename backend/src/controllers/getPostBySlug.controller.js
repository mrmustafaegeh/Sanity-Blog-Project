// backend/src/controllers/getPostBySlug.controller.js
import sanityClient from "../lib/sanityClient.js"; // ← Add .js extension

export async function getPostBySlug(req, res) {
  const { slug } = req.params;

  const query = `*[_type=="post" && slug.current==$slug][0]{
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    _createdAt,
    mainImage{
      asset->{
        _id,
        url
      },
      alt
    },
    author->{
      name,
      slug,
      image,
      bio
    },
    category->{
      title,
      slug
    },
    body,
    aiSummary,
    "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180 )
  }`;

  const post = await sanityClient.fetch(query, { slug });

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  res.json(post);
}
