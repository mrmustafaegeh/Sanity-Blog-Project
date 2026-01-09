import Post from "../models/Post.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import Submission from "../models/Submission.js";

// Get admin analytics
export const getAdminAnalytics = async (req, res) => {
  try {
    // Get counts
    const [
      totalPosts,
      publishedPosts,
      pendingPosts,
      totalUsers,
      totalAuthors,
      totalComments,
      pendingSubmissions,
    ] = await Promise.all([
      Post.countDocuments(),
      Post.countDocuments({ status: "published" }),
      Post.countDocuments({ status: "pending" }),
      User.countDocuments(),
      User.countDocuments({ role: { $in: ["author", "admin"] } }),
      Comment.countDocuments({ isApproved: true }),
      Submission.countDocuments({ status: "pending" }),
    ]);

    // Get engagement stats (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const engagementStats = await Post.aggregate([
      {
        $match: {
          publishedAt: { $gte: thirtyDaysAgo },
          status: "published",
        },
      },
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" },
          totalLikes: { $sum: "$likesCount" },
          totalComments: { $sum: "$commentsCount" },
        },
      },
    ]);

    // Get recent posts for timeline
    const recentPosts = await Post.find({ status: "published" })
      .populate("author", "name")
      .sort({ publishedAt: -1 })
      .limit(5)
      .select("title views likesCount commentsCount publishedAt")
      .lean();

    // Get popular categories
    const popularCategories = await Post.aggregate([
      { $match: { status: "published" } },
      { $unwind: "$categories" },
      {
        $group: {
          _id: "$categories",
          postCount: { $sum: 1 },
          totalViews: { $sum: "$views" },
        },
      },
      { $sort: { postCount: -1 } },
      { $limit: 5 },
    ]);

    // Populate category names
    const categoryIds = popularCategories.map((cat) => cat._id);
    const categories = await Category.find({ _id: { $in: categoryIds } })
      .select("title slug")
      .lean();

    const categoriesWithNames = popularCategories.map((cat) => {
      const category = categories.find(
        (c) => c._id.toString() === cat._id.toString()
      );
      return {
        ...cat,
        title: category?.title || "Unknown",
        slug: category?.slug || "",
      };
    });

    res.json({
      success: true,
      analytics: {
        posts: {
          total: totalPosts,
          published: publishedPosts,
          pending: pendingPosts,
          draft: totalPosts - publishedPosts - pendingPosts,
        },
        users: {
          total: totalUsers,
          authors: totalAuthors,
          admins: await User.countDocuments({ role: "admin" }),
        },
        engagement: engagementStats[0] || {
          totalViews: 0,
          totalLikes: 0,
          totalComments: 0,
        },
        comments: {
          total: totalComments,
          pending: await Comment.countDocuments({ isApproved: false }),
        },
        submissions: {
          pending: pendingSubmissions,
        },
      },
      recentPosts,
      popularCategories: categoriesWithNames,
    });
  } catch (error) {
    console.error("Error getting analytics:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
