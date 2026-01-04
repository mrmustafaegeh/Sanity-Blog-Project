import Comment from "../models/Comment.js";
import PostEngagement from "../models/PostEngagement.js";

export const getComments = async (req, res) => {
  const comments = await Comment.find({
    postId: req.params.postId,
    isApproved: true,
  }).populate("author", "name email");

  res.json(comments);
};

export const addComment = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  // Create comment
  const comment = await Comment.create({
    postId,
    author: req.user.userId, // Fixed: using userId from JWT
    content,
    isApproved: true, // Auto-approve for now (or keep false for moderation)
  });

  // Increment comments count in PostEngagement
  await PostEngagement.findOneAndUpdate(
    { postId },
    { $inc: { commentsCount: 1 } },
    { upsert: true }
  );

  // Populate author before returning
  await comment.populate("author", "name email");

  res.status(201).json(comment);
};

export const deleteComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) return res.status(404).json({ message: "Not found" });

  // Check authorization
  if (
    comment.author.toString() !== req.user.userId &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ message: "Forbidden" });
  }

  // Decrement comments count
  await PostEngagement.findOneAndUpdate(
    { postId: comment.postId },
    { $inc: { commentsCount: -1 } }
  );

  await comment.deleteOne();
  res.json({ success: true });
};
