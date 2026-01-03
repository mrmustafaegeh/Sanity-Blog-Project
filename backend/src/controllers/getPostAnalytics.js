import PostEngagement from "../models/PostEngagement.model.js";

export const getPostAnalytics = async (req, res) => {
  const engagement = await PostEngagement.findOne({
    postId: req.params.id,
  });

  res.json({
    views: engagement?.views || 0,
    likes: engagement?.likes.length || 0,
    comments: engagement?.commentsCount || 0,
  });
};
