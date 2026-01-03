// backend/src/controllers/getCategories.controller.js
import sanityClient from "../lib/sanityClient.js";

export async function getCategories(req, res) {
  try {
    const query = `*[_type == "category"]{
      _id,
      title,
      slug,
      description,
      "postCount": count(*[_type == "post" && references(^._id)])
    } | order(title asc)`;

    const categories = await sanityClient.fetch(query);
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
}
