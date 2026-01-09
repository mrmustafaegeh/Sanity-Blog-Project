import Category from "../models/Category.js";
import Post from "../models/Post.js";

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      Category.find().sort({ title: 1 }).skip(skip).limit(limit).lean(),
      Category.countDocuments(),
    ]);

    res.json({
      success: true,
      categories,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error getting categories:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get category by slug with posts
export const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const category = await Category.findOne({ slug });
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const [posts, total] = await Promise.all([
      Post.find({
        categories: category._id,
        status: "published",
      })
        .populate("author", "name username")
        .populate("categories", "title slug")
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments({
        categories: category._id,
        status: "published",
      }),
    ]);

    res.json({
      success: true,
      category,
      posts,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error getting category:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Create category (admin only)
export const createCategory = async (req, res) => {
  try {
    const { title, description, color } = req.body;

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "-")
      .trim();

    // Check if category already exists
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = new Category({
      title,
      slug,
      description,
      color: color || "#6B7280",
      postCount: 0,
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update category (admin only)
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Update slug if title changed
    if (updates.title && updates.title !== category.title) {
      updates.slug = updates.title
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, "-")
        .trim();
    }

    Object.assign(category, updates);
    await category.save();

    res.json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete category (admin only)
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check if category has posts
    const postCount = await Post.countDocuments({ categories: id });
    if (postCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category with existing posts",
      });
    }

    await Category.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
