import Comment from "../models/Comment.js";

/* GET comments for a post */
export async function getComments(req, res) {
  const { postId } = req.params;

  const comments = await Comment.find({ postId })
    .populate("user", "name avatar")
    .sort({ createdAt: -1 });

  res.json(comments);
}

/* CREATE comment */
export async function addComment(req, res) {
  const { postId } = req.params;
  const { content } = req.body;

  if (!content?.trim()) {
    return res.status(400).json({ message: "Comment is empty" });
  }

  const comment = await Comment.create({
    postId,
    content,
    user: req.user.id,
  });

  const populated = await comment.populate("user", "name avatar");

  res.status(201).json(populated);
}

/* DELETE comment */
export async function deleteComment(req, res) {
  const { id } = req.params;

  const comment = await Comment.findById(id);
  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }

  if (comment.user.toString() !== req.user.id) {
    return res.status(403).json({ message: "Not allowed" });
  }

  await comment.deleteOne();
  res.json({ success: true });
}
