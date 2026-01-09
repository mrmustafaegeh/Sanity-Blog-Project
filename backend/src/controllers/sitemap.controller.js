import Post from "../models/Post.js";
import Category from "../models/Category.js";

// Generate sitemap
export const generateSitemap = async (req, res) => {
  try {
    const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    // Get published posts
    const posts = await Post.find({ status: "published" })
      .select("slug updatedAt")
      .lean();

    // Get categories
    const categories = await Category.find().select("slug updatedAt").lean();

    // Generate XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Add homepage
    xml += `
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

    // Add blog page
    xml += `
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;

    // Add categories
    categories.forEach((category) => {
      xml += `
  <url>
    <loc>${baseUrl}/categories/${category.slug}</loc>
    <lastmod>${category.updatedAt.toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    // Add posts
    posts.forEach((post) => {
      xml += `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${post.updatedAt.toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    xml += "\n</urlset>";

    res.set("Content-Type", "application/xml");
    res.send(xml);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
