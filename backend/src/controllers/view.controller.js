import PostEngagement from "../models/PostEngagement.js";

export async function incrementView(req, res) {
  const { postId } = req.params;

  const post = await PostEngagement.findOneAndUpdate(
    { postId },
    { $inc: { views: 1 } },
    { upsert: true, new: true }
  );

  res.json({ views: post.views });
}
