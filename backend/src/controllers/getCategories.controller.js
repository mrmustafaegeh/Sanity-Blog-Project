import sanityClient from "../lib/sanityClient.js";

export async function getCategories(req, res) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;
    const start = (page - 1) * limit;
    const end = start + limit;

    const categoriesQuery = `
      *[_type == "category"] | order(title asc) [${start}...${end}]{
        _id,
        title,
        slug,
        description,
        _createdAt,
        "postCount": count(*[_type == "post" && references(^._id)])
      }
    `;

    const totalQuery = `count(*[_type == "category"])`;

    const [categories, total] = await Promise.all([
      sanityClient.fetch(categoriesQuery),
      sanityClient.fetch(totalQuery),
    ]);

    res.json({
      categories,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
}
