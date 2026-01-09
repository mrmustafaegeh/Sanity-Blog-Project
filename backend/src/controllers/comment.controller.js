import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

// Get comments for a post
export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({
      postId,
      isApproved: true,
    })
      .populate("author", "name username image")
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      comments,
    });
  } catch (error) {
    console.error("Error getting comments:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Add comment
export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, parentCommentId } = req.body;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const comment = new Comment({
      postId,
      author: req.user._id,
      content,
      parentCommentId: parentCommentId || null,
      isApproved: req.user.isAdmin || req.user.role === "moderator", // Auto-approve for admins/moderators
    });

    await comment.save();

    // Increment post comment count
    await Post.findByIdAndUpdate(postId, {
      $inc: { commentsCount: 1 },
    });

    // Populate author info
    await comment.populate("author", "name username image");

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update comment
export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check permissions
    if (
      comment.author.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to edit this comment",
      });
    }

    comment.content = content;
    comment.updatedAt = new Date();
    comment.isEdited = true;

    await comment.save();

    res.json({
      success: true,
      message: "Comment updated successfully",
      comment,
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete comment
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check permissions
    if (
      comment.author.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to delete this comment",
      });
    }

    // Decrement post comment count
    await Post.findByIdAndUpdate(comment.postId, {
      $inc: { commentsCount: -1 },
    });

    await Comment.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Like comment
export const likeComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const userId = req.user._id;
    const isLiked = comment.likes.includes(userId);

    if (isLiked) {
      // Remove like
      comment.likes = comment.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // Add like
      comment.likes.push(userId);
    }

    await comment.save();

    res.json({
      success: true,
      liked: !isLiked,
      likesCount: comment.likes.length,
    });
  } catch (error) {
    console.error("Error liking comment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
