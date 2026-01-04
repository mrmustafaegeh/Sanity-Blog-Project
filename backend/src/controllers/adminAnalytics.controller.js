import PostEngagement from "../models/PostEngagement.js";
import Comment from "../models/Comment.js";

export const getAdminAnalytics = async (req, res) => {
  try {
    // Aggregate engagement stats
    const engagementStats = await PostEngagement.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" },
          totalLikes: { $sum: { $size: "$likes" } },
          totalCommentsCount: { $sum: "$commentsCount" },
        },
      },
    ]);

    // Get total actual comments (as a fallback/verification)
    const totalComments = await Comment.countDocuments({ isApproved: true });

    const stats = engagementStats[0] || {
      totalViews: 0,
      totalLikes: 0,
      totalCommentsCount: 0,
    };

    res.json({
      views: stats.totalViews,
      likes: stats.totalLikes,
      comments: Math.max(stats.totalCommentsCount, totalComments), // Use the higher count
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};
