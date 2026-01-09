// controllers/post.controller.js
import Post from "../models/Post.js";
import Category from "../models/Category.js";
import { generateSummary } from "../services/ai/aiSummary.service.js";
import { hashContent } from "../utils/hashContent.js";

// Get all posts with pagination and filters
export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build query
    const query = { status: "published" };

    // Category filter
    if (req.query.category) {
      const category = await Category.findOne({ slug: req.query.category });
      if (category) {
        query.categories = category._id;
      }
    }

    // Search filter
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { excerpt: { $regex: req.query.search, $options: "i" } },
        { content: { $regex: req.query.search, $options: "i" } },
      ];
    }

    // Sort options
    let sort = {};
    switch (req.query.sort) {
      case "popular":
        sort = { views: -1 };
        break;
      case "likes":
        sort = { likesCount: -1 };
        break;
      case "oldest":
        sort = { publishedAt: 1 };
        break;
      default:
        sort = { publishedAt: -1 }; // newest
    }

    const [posts, total] = await Promise.all([
      Post.find(query)
        .populate("author", "name username email image")
        .populate("categories", "title slug color")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments(query),
    ]);

    res.json({
      success: true,
      posts,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error getting posts:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get post by slug
export const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const query = { slug };

    // If not admin, only show published posts
    if (!req.user?.isAdmin) {
      query.status = "published";
    }

    const post = await Post.findOne(query)
      .populate("author", "name username email image bio")
      .populate("categories", "title slug color description");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check if user can view unpublished post
    if (
      post.status !== "published" &&
      req.user?._id !== post.author?._id &&
      !req.user?.isAdmin
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to view this post",
      });
    }

    res.json({ success: true, post });
  } catch (error) {
    console.error("Error getting post:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get recent posts
export const getRecentPosts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    const posts = await Post.find({ status: "published" })
      .populate("author", "name username")
      .populate("categories", "title slug")
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean();

    res.json({ success: true, posts });
  } catch (error) {
    console.error("Error getting recent posts:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get featured posts
export const getFeaturedPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      status: "published",
      isFeatured: true,
    })
      .populate("author", "name username")
      .populate("categories", "title slug")
      .sort({ publishedAt: -1 })
      .limit(1)
      .lean();

    res.json({ success: true, posts });
  } catch (error) {
    console.error("Error getting featured posts:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get popular posts
export const getPopularPosts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3;
    const days = parseInt(req.query.days) || 30;

    const date = new Date();
    date.setDate(date.getDate() - days);

    const posts = await Post.find({
      status: "published",
      publishedAt: { $gte: date },
    })
      .populate("author", "name username")
      .populate("categories", "title slug")
      .sort({ views: -1, likesCount: -1 })
      .limit(limit)
      .lean();

    res.json({ success: true, posts });
  } catch (error) {
    console.error("Error getting popular posts:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get related posts
export const getRelatedPosts = async (req, res) => {
  try {
    const { postId } = req.params;
    const limit = parseInt(req.query.limit) || 3;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const relatedPosts = await Post.find({
      _id: { $ne: postId },
      status: "published",
      categories: { $in: post.categories },
    })
      .populate("author", "name username")
      .populate("categories", "title slug")
      .limit(limit)
      .lean();

    res.json({ success: true, posts: relatedPosts });
  } catch (error) {
    console.error("Error getting related posts:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Create new post
export const createPost = async (req, res) => {
  try {
    const {
      title,
      content,
      excerpt,
      categories,
      tags,
      difficulty,
      readingTime,
      mainImage,
    } = req.body;

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "-")
      .trim();

    // Check if slug already exists
    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      return res.status(400).json({
        success: false,
        message: "A post with this title already exists",
      });
    }

    // Generate AI summary
    const aiHash = hashContent(content);
    let aiSummary = "";

    try {
      aiSummary = await generateSummary(content);
    } catch (aiError) {
      console.error("AI summary generation failed:", aiError);
      // Continue without AI summary
    }

    const post = new Post({
      title,
      slug,
      content,
      excerpt: excerpt || content.substring(0, 200) + "...",
      categories: categories || [],
      tags: tags || [],
      difficulty: difficulty || "beginner",
      readingTime: readingTime || Math.ceil(content.length / 1000), // 1 min per 1000 chars
      mainImage,
      author: req.user._id,
      aiSummary,
      aiHash,
      status: req.user.isAdmin ? "published" : "pending",
      publishedAt: req.user.isAdmin ? new Date() : null,
    });

    await post.save();

    // Update category post counts
    if (categories && categories.length > 0) {
      await Category.updateMany(
        { _id: { $in: categories } },
        { $inc: { postCount: 1 } }
      );
    }

    res.status(201).json({
      success: true,
      message: req.user.isAdmin
        ? "Post created successfully"
        : "Post submitted for review",
      post,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update post
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check permissions
    if (
      post.author.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to edit this post",
      });
    }

    // If content changed, update AI summary
    if (updates.content && updates.content !== post.content) {
      const newHash = hashContent(updates.content);
      if (newHash !== post.aiHash) {
        try {
          updates.aiSummary = await generateSummary(updates.content);
          updates.aiHash = newHash;
        } catch (aiError) {
          console.error("AI summary generation failed:", aiError);
        }
      }
    }

    // Update slug if title changed
    if (updates.title && updates.title !== post.title) {
      updates.slug = updates.title
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, "-")
        .trim();
    }

    // Update post
    Object.assign(post, updates);
    post.updatedAt = new Date();

    await post.save();

    res.json({
      success: true,
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check permissions
    if (
      post.author.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to delete this post",
      });
    }

    // Decrease category post counts
    if (post.categories.length > 0) {
      await Category.updateMany(
        { _id: { $in: post.categories } },
        { $inc: { postCount: -1 } }
      );
    }

    await Post.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Increment view count
export const incrementViewCount = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.json({
      success: true,
      views: post.views,
    });
  } catch (error) {
    console.error("Error incrementing view count:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Regenerate AI summary
export const regenerateSummary = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Generate new summary
    const newSummary = await generateSummary(post.content);
    const newHash = hashContent(post.content);

    // Update post with new summary
    post.aiSummary = newSummary;
    post.aiHash = newHash;

    // Add to history if field exists
    if (post.aiSummaryHistory) {
      post.aiSummaryHistory.push({
        summary: newSummary,
        createdAt: new Date(),
      });
    }

    await post.save();

    res.json({
      success: true,
      message: "AI summary regenerated",
      aiSummary: newSummary,
    });
  } catch (error) {
    console.error("Error regenerating AI summary:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get admin posts (all posts including drafts)
export const getAdminPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find()
        .populate("author", "name email")
        .populate("categories", "title slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments(),
    ]);

    res.json({
      success: true,
      posts,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error getting admin posts:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update post status (admin only)
export const updatePostStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    // Validate status
    const validStatuses = ["draft", "pending", "published", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    // If rejecting, require rejection reason
    if (status === "rejected" && !rejectionReason) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Update post
    post.status = status;
    if (status === "rejected") {
      post.rejectionReason = rejectionReason;
    } else {
      post.rejectionReason = undefined;
    }

    // Set publishedAt if publishing
    if (status === "published" && !post.publishedAt) {
      post.publishedAt = new Date();
    }

    // If publishing and was previously rejected, clear rejection reason
    if (status === "published" && post.rejectionReason) {
      post.rejectionReason = undefined;
    }

    post.updatedAt = new Date();

    await post.save();

    res.json({
      success: true,
      message: `Post status updated to ${status}`,
      post,
    });
  } catch (error) {
    console.error("Error updating post status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
