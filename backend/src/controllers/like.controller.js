import Post from "../models/Post.js";

// Toggle like on post
export const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const userId = req.user._id.toString();
    const isLiked = post.likes.some((id) => id.toString() === userId);

    if (isLiked) {
      // Remove like
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      post.likesCount = Math.max(0, post.likesCount - 1);
    } else {
      // Add like
      post.likes.push(userId);
      post.likesCount += 1;
    }

    await post.save();

    res.json({
      success: true,
      liked: !isLiked,
      likesCount: post.likesCount,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
