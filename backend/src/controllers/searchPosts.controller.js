import Post from "../models/Post.js";
import Category from "../models/Category.js";

// Search posts
export const searchPosts = async (req, res) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!q || q.trim() === "") {
      return res.json({
        success: true,
        posts: [],
        total: 0,
        pages: 0,
        currentPage: page,
      });
    }

    const searchQuery = {
      status: "published",
      $or: [
        { title: { $regex: q, $options: "i" } },
        { excerpt: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } },
      ],
    };

    const [posts, total] = await Promise.all([
      Post.find(searchQuery)
        .populate("author", "name username")
        .populate("categories", "title slug")
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments(searchQuery),
    ]);

    // Also search categories
    const categories = await Category.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ],
    })
      .limit(5)
      .lean();

    res.json({
      success: true,
      query: q,
      posts,
      categories,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error searching posts:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
