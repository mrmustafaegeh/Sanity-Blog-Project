import PostEngagement from "../models/PostEngagement.js";

export async function toggleLike(req, res) {
  const { postId } = req.params;
  const userId = req.user.id;

  let engagement = await PostEngagement.findOne({ postId });

  if (!engagement) {
    engagement = await PostEngagement.create({
      postId,
      likes: [userId],
    });
    return res.json({ liked: true, likesCount: 1 });
  }

  const liked = engagement.likes.includes(userId);

  engagement.likes = liked
    ? engagement.likes.filter((id) => id.toString() !== userId)
    : [...engagement.likes, userId];

  await engagement.save();

  res.json({
    liked: !liked,
    likesCount: engagement.likes.length,
  });
}
