import sanityClient from "../lib/sanityClient.js";

export async function getPosts(req, res) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const category = req.query.category || null;
    const sort = req.query.sort || "newest";

    const start = (page - 1) * limit;
    const end = start + limit;

    // Build the GROQ query
    let filter = '_type == "post" && defined(slug.current)';

    // Add category filter if provided
    if (category) {
      filter += ` && "${category}" in categories[]._ref`;
    }

    // Sorting
    let order = "";
    if (sort === "newest") {
      order = "| order(publishedAt desc)";
    } else if (sort === "popular") {
      // If you have viewCount field, use it
      order = "| order(viewCount desc)";
    } else {
      order = "| order(publishedAt desc)";
    }

    const query = `
      {
        "posts": *[${filter}] ${order} [${start}...${end}] {
          _id,
          title,
          slug,
          excerpt,
          publishedAt,
          mainImage {
            asset->{
              _id,
              url,
              metadata {
                dimensions
              }
            },
            alt,
            hotspot,
            crop
          },
          author->{
            _id,
            name,
            slug,
            image
          },
          categories[]->{
            _id,
            title,
            slug,
            "postCount": count(*[_type == "post" && references(^._id)])
          },
          aiSummary,
          viewCount,
          "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180),
          _createdAt,
          _updatedAt
        },
        "total": count(*[${filter}])
      }
    `;

    const data = await sanityClient.fetch(query);

    // Calculate total pages
    const totalPages = Math.ceil(data.total / limit);

    res.json({
      success: true,
      page,
      limit,
      total: data.total,
      totalPages,
      posts: data.posts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
      error: error.message,
    });
  }
}
