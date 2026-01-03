import sanityClient from "../lib/sanityClient.js";
import PostEngagement from "../models/PostEngagement.js";

export async function getPostBySlug(req, res) {
  const { slug } = req.params;
  const userId = req.user?.id; // optional auth

  const query = `*[_type=="post" && slug.current==$slug][0]{
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    _createdAt,
    mainImage{
      asset->{url},
      alt
    },
    author->{
      name,
      slug,
      image,
      bio
    },
    categories[]->{
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

  // 🔹 Get engagement data
  const engagement = await PostEngagement.findOne({
    postId: post._id,
  });

  res.json({
    ...post,

    likesCount: engagement?.likes.length || 0,
    likedByUser: userId ? engagement?.likes.includes(userId) : false,

    commentsCount: engagement?.commentsCount || 0,
    views: engagement?.views || 0,
  });
}
