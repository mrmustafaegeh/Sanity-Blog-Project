import sanityClient from "../lib/sanityClient.js";

export async function getRecentPosts(req, res) {
  try {
    const limit = Number(req.query.limit) || 3;

    const query = `
      *[_type == "post" && defined(slug.current)] | order(publishedAt desc) [0...${limit}] {
        _id,
        title,
        slug,
        excerpt,
        publishedAt,
        mainImage {
          asset->{
            url
          }
        },
        author->{
          name
        },
        categories[]->{
          title
        }
      }
    `;

    const posts = await sanityClient.fetch(query);

    res.json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error("Error fetching recent posts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent posts",
    });
  }
}
