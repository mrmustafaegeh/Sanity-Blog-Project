import Comment from "../models/Comment.js";
import PostEngagement from "../models/PostEngagement.js";

export const getComments = async (req, res) => {
  const comments = await Comment.find({
    postId: req.params.postId,
    isApproved: true,
  }).populate("author", "name");

  res.json(comments);
};

export const addComment = async (req, res) => {
  const comment = await Comment.create({
    postId: req.params.postId,
    author: req.user.id,
    content: req.body.content,
  });

  res.status(201).json(comment);
};

export const deleteComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) return res.status(404).json({ message: "Not found" });

  if (comment.author.toString() !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  await comment.deleteOne();
  res.json({ success: true });
};
