import Comment from "../models/Comment.model.js";
import PostEngagement from "../models/PostEngagement.model.js";

export const getAllComments = async (req, res) => {
  const comments = await Comment.find()
    .populate("user", "name")
    .sort("-createdAt");

  res.json(comments);
};

export const approveComment = async (req, res) => {
  const comment = await Comment.findByIdAndUpdate(
    req.params.id,
    { isApproved: true },
    { new: true }
  );

  await PostEngagement.findOneAndUpdate(
    { postId: comment.postId },
    { $inc: { commentsCount: 1 } }
  );

  res.json(comment);
};

export const deleteComment = async (req, res) => {
  await Comment.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
