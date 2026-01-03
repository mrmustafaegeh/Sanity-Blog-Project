import PostEngagement from "../models/PostEngagement.js";
import Comment from "../models/Comment.js";

export const getAdminAnalytics = async (req, res) => {
  const [engagementStats, totalComments] = await Promise.all([
    PostEngagement.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" },
          totalLikes: { $sum: { $size: "$likes" } },
          totalComments: { $sum: "$commentsCount" },
        },
      },
    ]),
    Comment.countDocuments(),
  ]);

  res.json({
    views: engagementStats[0]?.totalViews || 0,
    likes: engagementStats[0]?.totalLikes || 0,
    comments: totalComments || 0,
  });
};
